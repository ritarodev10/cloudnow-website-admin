"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Tag, TagRow } from "@/types/tags";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to Tag type (camelCase)
 */
function transformTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    usageCount: row.usage_count || 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function fetchTags(): Promise<Tag[]> {
  const response = await fetch("/api/blog/tags");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tags");
  }
  const data = await response.json();
  return (data.tags || []).map(transformTag);
}

export function useTags(
  options?: Omit<UseQueryOptions<Tag[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Tag[], Error>({
    queryKey: queryKeys.blog.tags.lists(),
    queryFn: fetchTags,
    ...options,
  });
}




