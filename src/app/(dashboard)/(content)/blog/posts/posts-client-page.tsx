"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { PostsTable } from "./_components/posts-table";
import { PostsStats } from "./_components/posts-stats";
import { PostsFilters } from "./_components/posts-filters";
import { PostsSearch } from "./_components/posts-search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Post,
  PostFilters as PostFiltersType,
  PostStats,
} from "@/types/posts";
import { usePosts } from "./_hooks/queries/use-posts";
import { usePostStats } from "./_hooks/queries/use-post-stats";
import { useDeletePost } from "./_hooks/mutations/use-delete-post";
import Link from "next/link";

interface PostsClientPageProps {
  initialPosts: Post[];
  initialStats: PostStats;
  categories: string[];
}

export function PostsClientPage({
  initialPosts,
  initialStats,
  categories,
}: PostsClientPageProps) {
  // React Query hooks with initial data from server
  const [postFilters, setPostFilters] = useState<PostFiltersType>({
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  const {
    data: postsData = initialPosts,
    isLoading: isLoadingPosts,
  } = usePosts({
    initialData: initialPosts,
    filters: postFilters,
  });

  const { data: stats = initialStats, isLoading: isLoadingStats } =
    usePostStats({
      initialData: initialStats,
    });

  // Mutations
  const deleteMutation = useDeletePost();

  // Modal states
  const [deletingPost, setDeletingPost] = useState<Post | undefined>();

  // Combined loading state
  const isLoading =
    isLoadingPosts ||
    isLoadingStats ||
    deleteMutation.isPending;

  // Use stats from React Query
  const computedStats = stats;

  // Filter and sort posts (client-side filtering for now, can be moved to server)
  const filteredPosts = useMemo(() => {
    let filtered = [...postsData];

    // Additional client-side filtering if needed
    // Most filtering is done server-side via API

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (postFilters.sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "views":
          comparison = a.views - b.views;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return postFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [postsData, postFilters]);

  // Post handlers
  const handleEditPost = (post: Post) => {
    // Navigate to edit page
    window.location.href = `/blog/new?edit=${post.id}`;
  };

  const handleDeletePost = (post: Post) => {
    setDeletingPost(post);
  };

  const confirmDeletePost = async () => {
    if (deletingPost) {
      try {
        await deleteMutation.mutateAsync(deletingPost.id);
        setDeletingPost(undefined);
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete post. Please try again."
        );
      }
    }
  };

  return (
    <PageTitle
      title="Blog Posts"
      description="Manage and view all your blog posts"
    >
      <div className="space-y-6">
        {/* Stats */}
        <PostsStats stats={computedStats} />

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <PostsSearch
              filters={postFilters}
              onFiltersChange={setPostFilters}
            />
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/blog/new">
                  <i className="ri-add-line text-sm mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>

          <PostsFilters
            filters={postFilters}
            onFiltersChange={setPostFilters}
            categories={categories}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Posts ({filteredPosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="text-sm text-muted-foreground">
                    Loading posts...
                  </div>
                </div>
              ) : (
                <PostsTable
                  posts={filteredPosts}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingPost}
          onOpenChange={() => setDeletingPost(undefined)}
        >
          <AlertDialogContent variant="enhanced" className="max-w-lg">
            <AlertDialogHeader
              variant="enhanced"
              className="text-left pb-3 shrink-0"
            >
              <AlertDialogTitle variant="enhanced" className="text-xl">
                Delete Post
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="px-6 py-4 space-y-3 flex-1 min-h-0">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <svg
                        className="size-4 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Deleting post{" "}
                      <span className="font-semibold">
                        &ldquo;{deletingPost?.title}&rdquo;
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This post will be permanently deleted and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter variant="enhanced" className="shrink-0">
              <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletePost}
                className="bg-[#dc2626] text-white hover:bg-[#b91c1c] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] h-10 min-w-[120px] font-medium"
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTitle>
  );
}




