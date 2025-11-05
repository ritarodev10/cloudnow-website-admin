import { NextRequest, NextResponse } from "next/server";
import { getSessions } from "@/lib/analytics/queries";
import { TimeRange } from "@/types/analytics";

/**
 * GET /api/analytics/sessions
 * Fetch sessions data from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as TimeRange) || "24h";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const data = await getSessions(range, startDate, endDate, page, pageSize);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[ANALYTICS] Error in sessions route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch sessions data",
      },
      { status: 500 }
    );
  }
}

