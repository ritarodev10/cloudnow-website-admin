"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Testimonial, TestimonialFormData, TestimonialRow } from "@/types/testimonials";
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

async function updateTestimonial({
  id,
  data,
}: {
  id: string;
  data: TestimonialFormData;
}): Promise<Testimonial> {
  const response = await fetch(`/api/testimonials/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update testimonial");
  }

  const result = await response.json();
  return transformTestimonial(result.testimonial as TestimonialRow);
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTestimonial,
    onSuccess: (data) => {
      // Update the specific testimonial in cache
      queryClient.setQueryData(
        queryKeys.testimonials.detail(data.id),
        data
      );
      // Invalidate lists to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.stats,
      });
    },
  });
}

