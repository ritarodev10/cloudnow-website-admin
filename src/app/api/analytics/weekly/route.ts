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
 * Returns data in format: [day0hours[], day1hours[], ..., day6hours[]]
 * where each day array has 24 hours: [hour0, hour1, ..., hour23]
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const timezone = searchParams.get("timezone") || "UTC";

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          error: "startDate and endDate query parameters are required",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.UMAMI_API_KEY;
    const apiUrl = process.env.UMAMI_API_URL || "https://api.umami.is";
    const websiteId =
      process.env.UMAMI_WEBSITE_ID || "4c0162c3-3a17-4187-a16a-161b50c79bbd";

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

    // Ensure endpoint has protocol
    let baseUrl = endpoint;
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Convert dates to timestamps (milliseconds)
    const startAt = new Date(startDate).getTime();
    const endAt = new Date(endDate).getTime();

    console.log("[API Weekly] Date conversion:", {
      receivedStartDate: startDate,
      receivedEndDate: endDate,
      convertedStartAt: startAt,
      convertedEndAt: endAt,
      startDateISO: new Date(startAt).toISOString(),
      endDateISO: new Date(endAt).toISOString(),
      timezone,
    });

    // Call the sessions/weekly endpoint with unit=hour
    const url = new URL(`${baseUrl}/websites/${websiteId}/sessions/weekly`);
    url.searchParams.set("startAt", startAt.toString());
    url.searchParams.set("endAt", endAt.toString());
    url.searchParams.set("unit", "hour");
    url.searchParams.set("timezone", timezone);

    console.log("[API Weekly] Umami API URL:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-umami-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch weekly stats: ${response.status} ${
          response.statusText
        }. ${errorData.error?.message || ""}`
      );
    }

    // Response format: [[hour0, hour1, ..., hour23], ...] for 7 days
    // First array = Sunday, last array = Saturday
    const weeklyData = await response.json();

    return NextResponse.json(
      {
        weekly: weeklyData || [],
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
