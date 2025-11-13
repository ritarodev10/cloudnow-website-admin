import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CommentFilters } from "@/types/comments";
import { getComments } from "@/lib/comments/queries";

/**
 * GET /api/blog/comments
 * Fetch all comments with optional filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const posts = searchParams.get("posts");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    const filters: CommentFilters = {
      search: search || "",
      status: (status as any) || "all",
      posts: posts ? posts.split(",") : [],
      sortBy: (sortBy as any) || "date",
      sortOrder: (sortOrder as any) || "desc",
    };

    const comments = await getComments(filters);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("[BLOG_COMMENTS] Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

