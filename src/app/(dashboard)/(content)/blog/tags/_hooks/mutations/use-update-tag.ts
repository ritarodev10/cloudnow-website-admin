"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag, TagFormData, TagRow } from "@/types/tags";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to Tag type (camelCase)
 */
function transformTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    usageCount: row.usage_count || 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function updateTag({ id, data }: { id: string; data: TagFormData }): Promise<Tag> {
  const response = await fetch(`/api/blog/tags/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update tag");
  }

  const result = await response.json();
  return transformTag(result.tag as TagRow);
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTag,
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




