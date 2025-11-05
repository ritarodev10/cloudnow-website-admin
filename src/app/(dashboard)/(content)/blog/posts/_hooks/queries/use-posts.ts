"use client";

import { useQuery } from "@tanstack/react-query";
import { Post, PostFilters } from "@/types/posts";
import { queryKeys } from "@/lib/query-keys";

async function fetchPosts(filters?: PostFilters): Promise<Post[]> {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.append("status", filters.status);
  }
  if (filters?.category) {
    params.append("category", filters.category);
  }
  if (filters?.search) {
    params.append("search", filters.search);
  }

  const response = await fetch(`/api/blog/posts?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch posts");
  }

  // Transform the data to match Post type
  return (data.posts || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || undefined,
    content: row.content,
    authorId: row.author_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    status: row.status,
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    views: row.views || 0,
    category: row.category || undefined,
    tags: row.tags || [],
    featuredImage: row.featured_image || undefined,
  }));
}

export function usePosts({
  initialData,
  filters,
}: {
  initialData?: Post[];
  filters?: PostFilters;
} = {}) {
  return useQuery({
    queryKey: queryKeys.posts.list(
      filters ? (filters as unknown as Record<string, unknown>) : undefined
    ),
    queryFn: () => fetchPosts(filters),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
