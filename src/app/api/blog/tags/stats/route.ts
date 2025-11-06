import { getTagStats } from "@/lib/tags/queries";
import { NextResponse } from "next/server";

/**
 * GET /api/blog/tags/stats
 * Fetch tag statistics
 */
export async function GET() {
  try {
    const stats = await getTagStats();

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("[TAGS] Error fetching stats:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}



