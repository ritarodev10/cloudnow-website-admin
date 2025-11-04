import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { email, password } = await request.json();

    console.log("[AUTH] Login attempt started", {
      email,
      timestamp: new Date().toISOString(),
    });

    if (!email || !password) {
      console.log("[AUTH] Login failed: Missing credentials", {
        email: email || "none",
      });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log("[AUTH] Supabase client created for login", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("[AUTH] Login failed", {
        email,
        error: error.message,
        errorCode: error.status,
        duration: `${Date.now() - startTime}ms`,
      });
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.log("[AUTH] Login successful", {
      email,
      userId: data.user?.id,
      sessionId: data.session?.access_token?.substring(0, 20) + "...",
      duration: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AUTH] Login error (unexpected)", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${Date.now() - startTime}ms`,
    });
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
