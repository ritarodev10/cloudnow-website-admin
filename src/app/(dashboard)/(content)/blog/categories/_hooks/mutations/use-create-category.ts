"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryFormData, BlogCategory } from "@/types/categories";
import { queryKeys } from "@/lib/query-keys";

async function createCategory(
  data: CategoryFormData
): Promise<BlogCategory> {
  const response = await fetch("/api/blog/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create category");
  }

  // Transform the response
  const row = result.category;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    postCount: row.post_count || 0,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
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



