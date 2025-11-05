import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsOverview } from "@/lib/analytics/queries";
import { TimeRange } from "@/types/analytics";

/**
 * GET /api/analytics/overview
 * Fetch analytics overview statistics from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as TimeRange) || "24h";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const data = await getAnalyticsOverview(range, startDate, endDate);

    return NextResponse.json(
      {
        overview: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ANALYTICS] Error in overview route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
