import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@umami/api-client";

/**
 * Create a configured Umami API client
 */
function createUmamiClient() {
  const apiKey = process.env.UMAMI_API_KEY;
  const apiUrl = process.env.UMAMI_API_URL || "https://api.umami.is";

  if (!apiKey) {
    throw new Error("UMAMI_API_KEY environment variable is not set");
  }

  // For Umami Cloud, use /v1 prefix
  let endpoint = apiUrl;
  if (!endpoint.endsWith("/v1") && !endpoint.endsWith("/api")) {
    if (endpoint.includes("api.umami.is")) {
      endpoint = endpoint.replace(/\/$/, "") + "/v1";
    } else {
      endpoint = endpoint.replace(/\/$/, "") + "/api";
    }
  }

  return getClient({
    apiKey,
    apiEndpoint: endpoint,
  });
}

/**
 * GET /api/analytics/weekly
 * Fetch weekly traffic statistics from Umami API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          error: "startDate and endDate query parameters are required",
        },
        { status: 400 }
      );
    }

    const client = createUmamiClient();
    const websiteId =
      process.env.UMAMI_WEBSITE_ID || "4c0162c3-3a17-4187-a16a-161b50c79bbd";

    // Convert date strings to ISO timestamps
    const startAt = new Date(startDate).toISOString();
    const endAt = new Date(endDate).toISOString();

    // Fetch weekly data using the weekly endpoint
    const weeklyResult = await client.getWebsiteSessionsWeekly(websiteId, {
      startAt,
      endAt,
    });

    if (!weeklyResult.ok) {
      throw new Error(
        `Failed to fetch weekly stats: ${JSON.stringify(weeklyResult.error)}`
      );
    }

    // Transform weekly data (number[][]) to time series format
    const weeklyData = weeklyResult.data || [];
    const timeSeries = weeklyData.map((week: number[], index: number) => {
      // WebsiteSessionWeekly format: [[timestamp, visitors, views, ...], ...]
      // Extract timestamp (first element) and visitors/views
      const timestampMs = week[0];
      const visitors = week[1] || 0;
      const views = week[2] || week[1] || 0;

      const timestamp = timestampMs
        ? new Date(timestampMs).toISOString()
        : new Date(
            new Date(startDate).getTime() + index * 7 * 24 * 60 * 60 * 1000
          ).toISOString();

      return {
        timestamp,
        visitors,
        views,
      };
    });

    return NextResponse.json(
      {
        weekly: {
          timeSeries,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ANALYTICS] Error in weekly route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch weekly analytics data",
      },
      { status: 500 }
    );
  }
}
