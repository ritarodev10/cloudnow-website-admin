"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FAQ, FAQRow } from "@/types/faqs";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to FAQ type (camelCase)
 */
function transformFAQ(row: FAQRow): FAQ {
  return {
    id: row.id,
    groupId: row.group_id,
    question: row.question,
    answer: row.answer,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function fetchFAQ(id: string): Promise<FAQ> {
  const response = await fetch(`/api/faqs/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch FAQ");
  }
  const data = await response.json();
  return transformFAQ(data.faq as FAQRow);
}

export function useFAQ(
  id: string,
  options?: Omit<UseQueryOptions<FAQ, Error>, "queryKey" | "queryFn">
) {
  return useQuery<FAQ, Error>({
    queryKey: queryKeys.faqs.detail(id),
    queryFn: () => fetchFAQ(id),
    enabled: !!id,
    ...options,
  });
}




