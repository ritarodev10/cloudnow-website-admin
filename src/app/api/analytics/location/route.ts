import { NextRequest, NextResponse } from "next/server";
import { getLocationMetrics } from "@/lib/analytics/queries";
import { TimeRange } from "@/types/analytics";

/**
 * GET /api/analytics/location
 * Fetch location metrics (countries, regions, cities) from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as TimeRange) || "24h";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const data = await getLocationMetrics(range, startDate, endDate, limit);

    return NextResponse.json(
      {
        location: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ANALYTICS] Error in location route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch location metrics",
      },
      { status: 500 }
    );
  }
}

