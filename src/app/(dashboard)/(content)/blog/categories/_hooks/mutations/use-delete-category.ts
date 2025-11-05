"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/blog/categories/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete category");
  }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.stats,
      });
    },
  });
}

