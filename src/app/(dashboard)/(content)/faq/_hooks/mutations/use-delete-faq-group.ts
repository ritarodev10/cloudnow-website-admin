"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteFAQGroup(id: string): Promise<void> {
  const response = await fetch(`/api/faqs/groups/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete FAQ group");
  }
}

export function useDeleteFAQGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFAQGroup,
    onSuccess: () => {
      // Invalidate and refetch FAQ groups list
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.groups.lists(),
      });
      // Invalidate FAQs list (since deleting group cascades deletes FAQs)
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





