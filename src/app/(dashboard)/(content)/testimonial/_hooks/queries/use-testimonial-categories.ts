"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function fetchTestimonialCategories(): Promise<string[]> {
  const response = await fetch("/api/testimonials/categories");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }
  const data = await response.json();
  return data.categories || [];
}

export function useTestimonialCategories(
  options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<string[], Error>({
    queryKey: queryKeys.testimonials.categories,
    queryFn: fetchTestimonialCategories,
    ...options,
  });
}
