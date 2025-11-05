"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteFAQ(id: string): Promise<void> {
  const response = await fetch(`/api/faqs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete FAQ");
  }
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      // Invalidate and refetch FAQs list
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.stats,
      });
    },
  });
}


