"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentFilters, CommentStatus } from "@/types/comments";
import { Post } from "@/types/posts";

interface CommentsFiltersProps {
  filters: CommentFilters;
  onFiltersChange: (filters: CommentFilters) => void;
  posts: Post[];
}

export function CommentsFilters({
  filters,
  onFiltersChange,
  posts,
}: CommentsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as CommentStatus | "all",
    });
  };

  const handlePostToggle = (postId: string) => {
    const newPosts = filters.posts.includes(postId)
      ? filters.posts.filter((p) => p !== postId)
      : [...filters.posts, postId];

    onFiltersChange({
      ...filters,
      posts: newPosts,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "date" | "author" | "post",
    });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      posts: [],
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters =
    filters.status !== "all" || filters.posts.length > 0;

  const getStatusBadgeVariant = (status: CommentStatus | "all") => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "outline";
      case "spam":
        return "destructive";
      case "trash":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters & Sorting</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <i className="ri-close-line text-sm mr-1" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i className="ri-filter-line text-sm mr-2" />
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "spam", "trash"] as const).map(
                (status) => (
                  <Badge
                    key={status}
                    variant={
                      filters.status === status
                        ? getStatusBadgeVariant(status)
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/80 capitalize"
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                    {filters.status === status && (
                      <i className="ri-close-line ml-1 text-sm" />
                    )}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Posts Filter */}
          {posts.length > 0 && (
            <div className="space-y-3">
              <Label>Posts</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {posts.slice(0, 10).map((post) => (
                  <Badge
                    key={post.id}
                    variant={
                      filters.posts.includes(post.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => handlePostToggle(post.id)}
                  >
                    {post.title.length > 30
                      ? post.title.slice(0, 30) + "..."
                      : post.title}
                    {filters.posts.includes(post.id) && (
                      <i className="ri-close-line ml-1 text-sm" />
                    )}
                  </Badge>
                ))}
              </div>
              {posts.length > 10 && (
                <p className="text-xs text-muted-foreground">
                  Showing 10 of {posts.length} posts. Use search to find more.
                </p>
              )}
            </div>
          )}

          {/* Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date created</SelectItem>
                  <SelectItem value="author">Author name</SelectItem>
                  <SelectItem value="post">Post title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={handleSortOrderChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.status !== "all" && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    Status: {filters.status}
                  </Badge>
                )}
                {filters.posts.map((postId) => {
                  const post = posts.find((p) => p.id === postId);
                  return (
                    <Badge key={postId} variant="secondary" className="text-xs">
                      Post: {post?.title || postId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

