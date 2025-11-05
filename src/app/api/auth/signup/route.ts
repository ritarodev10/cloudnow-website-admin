import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const { email, password } = await request.json();

    console.log("[AUTH] Signup attempt started", { email, timestamp: new Date().toISOString() });

    if (!email || !password) {
      console.log("[AUTH] Signup failed: Missing credentials", { email: email || "none" });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("[AUTH] Signup failed: Password too short", { email, passwordLength: password.length });
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log("[AUTH] Supabase client created for signup", { email });
    
    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email redirect
      },
    });

    if (error) {
      console.log("[AUTH] Signup failed", { 
        email, 
        error: error.message, 
        errorCode: error.status,
        duration: `${Date.now() - startTime}ms`
      });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      console.log("[AUTH] Signup failed: No user created", { email });
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

      // Auto-confirm user email using admin client
      try {
        const adminClient = createAdminClient();
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
          data.user.id,
          {
            email_confirm: true, // Auto-confirm email
          }
        );

        if (updateError) {
          console.log("[AUTH] Failed to auto-confirm email", {
            email,
            userId: data.user.id,
            error: updateError.message,
          });
          // Continue anyway - user might still be able to log in if email confirmation is disabled in Supabase settings
        } else {
          console.log("[AUTH] Email auto-confirmed successfully", {
            email,
            userId: data.user.id,
          });
        }

        // Sign in the user to create a session (now that email is confirmed)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.log("[AUTH] Failed to create session after signup", {
            email,
            error: signInError.message,
          });
          // Return user data anyway - they can log in manually
          return NextResponse.json(
            { 
              user: data.user, 
              session: null,
              message: "Account created successfully. Please sign in.",
            },
            { status: 201 }
          );
        }

        console.log("[AUTH] Signup successful with auto-confirmation", { 
          email, 
          userId: data.user?.id,
          emailConfirmed: true,
          sessionCreated: signInData.session ? "yes" : "no",
          duration: `${Date.now() - startTime}ms`
        });

        return NextResponse.json(
          { user: signInData.user, session: signInData.session },
          { status: 201 }
        );
    } catch (adminError) {
      // If admin client fails (e.g., SERVICE_ROLE_KEY not set), still return success
      // User can manually confirm or sign in if email confirmation is disabled in Supabase dashboard
      console.log("[AUTH] Admin client error (continuing anyway)", {
        email,
        error: adminError instanceof Error ? adminError.message : "Unknown error",
      });

      return NextResponse.json(
        { 
          user: data.user, 
          session: data.session,
          message: "Account created. If email verification is required, please check your email.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[AUTH] Signup error (unexpected)", { 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`
    });
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

