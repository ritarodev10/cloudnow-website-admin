import { NextRequest, NextResponse } from "next/server";
import { getEnvironmentMetrics } from "@/lib/analytics/queries";
import { TimeRange } from "@/types/analytics";

/**
 * GET /api/analytics/environment
 * Fetch environment metrics (browsers, OS, devices) from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as TimeRange) || "24h";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const data = await getEnvironmentMetrics(range, startDate, endDate, limit);

    return NextResponse.json(
      {
        environment: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ANALYTICS] Error in environment route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch environment metrics",
      },
      { status: 500 }
    );
  }
}
