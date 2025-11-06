"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoryStats } from "@/types/categories";
import { queryKeys } from "@/lib/query-keys";

async function fetchCategoryStats(): Promise<CategoryStats> {
  const response = await fetch("/api/blog/categories/stats");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch category stats");
  }

  return data.stats;
}

export function useCategoryStats({
  initialData,
}: {
  initialData?: CategoryStats;
} = {}) {
  return useQuery({
    queryKey: queryKeys.categories.stats,
    queryFn: fetchCategoryStats,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}



