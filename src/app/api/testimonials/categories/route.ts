import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/testimonials/categories
 * Fetch all active testimonial category names from testimonial_groups
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonial_groups")
      .select("name")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("[TESTIMONIALS] Error fetching categories:", error);
      return NextResponse.json(
        { error: `Failed to fetch categories: ${error.message}` },
        { status: 500 }
      );
    }

    // Extract category names from the response
    const categories = (data || []).map((group) => group.name);

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

