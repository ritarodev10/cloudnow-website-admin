import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const startTime = Date.now();
  
  try {
    console.log("[AUTH] Logout attempt started", { timestamp: new Date().toISOString() });
    
    const supabase = await createClient();
    
    // Get user info before logout for logging
    const { data: { user } } = await supabase.auth.getUser();
    console.log("[AUTH] Supabase client created for logout", { userId: user?.id });
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("[AUTH] Logout failed", { 
        userId: user?.id,
        error: error.message, 
        errorCode: error.status,
        duration: `${Date.now() - startTime}ms`
      });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("[AUTH] Logout successful", { 
      userId: user?.id,
      duration: `${Date.now() - startTime}ms`
    });

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("[AUTH] Logout error (unexpected)", { 
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

