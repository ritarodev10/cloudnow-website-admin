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

async function updateTestimonialGroup({
  id,
  data,
}: {
  id: string;
  data: TestimonialGroupFormData;
}): Promise<TestimonialGroup> {
  const response = await fetch(`/api/testimonials/groups/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update testimonial group");
  }

  const result = await response.json();
  return transformTestimonialGroup(result.group as TestimonialGroupRow);
}

export function useUpdateTestimonialGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTestimonialGroup,
    onSuccess: (data) => {
      // Update the specific group in cache
      queryClient.setQueryData(
        queryKeys.testimonials.groups.detail(data.id),
        data
      );
      // Invalidate lists to refetch
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




