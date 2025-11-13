"use client";

import { useQuery } from "@tanstack/react-query";
import { BlogCategory } from "@/types/categories";
import { queryKeys } from "@/lib/query-keys";

async function fetchCategories(): Promise<BlogCategory[]> {
  const response = await fetch("/api/blog/categories");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch categories");
  }

  // Transform the data to match BlogCategory type
  return (data.categories || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    postCount: row.post_count || 0,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export function useCategories({
  initialData,
}: {
  initialData?: BlogCategory[];
} = {}) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchCategories,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}




