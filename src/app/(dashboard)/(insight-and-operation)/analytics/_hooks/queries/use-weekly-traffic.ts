"use client";

import { useMemo } from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface WeeklyTrafficData {
  [dayIndex: number]: {
    [hour: number]: number; // hour -> visitor count
  };
}

interface UseWeeklyTrafficParams {
  range?: string;
  startDate?: string;
  endDate?: string;
}

// Response format from API: number[][]
// [day0hours[], day1hours[], ..., day6hours[]]
// Each day array: [hour0, hour1, ..., hour23]
// day0 = Sunday, day6 = Saturday
async function fetchWeeklyTrafficData(
  params?: UseWeeklyTrafficParams
): Promise<number[][]> {
  // Calculate date range for past 7 days to get hourly data
  const endDate = params?.endDate ? new Date(params.endDate) : new Date();
  const startDate = params?.startDate
    ? new Date(params.startDate)
    : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  // Get client timezone
  const clientTimezone =
    typeof Intl !== "undefined" && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  const queryParams = new URLSearchParams();
  queryParams.set("startDate", startDate.toISOString());
  queryParams.set("endDate", endDate.toISOString());
  queryParams.set("timezone", clientTimezone);

  const url = `/api/analytics/weekly${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch weekly traffic data");
  }

  const data = await response.json();
  return data.weekly || [];
}

export function useWeeklyTraffic(
  params?: UseWeeklyTrafficParams,
  options?: Omit<UseQueryOptions<number[][], Error>, "queryKey" | "queryFn">
) {
  // Get client timezone for query key
  const clientTimezone =
    typeof Intl !== "undefined" && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  const {
    data: weeklyDataArray,
    isLoading,
    error,
  } = useQuery<number[][], Error>({
    queryKey: [
      "analytics",
      "weekly-traffic",
      params?.startDate,
      params?.endDate,
      clientTimezone,
    ],
    queryFn: () => fetchWeeklyTrafficData(params),
    ...options,
  });

  // Transform the API response (days × 24 hours array) into our data structure
  const weeklyData = useMemo<WeeklyTrafficData>(() => {
    if (!weeklyDataArray || weeklyDataArray.length === 0) {
      console.log("[WeeklyTraffic] No data array or empty");
      return {};
    }

    const data: WeeklyTrafficData = {};

    console.log("[WeeklyTraffic] Raw API data:", {
      arrayLength: weeklyDataArray.length,
      startDate: params?.startDate,
      endDate: params?.endDate,
      firstDaySample: weeklyDataArray[0]?.slice(0, 5), // First 5 hours of first day
    });

    // IMPORTANT: The Umami API always returns data in a fixed format:
    // arrayIndex 0 = Sunday, arrayIndex 1 = Monday, ..., arrayIndex 6 = Saturday
    // This is regardless of the startDate/endDate - it always returns a full week
    // in Sunday-Saturday order.
    weeklyDataArray.forEach((dayHours, arrayIndex) => {
      // arrayIndex directly maps to dayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
      const dayOfWeek = arrayIndex;

      if (dayOfWeek < 0 || dayOfWeek > 6) {
        console.warn(`Invalid day index: ${dayOfWeek}, expected 0-6`);
        return;
      }

      console.log(
        `[WeeklyTraffic] Mapping arrayIndex ${arrayIndex} to dayOfWeek ${dayOfWeek} (${
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek]
        })`
      );

      // Initialize the day if needed
      if (!data[dayOfWeek]) {
        data[dayOfWeek] = {};
      }

      // Process each hour (0-23)
      dayHours.forEach((visitors, hourIndex) => {
        if (hourIndex < 0 || hourIndex > 23) {
          console.warn(`Invalid hour index: ${hourIndex}, expected 0-23`);
          return;
        }

        if (visitors > 0) {
          console.log(
            `[WeeklyTraffic] Found ${visitors} visitors at dayOfWeek ${dayOfWeek} (${
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek]
            }), hour ${hourIndex}`
          );
        }

        // Store visitor count for this day/hour
        data[dayOfWeek][hourIndex] = visitors || 0;
      });
    });

    return data;
  }, [weeklyDataArray, params?.startDate]);

  const maxVisitors = useMemo(() => {
    let max = 0;
    Object.values(weeklyData).forEach((dayData) => {
      Object.values(dayData).forEach((count) => {
        if (typeof count === "number" && count > max) max = count;
      });
    });
    return max || 1; // Avoid division by zero
  }, [weeklyData]);

  return {
    data: weeklyData,
    maxVisitors,
    isLoading,
    error,
  };
}
