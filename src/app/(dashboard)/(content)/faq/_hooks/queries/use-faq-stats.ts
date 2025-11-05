"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FAQStats } from "@/types/faqs";
import { queryKeys } from "@/lib/query-keys";

async function fetchFAQStats(): Promise<FAQStats> {
  const response = await fetch("/api/faqs/stats");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch FAQ stats");
  }
  const data = await response.json();
  return data.stats as FAQStats;
}

export function useFAQStats(
  options?: Omit<UseQueryOptions<FAQStats, Error>, "queryKey" | "queryFn">
) {
  return useQuery<FAQStats, Error>({
    queryKey: queryKeys.faqs.stats,
    queryFn: fetchFAQStats,
    ...options,
  });
}


