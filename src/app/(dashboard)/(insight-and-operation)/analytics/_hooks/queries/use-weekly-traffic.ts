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

  // Transform the API response (7 days × 24 hours array) into our data structure
  const weeklyData = useMemo<WeeklyTrafficData>(() => {
    if (!weeklyDataArray || weeklyDataArray.length === 0) {
      return {};
    }

    const data: WeeklyTrafficData = {};

    // API returns days in chronological order starting from the startDate's day of week
    // We need to ensure the data is always ordered as: Sunday (0), Monday (1), ..., Saturday (6)
    let orderedData = weeklyDataArray;

    // If we have 7 days, check if we need to reorder to start with Sunday
    if (weeklyDataArray.length === 7 && params?.startDate) {
      const startDate = new Date(params.startDate);
      const startDayOfWeek = startDate.getDay(); // 0 = Sunday, 6 = Saturday

      // If the week doesn't start on Sunday, we need to rotate the array
      // Example: if startDayOfWeek = 6 (Saturday), weeklyDataArray[0] = Saturday, weeklyDataArray[1] = Sunday
      // We want: Sunday first, so we rotate: [weeklyDataArray[1..6], weeklyDataArray[0]]
      if (startDayOfWeek !== 0) {
        // Calculate how many positions to rotate: Sunday is at index (7 - startDayOfWeek) % 7
        // But simpler: we want index (7 - startDayOfWeek) % 7 to become index 0
        // For startDayOfWeek = 6: Sunday is at index 1, so rotate left by 1: [1,2,3,4,5,6,0]
        const rotationOffset = (7 - startDayOfWeek) % 7;
        orderedData = [
          ...weeklyDataArray.slice(rotationOffset), // Days from Sunday to end
          ...weeklyDataArray.slice(0, rotationOffset), // Days from beginning to before Sunday
        ];
      }
    }

    // API returns: [day0hours[], day1hours[], ..., day6hours[]]
    // day0 = Sunday (0), day1 = Monday (1), ..., day6 = Saturday (6)
    // Each day array has 24 elements: [hour0, hour1, ..., hour23]
    orderedData.forEach((dayHours, dayIndex) => {
      // dayIndex should be 0-6 (Sunday to Saturday)
      if (dayIndex < 0 || dayIndex > 6) {
        console.warn(`Invalid day index: ${dayIndex}, expected 0-6`);
        return;
      }

      // Initialize the day if needed
      if (!data[dayIndex]) {
        data[dayIndex] = {};
      }

      // Process each hour (0-23)
      dayHours.forEach((visitors, hourIndex) => {
        if (hourIndex < 0 || hourIndex > 23) {
          console.warn(`Invalid hour index: ${hourIndex}, expected 0-23`);
          return;
        }

        // Store visitor count for this day/hour
        data[dayIndex][hourIndex] = visitors || 0;
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
