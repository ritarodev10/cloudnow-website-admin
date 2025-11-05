"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { RealtimeData } from "@/types/analytics";
import { queryKeys } from "@/lib/query-keys";

async function fetchRealtimeAnalytics(): Promise<RealtimeData> {
  const response = await fetch("/api/analytics/realtime");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch realtime analytics");
  }

  const data = await response.json();
  return data.realtime as RealtimeData;
}

export function useRealtimeAnalytics(
  options?: Omit<UseQueryOptions<RealtimeData, Error>, "queryKey" | "queryFn">
) {
  return useQuery<RealtimeData, Error>({
    queryKey: queryKeys.analytics.realtime(),
    queryFn: fetchRealtimeAnalytics,
    refetchInterval: 10000, // Refresh every 10 seconds for realtime data
    ...options,
  });
}

