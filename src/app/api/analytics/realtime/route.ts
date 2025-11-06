import { NextRequest, NextResponse } from "next/server";
import { getRealtimeAnalytics } from "@/lib/analytics/queries";

/**
 * GET /api/analytics/realtime
 * Fetch realtime analytics data from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const data = await getRealtimeAnalytics();

    return NextResponse.json(
      {
        realtime: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ANALYTICS] Error in realtime route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch realtime analytics data",
      },
      { status: 500 }
    );
  }
}



