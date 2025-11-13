"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

async function deleteTag(id: string): Promise<void> {
  const response = await fetch(`/api/blog/tags/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete tag");
  }
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      // Invalidate and refetch tags list
      queryClient.invalidateQueries({
        queryKey: queryKeys.blog.tags.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.blog.tags.stats,
      });
    },
  });
}




