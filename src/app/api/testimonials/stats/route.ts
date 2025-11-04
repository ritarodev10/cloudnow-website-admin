import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/testimonials/stats
 * Fetch testimonial statistics
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch testimonials and groups
    const [testimonialsResult, groupsResult] = await Promise.all([
      supabase.from("testimonials").select("*"),
      supabase.from("testimonial_groups").select("*"),
    ]);

    if (testimonialsResult.error) {
      console.error(
        "[TESTIMONIALS] Error fetching testimonials for stats:",
        testimonialsResult.error
      );
      return NextResponse.json(
        { error: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    if (groupsResult.error) {
      console.error(
        "[TESTIMONIALS] Error fetching groups for stats:",
        groupsResult.error
      );
      return NextResponse.json(
        { error: "Failed to fetch groups" },
        { status: 500 }
      );
    }

    const testimonials = testimonialsResult.data || [];
    const groups = groupsResult.data || [];

    const total = testimonials.length;
    const visible = testimonials.filter((t) => t.is_visible).length;
    const hidden = total - visible;

    const totalRating = testimonials.reduce(
      (sum, testimonial) => sum + testimonial.rating,
      0
    );
    const averageRating =
      total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0;

    const totalGroups = groups.length;
    const activeGroups = groups.filter((g) => g.is_active).length;
    const usedGroups = groups.filter((g) => g.usage_paths.length > 0).length;
    const unusedGroups = totalGroups - usedGroups;

    return NextResponse.json(
      {
        stats: {
          total,
          averageRating,
          visible,
          hidden,
          totalGroups,
          activeGroups,
          usedGroups,
          unusedGroups,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
