"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { SessionsResponse, TimeRange } from "@/types/analytics";
import { queryKeys } from "@/lib/query-keys";

interface FetchSessionsParams {
  range?: TimeRange;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

async function fetchSessions(
  params?: FetchSessionsParams
): Promise<SessionsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.range) queryParams.set("range", params.range);
  if (params?.startDate) queryParams.set("startDate", params.startDate);
  if (params?.endDate) queryParams.set("endDate", params.endDate);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.pageSize) queryParams.set("pageSize", params.pageSize.toString());

  const url = `/api/analytics/sessions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch sessions");
  }

  const data = await response.json();
  return data as SessionsResponse;
}

export function useAnalyticsSessions(
  params?: FetchSessionsParams,
  options?: Omit<UseQueryOptions<SessionsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery<SessionsResponse, Error>({
    queryKey: queryKeys.analytics.sessions(params as Record<string, unknown>),
    queryFn: () => fetchSessions(params),
    ...options,
  });
}




