"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteTestimonialGroup(id: string): Promise<void> {
  const response = await fetch(`/api/testimonials/groups/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete testimonial group");
  }
}

export function useDeleteTestimonialGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimonialGroup,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.testimonials.groups.detail(deletedId),
      });
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




