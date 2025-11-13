import { getClient } from "@umami/api-client";
import {
  AnalyticsOverview,
  RealtimeData,
  SessionsResponse,
  TimeRange,
  LocationMetrics,
  LocationType,
  LocationMetric,
  EnvironmentMetrics,
  EnvironmentType,
} from "@/types/analytics";
import { startOfHour, subHours, startOfDay, subDays } from "date-fns";

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
  const now = new Date();

  if (range === "custom" && customStart && customEnd) {
    return {
      startAt: new Date(customStart).getTime(),
      endAt: new Date(customEnd).getTime(),
    };
  }

  switch (range) {
    case "24h":
      // Align to full hours: end at start of current hour, start 24 hours before
      const endAt = startOfHour(now);
      const startAt = subHours(endAt, 24);
      return {
        startAt: startAt.getTime(),
        endAt: endAt.getTime(),
      };
    case "7d":
      // Include partial today: start 6 days ago at start of day, end at now
      return {
        startAt: startOfDay(subDays(now, 6)).getTime(),
        endAt: now.getTime(),
      };
    case "30d":
      // Include partial today: start 29 days ago at start of day, end at now
      return {
        startAt: startOfDay(subDays(now, 29)).getTime(),
        endAt: now.getTime(),
      };
    default:
      // Default to 24h behavior
      const defaultEndAt = startOfHour(now);
      const defaultStartAt = subHours(defaultEndAt, 24);
      return {
        startAt: defaultStartAt.getTime(),
        endAt: defaultEndAt.getTime(),
      };
  }
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

    // Use pageviews endpoint for all ranges with appropriate unit
    // For 7d and 30d, use day unit to get daily buckets aligned to local days
    let unit: "hour" | "day" | "month" = "hour";
    if (range === "24h") {
      unit = "hour";
    } else if (range === "7d" || range === "30d") {
      unit = "day";
    } else if (range === "custom") {
      // For custom ranges, check if the duration is 7 days or less
      const durationDays = (endAt - startAt) / (1000 * 60 * 60 * 24);
      unit = durationDays <= 7 ? "hour" : "day";
    } else {
      unit = "hour";
    }

    const pageviewsResult = await client.getWebsitePageviews(websiteId, {
      startAt,
      endAt,
      unit,
      timezone,
    });

    // Transform pageviews to time series format
    if (pageviewsResult.ok && pageviewsResult.data) {
      const pageviews = pageviewsResult.data.pageviews || [];
      const sessions = pageviewsResult.data.sessions || [];

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
    // Re-throw error instead of returning default values
    throw error;
  }
}

/**
 * Fetch realtime analytics data from Umami API
 */
export async function getRealtimeAnalytics(): Promise<RealtimeData> {
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

  try {
    // Get timezone - use Intl API if available, otherwise default to UTC
    const timezone =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    // Ensure endpoint has protocol
    let baseUrl = endpoint;
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Make direct fetch call to realtime endpoint with timezone parameter
    const url = new URL(`${baseUrl}/realtime/${websiteId}`);
    url.searchParams.set("timezone", timezone);

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
        `Failed to fetch realtime data: ${response.status} ${
          response.statusText
        }. ${errorData.error?.message || ""}`
      );
    }

    const data = await response.json();
    return data as RealtimeData;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch sessions data from Umami API
 */
export async function getSessions(
  range: TimeRange = "24h",
  customStart?: string,
  customEnd?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SessionsResponse> {
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

  try {
    // Get timezone
    const timezone =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    // Calculate date range
    const { startAt, endAt } = getDateRange(range, customStart, customEnd);

    // Convert timestamps to ISO strings for the API
    const startDate = new Date(startAt).toISOString();
    const endDate = new Date(endAt).toISOString();

    // Ensure endpoint has protocol
    let baseUrl = endpoint;
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Build URL with query parameters
    const url = new URL(`${baseUrl}/websites/${websiteId}/sessions`);
    url.searchParams.set("startAt", startAt.toString());
    url.searchParams.set("endAt", endAt.toString());
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);
    url.searchParams.set("unit", range === "24h" ? "hour" : "day");
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("pageSize", pageSize.toString());

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
        `Failed to fetch sessions: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ""
        }`
      );
    }

    const data = await response.json();
    return data as SessionsResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch location metrics data from Umami API
 */
export async function getLocationMetrics(
  range: TimeRange = "24h",
  customStart?: string,
  customEnd?: string,
  limit: number = 10
): Promise<LocationMetrics> {
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

  try {
    // Get timezone
    const timezone =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    // Calculate date range
    const { startAt, endAt } = getDateRange(range, customStart, customEnd);

    // Determine unit based on range
    const unit = range === "24h" ? "hour" : "day";

    // Ensure endpoint has protocol
    let baseUrl = endpoint;
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Fetch metrics for each location type
    const fetchLocationType = async (
      type: LocationType
    ): Promise<LocationMetric[]> => {
      const url = new URL(`${baseUrl}/websites/${websiteId}/metrics`);
      url.searchParams.set("startAt", startAt.toString());
      url.searchParams.set("endAt", endAt.toString());
      url.searchParams.set("unit", unit);
      url.searchParams.set("timezone", timezone);
      url.searchParams.set("type", type);
      url.searchParams.set("limit", limit.toString());

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
          `Failed to fetch ${type} metrics: ${response.status} ${
            response.statusText
          }. ${errorData.error?.message || ""}`
        );
      }

      const data = await response.json();
      // Umami API returns array of { x: locationName, y: visitorCount }
      return Array.isArray(data) ? data : [];
    };

    // Fetch all location types in parallel
    const [countries, regions, cities] = await Promise.all([
      fetchLocationType("country"),
      fetchLocationType("region"),
      fetchLocationType("city"),
    ]);

    return {
      countries,
      regions,
      cities,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch environment metrics data from Umami API (browsers, OS, devices)
 */
export async function getEnvironmentMetrics(
  range: TimeRange = "24h",
  customStart?: string,
  customEnd?: string,
  limit: number = 10
): Promise<EnvironmentMetrics> {
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

  try {
    // Get timezone
    const timezone =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    // Calculate date range
    const { startAt, endAt } = getDateRange(range, customStart, customEnd);

    // Determine unit based on range
    const unit = range === "24h" ? "hour" : "day";

    // Ensure endpoint has protocol
    let baseUrl = endpoint;
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`;
    }

    // Fetch metrics for each environment type
    const fetchEnvironmentType = async (
      type: EnvironmentType
    ): Promise<LocationMetric[]> => {
      const url = new URL(`${baseUrl}/websites/${websiteId}/metrics`);
      url.searchParams.set("startAt", startAt.toString());
      url.searchParams.set("endAt", endAt.toString());
      url.searchParams.set("unit", unit);
      url.searchParams.set("timezone", timezone);
      url.searchParams.set("type", type);
      url.searchParams.set("limit", limit.toString());

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
          `Failed to fetch ${type} metrics: ${response.status} ${
            response.statusText
          }. ${errorData.error?.message || ""}`
        );
      }

      const data = await response.json();
      // Umami API returns array of { x: name, y: visitorCount }
      return Array.isArray(data) ? data : [];
    };

    // Fetch all environment types in parallel
    const [browsers, os, devices] = await Promise.all([
      fetchEnvironmentType("channel"),
      fetchEnvironmentType("os"),
      fetchEnvironmentType("device"),
    ]);

    return {
      browsers,
      os,
      devices,
    };
  } catch (error) {
    throw error;
  }
}
