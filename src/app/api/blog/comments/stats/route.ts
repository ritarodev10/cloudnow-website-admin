import { NextResponse } from "next/server";
import { getCommentStats } from "@/lib/comments/queries";

/**
 * GET /api/blog/comments/stats
 * Get statistics about blog comments
 */
export async function GET() {
  try {
    const stats = await getCommentStats();
    return NextResponse.json({ stats }, { status: 200 });
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

