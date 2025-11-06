"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FAQGroup, FAQGroupRow } from "@/types/faqs";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to FAQGroup type (camelCase)
 */
function transformFAQGroup(row: FAQGroupRow): FAQGroup {
  return {
    id: row.id,
    groupName: row.group_name,
    description: row.description || undefined,
    usagePaths: row.usage_paths,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function fetchFAQGroups(): Promise<FAQGroup[]> {
  const response = await fetch("/api/faqs/groups");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch FAQ groups");
  }
  const data = await response.json();
  return (data.groups || []).map(transformFAQGroup);
}

export function useFAQGroups(
  options?: Omit<UseQueryOptions<FAQGroup[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<FAQGroup[], Error>({
    queryKey: queryKeys.faqs.groups.lists(),
    queryFn: fetchFAQGroups,
    ...options,
  });
}




