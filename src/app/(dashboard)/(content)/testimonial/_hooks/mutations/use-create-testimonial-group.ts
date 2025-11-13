"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TestimonialGroup,
  TestimonialGroupFormData,
  TestimonialGroupRow,
} from "@/types/testimonials";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to TestimonialGroup type (camelCase)
 */
function transformTestimonialGroup(
  row: TestimonialGroupRow
): TestimonialGroup {
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

async function createTestimonialGroup(
  data: TestimonialGroupFormData
): Promise<TestimonialGroup> {
  const response = await fetch("/api/testimonials/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create testimonial group");
  }

  const result = await response.json();
  return transformTestimonialGroup(result.group as TestimonialGroupRow);
}

export function useCreateTestimonialGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestimonialGroup,
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.groups.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonials.stats,
      });
    },
  });
}





