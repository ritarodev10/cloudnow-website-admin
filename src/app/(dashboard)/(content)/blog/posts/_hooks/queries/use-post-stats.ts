"use client";

import { useQuery } from "@tanstack/react-query";
import { PostStats } from "@/types/posts";
import { queryKeys } from "@/lib/query-keys";

async function fetchPostStats(): Promise<PostStats> {
  const response = await fetch("/api/blog/posts/stats");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch post stats");
  }

  return data.stats;
}

export function usePostStats({
  initialData,
}: {
  initialData?: PostStats;
} = {}) {
  return useQuery({
    queryKey: queryKeys.posts.stats,
    queryFn: fetchPostStats,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

