import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PostStats } from "@/types/posts";

/**
 * GET /api/blog/posts/stats
 * Get statistics about blog posts
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get all posts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("status, views");

    if (postsError) {
      console.error("[BLOG_POSTS] Error fetching posts for stats:", postsError);
      return NextResponse.json(
        { error: `Failed to fetch posts: ${postsError.message}` },
        { status: 500 }
      );
    }

    // Calculate statistics
    const total = posts?.length || 0;
    const published =
      posts?.filter((post) => post.status === "published").length || 0;
    const drafts =
      posts?.filter((post) => post.status === "draft").length || 0;
    const scheduled =
      posts?.filter((post) => post.status === "scheduled").length || 0;
    const archived =
      posts?.filter((post) => post.status === "archived").length || 0;

    const totalViews =
      posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
    const averageViews = published > 0 ? Math.round(totalViews / published) : 0;

    const stats: PostStats = {
      total,
      published,
      drafts,
      scheduled,
      archived,
      totalViews,
      averageViews,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}



