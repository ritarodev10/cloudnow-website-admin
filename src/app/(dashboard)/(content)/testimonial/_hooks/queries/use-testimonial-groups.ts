"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TestimonialGroup, TestimonialGroupRow } from "@/types/testimonials";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to TestimonialGroup type (camelCase)
 */
function transformTestimonialGroup(row: TestimonialGroupRow): TestimonialGroup {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    testimonialIds: row.testimonial_ids,
    order: row.order_array,
    isActive: row.is_active,
    usagePaths: row.usage_paths,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function fetchTestimonialGroups(): Promise<TestimonialGroup[]> {
  const response = await fetch("/api/testimonials/groups");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch testimonial groups");
  }
  const data = await response.json();
  return (data.groups || []).map(transformTestimonialGroup);
}

export function useTestimonialGroups(
  options?: Omit<
    UseQueryOptions<TestimonialGroup[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TestimonialGroup[], Error>({
    queryKey: queryKeys.testimonials.groups.lists(),
    queryFn: fetchTestimonialGroups,
    ...options,
  });
}
