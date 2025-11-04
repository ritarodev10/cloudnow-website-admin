"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TestimonialStats } from "@/types/testimonials";
import { queryKeys } from "@/lib/query-keys";

async function fetchTestimonialStats(): Promise<TestimonialStats> {
  const response = await fetch("/api/testimonials/stats");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch testimonial stats");
  }
  const data = await response.json();
  return data.stats;
}

export function useTestimonialStats(
  options?: Omit<
    UseQueryOptions<TestimonialStats, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TestimonialStats, Error>({
    queryKey: queryKeys.testimonials.stats,
    queryFn: fetchTestimonialStats,
    ...options,
  });
}
