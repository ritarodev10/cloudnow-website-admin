"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteTestimonial(id: string): Promise<void> {
  const response = await fetch(`/api/testimonials/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete testimonial");
  }
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.testimonials.detail(deletedId),
      });
      // Invalidate lists to refetch
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

