"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { EnvironmentMetrics, TimeRange } from "@/types/analytics";
import { queryKeys } from "@/lib/query-keys";

interface FetchEnvironmentParams {
  range?: TimeRange;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

async function fetchEnvironmentMetrics(
  params?: FetchEnvironmentParams
): Promise<EnvironmentMetrics> {
  const queryParams = new URLSearchParams();
  if (params?.range) queryParams.set("range", params.range);
  if (params?.startDate) queryParams.set("startDate", params.startDate);
  if (params?.endDate) queryParams.set("endDate", params.endDate);
  if (params?.limit) queryParams.set("limit", params.limit.toString());

  const url = `/api/analytics/environment${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch environment metrics");
  }

  const data = await response.json();
  return data.environment as EnvironmentMetrics;
}

export function useEnvironmentMetrics(
  params?: FetchEnvironmentParams,
  options?: Omit<UseQueryOptions<EnvironmentMetrics, Error>, "queryKey" | "queryFn">
) {
  return useQuery<EnvironmentMetrics, Error>({
    queryKey: queryKeys.analytics.environment(params as Record<string, unknown>),
    queryFn: () => fetchEnvironmentMetrics(params),
    ...options,
  });
}



