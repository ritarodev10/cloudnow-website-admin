import { createClient } from "@/lib/supabase/server";
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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
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

    console.log("[AUTH] Signup successful", { 
      email, 
      userId: data.user?.id,
      emailConfirmed: data.user?.email_confirmed_at ? "yes" : "no",
      sessionCreated: data.session ? "yes" : "no",
      duration: `${Date.now() - startTime}ms`
    });

    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 201 }
    );
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

