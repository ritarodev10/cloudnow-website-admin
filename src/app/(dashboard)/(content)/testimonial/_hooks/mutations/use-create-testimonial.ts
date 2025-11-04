"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Testimonial,
  TestimonialFormData,
  TestimonialRow,
} from "@/types/testimonials";
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

async function createTestimonial(
  data: TestimonialFormData
): Promise<Testimonial> {
  const response = await fetch("/api/testimonials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create testimonial");
  }

  const result = await response.json();
  return transformTestimonial(result.testimonial as TestimonialRow);
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      // Invalidate and refetch testimonials list
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.lists(),
      });
      // Invalidate stats and count
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.stats,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.count,
      });
    },
  });
}
