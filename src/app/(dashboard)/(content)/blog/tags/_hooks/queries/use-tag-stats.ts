"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TagStats } from "@/types/tags";
import { queryKeys } from "@/lib/query-keys";

async function fetchTagStats(): Promise<TagStats> {
  const response = await fetch("/api/blog/tags/stats");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tag stats");
  }
  const data = await response.json();
  return data.stats;
}

export function useTagStats(
  options?: Omit<UseQueryOptions<TagStats, Error>, "queryKey" | "queryFn">
) {
  return useQuery<TagStats, Error>({
    queryKey: queryKeys.blog.tags.stats,
    queryFn: fetchTagStats,
    ...options,
  });
}

