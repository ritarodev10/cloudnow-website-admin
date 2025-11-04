import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/testimonials/groups
 * Fetch all testimonial groups
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonial_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[TESTIMONIALS] Error fetching testimonial groups:", error);
      return NextResponse.json(
        { error: `Failed to fetch groups: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ groups: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
