import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/blog/categories/stats
 * Fetch statistics about blog categories
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from("blog_categories")
      .select("id, is_active");

    if (categoriesError) {
      console.error(
        "[BLOG_CATEGORIES] Error fetching categories for stats:",
        categoriesError
      );
      return NextResponse.json(
        { error: `Failed to fetch categories: ${categoriesError.message}` },
        { status: 500 }
      );
    }

    const total = categories?.length || 0;
    const active =
      categories?.filter((cat) => cat.is_active === true).length || 0;
    const inactive = total - active;

    // Get total posts count
    const { count: totalPosts, error: postsError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (postsError) {
      console.error(
        "[BLOG_CATEGORIES] Error fetching posts count:",
        postsError
      );
      // Don't fail the request, just set to 0
    }

    return NextResponse.json(
      {
        stats: {
          total,
          active,
          inactive,
          totalPosts: totalPosts || 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORIES] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}



