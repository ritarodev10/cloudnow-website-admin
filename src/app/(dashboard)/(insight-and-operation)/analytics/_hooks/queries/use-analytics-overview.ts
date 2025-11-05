"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AnalyticsOverview, TimeRange } from "@/types/analytics";
import { queryKeys } from "@/lib/query-keys";

interface FetchOverviewParams {
  range?: TimeRange;
  startDate?: string;
  endDate?: string;
}

async function fetchAnalyticsOverview(
  params?: FetchOverviewParams
): Promise<AnalyticsOverview> {
  const queryParams = new URLSearchParams();
  if (params?.range) queryParams.set("range", params.range);
  if (params?.startDate) queryParams.set("startDate", params.startDate);
  if (params?.endDate) queryParams.set("endDate", params.endDate);

  const url = `/api/analytics/overview${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch analytics overview");
  }

  const data = await response.json();
  return data.overview as AnalyticsOverview;
}

export function useAnalyticsOverview(
  params?: FetchOverviewParams,
  options?: Omit<UseQueryOptions<AnalyticsOverview, Error>, "queryKey" | "queryFn">
) {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: queryKeys.analytics.overview(params as Record<string, unknown>),
    queryFn: () => fetchAnalyticsOverview(params),
    ...options,
  });
}

