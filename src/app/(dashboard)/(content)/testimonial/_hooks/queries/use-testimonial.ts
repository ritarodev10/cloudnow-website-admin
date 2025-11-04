"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Testimonial, TestimonialRow } from "@/types/testimonials";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to Testimonial type (camelCase)
 */
function transformTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    company: row.company,
    testimony: row.testimony,
    image: row.image || undefined,
    rating: row.rating,
    categories: row.categories as Testimonial["categories"],
    isVisible: row.is_visible,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function fetchTestimonial(id: string): Promise<Testimonial> {
  const response = await fetch(`/api/testimonials/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch testimonial");
  }
  const data = await response.json();
  return transformTestimonial(data.testimonial as TestimonialRow);
}

export function useTestimonial(
  id: string,
  options?: Omit<UseQueryOptions<Testimonial, Error>, "queryKey" | "queryFn">
) {
  return useQuery<Testimonial, Error>({
    queryKey: queryKeys.testimonials.detail(id),
    queryFn: () => fetchTestimonial(id),
    enabled: !!id,
    ...options,
  });
}
