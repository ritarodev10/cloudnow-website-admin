import { getClient } from "@umami/api-client";
import { AnalyticsOverview } from "@/types/analytics";

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
 * Calculate date range from time range type (returns timestamps)
 */
function getDateRange(
  range: "24h" | "7d" | "30d" | "custom",
  customStart?: string,
  customEnd?: string
): { startAt: number; endAt: number } {
  const end = new Date();
  const start = new Date();

  if (range === "custom" && customStart && customEnd) {
    return {
      startAt: new Date(customStart).getTime(),
      endAt: new Date(customEnd).getTime(),
    };
  }

  switch (range) {
    case "24h":
      start.setHours(start.getHours() - 24);
      break;
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    default:
      start.setHours(start.getHours() - 24);
  }

  return {
    startAt: start.getTime(),
    endAt: end.getTime(),
  };
}

/**
 * Fetch analytics overview data from Umami API
 */
export async function getAnalyticsOverview(
  range: "24h" | "7d" | "30d" | "custom" = "24h",
  customStart?: string,
  customEnd?: string
): Promise<AnalyticsOverview> {
  const client = createUmamiClient();
  const websiteId =
    process.env.UMAMI_WEBSITE_ID || "4c0162c3-3a17-4187-a16a-161b50c79bbd";
  const { startAt, endAt } = getDateRange(range, customStart, customEnd);

  try {
    // Fetch stats using official client
    const statsResult = await client.getWebsiteStats(websiteId, {
      startAt,
      endAt,
    });

    if (!statsResult.ok) {
      throw new Error(
        `Failed to fetch stats: ${JSON.stringify(statsResult.error)}`
      );
    }

    const stats = statsResult.data;
    if (!stats) {
      throw new Error("Stats data is undefined");
    }

    // Extract values from stats (Umami API returns { value, prev } structure)
    const visitorsValue =
      typeof stats.visitors === "object"
        ? stats.visitors.value
        : stats.visitors || 0;
    const visitsValue =
      typeof stats.visits === "object" ? stats.visits.value : stats.visits || 0;
    const pageviewsValue =
      typeof stats.pageviews === "object"
        ? stats.pageviews.value
        : stats.pageviews || 0;
    const bouncesValue =
      typeof stats.bounces === "object"
        ? stats.bounces.value
        : stats.bounces || 0;
    const totaltimeValue =
      typeof stats.totaltime === "object"
        ? stats.totaltime.value
        : stats.totaltime || 0;

    // Calculate bounce rate percentage
    const bounceRate = visitsValue > 0 ? (bouncesValue / visitsValue) * 100 : 0;

    // Calculate average time (totaltime is in seconds, visits is the count)
    const avgTime =
      visitsValue > 0 ? Math.round(totaltimeValue / visitsValue) : 0;

    // Fetch time series data
    // Use weekly endpoint for 7d and 30d, pageviews for 24h
    const timezone =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    let timeSeries: Array<{
      timestamp: string;
      visitors: number;
      views: number;
    }> = [];

    // Use weekly endpoint for 7d and 30d ranges
    if (range === "7d" || range === "30d") {
      // Weekly endpoint expects startAt and endAt as ISO strings
      const startAtStr = new Date(startAt).toISOString();
      const endAtStr = new Date(endAt).toISOString();

      const weeklyResult = await client.getWebsiteSessionsWeekly(websiteId, {
        startAt: startAtStr,
        endAt: endAtStr,
      });

      if (weeklyResult.ok && weeklyResult.data) {
        // WebsiteSessionWeekly is number[][] - array of arrays
        // Each inner array represents a week: [timestamp, visitors, views, ...]
        const weeklyData = weeklyResult.data || [];

        timeSeries = weeklyData.map((week: number[], index: number) => {
          // weeklyData format: [[timestamp, visitors, views, ...], ...]
          // Extract timestamp (first element) and visitors/views
          const timestampMs = week[0];
          const visitors = week[1] || 0;
          const views = week[2] || week[1] || 0;

          const timestamp = timestampMs
            ? new Date(timestampMs).toISOString()
            : new Date(startAt + index * 7 * 24 * 60 * 60 * 1000).toISOString();

          return {
            timestamp,
            visitors,
            views,
          };
        });

        console.log("[Analytics] Weekly timeSeries:", timeSeries);
      } else {
        console.error("[Analytics] Weekly request failed:", weeklyResult.error);
      }
    } else {
      // Use regular pageviews endpoint for 24h with hourly granularity
      let unit: "hour" | "day" | "month" = "hour";
      if (range === "24h") {
        unit = "hour";
      } else {
        unit = "day";
      }

      const pageviewsResult = await client.getWebsitePageviews(websiteId, {
        startAt,
        endAt,
        unit,
        timezone,
      });

      // Transform pageviews to time series format
      if (pageviewsResult.ok && pageviewsResult.data) {
        console.log(
          "[Analytics] Pageviews response:",
          JSON.stringify(pageviewsResult.data, null, 2)
        );

        const pageviews = pageviewsResult.data.pageviews || [];
        const sessions = pageviewsResult.data.sessions || [];

        console.log("[Analytics] Pageviews array:", pageviews);
        console.log("[Analytics] Sessions array:", sessions);

        // Match pageviews and sessions by timestamp
        const timeMap = new Map<
          string,
          { visitors: number; views: number; timestampMs?: number }
        >();

        // Process pageviews - Umami API returns { x: timestamp, y: value }
        pageviews.forEach((pv: any) => {
          // Timestamp is in 'x' field (ISO string), value is in 'y' field
          const timestamp = pv.x || pv.t || pv.timestamp || pv.date || null;
          if (!timestamp) {
            console.warn("[Analytics] Pageview missing timestamp:", pv);
            return;
          }

          // Ensure timestamp is an ISO string
          const timestampStr =
            typeof timestamp === "number"
              ? new Date(timestamp).toISOString()
              : timestamp;

          const existing = timeMap.get(timestampStr) || {
            visitors: 0,
            views: 0,
            timestampMs:
              typeof timestamp === "number"
                ? timestamp
                : new Date(timestampStr).getTime(),
          };
          timeMap.set(timestampStr, {
            ...existing,
            views: pv.y || pv.pageviews || pv.views || 0,
            timestampMs:
              typeof timestamp === "number"
                ? timestamp
                : existing.timestampMs || new Date(timestampStr).getTime(),
          });
        });

        // Process sessions - Umami API returns { x: timestamp, y: value }
        sessions.forEach((sess: any) => {
          // Timestamp is in 'x' field (ISO string), value is in 'y' field
          const timestamp =
            sess.x || sess.t || sess.timestamp || sess.date || null;
          if (!timestamp) {
            console.warn("[Analytics] Session missing timestamp:", sess);
            return;
          }

          // Ensure timestamp is an ISO string
          const timestampStr =
            typeof timestamp === "number"
              ? new Date(timestamp).toISOString()
              : timestamp;

          const existing = timeMap.get(timestampStr) || {
            visitors: 0,
            views: 0,
            timestampMs:
              typeof timestamp === "number"
                ? timestamp
                : new Date(timestampStr).getTime(),
          };
          timeMap.set(timestampStr, {
            ...existing,
            visitors: sess.y || sess.visitors || sess.uniques || 0,
            timestampMs:
              typeof timestamp === "number"
                ? timestamp
                : existing.timestampMs || new Date(timestampStr).getTime(),
          });
        });

        // Sort by timestamp and convert to array
        timeSeries = Array.from(timeMap.entries())
          .filter(([timestamp]) => timestamp && timestamp.length > 0) // Filter out empty timestamps
          .sort(([a], [b]) => {
            // Sort by timestamp value
            const aMs = timeMap.get(a)?.timestampMs || new Date(a).getTime();
            const bMs = timeMap.get(b)?.timestampMs || new Date(b).getTime();
            return aMs - bMs;
          })
          .map(([timestamp, data]) => ({
            timestamp,
            visitors: data.visitors,
            views: data.views,
          }));

        console.log("[Analytics] Transformed timeSeries:", timeSeries);
      } else {
        console.error(
          "[Analytics] Pageviews request failed:",
          pageviewsResult.error
        );
      }
    }

    // Extract comparison values (prev) from stats
    const visitorsPrev =
      stats && typeof stats.visitors === "object" ? stats.visitors.prev : 0;
    const visitsPrev =
      stats && typeof stats.visits === "object" ? stats.visits.prev : 0;
    const pageviewsPrev =
      stats && typeof stats.pageviews === "object" ? stats.pageviews.prev : 0;

    return {
      visitors: {
        value: visitorsValue || 0,
        change: visitorsPrev || 0,
      },
      visits: {
        value: visitsValue || 0,
        change: visitsPrev || 0,
      },
      views: {
        value: pageviewsValue || 0,
        change: pageviewsPrev || 0,
      },
      bounceRate: {
        value: bounceRate,
        change: 0, // TODO: Calculate from comparison data
      },
      visitDuration: {
        value: avgTime,
        change: 0, // TODO: Calculate from comparison data
      },
      timeSeries,
    };
  } catch (error) {
    console.error("[Analytics] Error fetching overview:", error);

    // Return empty data structure on error
    return {
      visitors: { value: 0, change: 0 },
      visits: { value: 0, change: 0 },
      views: { value: 0, change: 0 },
      bounceRate: { value: 0, change: 0 },
      visitDuration: { value: 0, change: 0 },
      timeSeries: [],
    };
  }
}
