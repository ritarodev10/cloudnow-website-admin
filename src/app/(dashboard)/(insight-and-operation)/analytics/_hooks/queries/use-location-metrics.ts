"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { LocationMetrics, TimeRange } from "@/types/analytics";
import { queryKeys } from "@/lib/query-keys";

interface FetchLocationParams {
  range?: TimeRange;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

async function fetchLocationMetrics(
  params?: FetchLocationParams
): Promise<LocationMetrics> {
  const queryParams = new URLSearchParams();
  if (params?.range) queryParams.set("range", params.range);
  if (params?.startDate) queryParams.set("startDate", params.startDate);
  if (params?.endDate) queryParams.set("endDate", params.endDate);
  if (params?.limit) queryParams.set("limit", params.limit.toString());

  const url = `/api/analytics/location${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch location metrics");
  }

  const data = await response.json();
  return data.location as LocationMetrics;
}

export function useLocationMetrics(
  params?: FetchLocationParams,
  options?: Omit<UseQueryOptions<LocationMetrics, Error>, "queryKey" | "queryFn">
) {
  return useQuery<LocationMetrics, Error>({
    queryKey: queryKeys.analytics.location(params as Record<string, unknown>),
    queryFn: () => fetchLocationMetrics(params),
    ...options,
  });
}



