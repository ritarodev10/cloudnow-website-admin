"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { CommentsTable } from "./_components/comments-table";
import { CommentsStats } from "./_components/comments-stats";
import { CommentsFilters } from "./_components/comments-filters";
import { CommentsSearch } from "./_components/comments-search";
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
  Comment,
  CommentFilters as CommentFiltersType,
  CommentStats,
  CommentStatus,
} from "@/types/comments";
import { Post } from "@/types/posts";

interface CommentsClientPageProps {
  initialComments: Comment[];
  initialPosts: Post[];
  initialStats: CommentStats;
}

export function CommentsClientPage({
  initialComments,
  initialPosts,
  initialStats,
}: CommentsClientPageProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [posts] = useState<Post[]>(initialPosts);
  const [stats, setStats] = useState<CommentStats>(initialStats);

  const [commentFilters, setCommentFilters] = useState<CommentFiltersType>({
    search: "",
    status: "all",
    posts: [],
    sortBy: "date",
    sortOrder: "desc",
  });

  const [deletingComment, setDeletingComment] = useState<Comment | undefined>();

  // Filter and sort comments
  const filteredComments = useMemo(() => {
    let filtered = [...comments];

    // Search filter
    if (commentFilters.search) {
      const lowercaseQuery = commentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.authorName.toLowerCase().includes(lowercaseQuery) ||
          comment.authorEmail.toLowerCase().includes(lowercaseQuery) ||
          comment.content.toLowerCase().includes(lowercaseQuery) ||
          comment.postTitle.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Status filter
    if (commentFilters.status !== "all") {
      filtered = filtered.filter(
        (comment) => comment.status === commentFilters.status
      );
    }

    // Post filter
    if (commentFilters.posts.length > 0) {
      filtered = filtered.filter((comment) =>
        commentFilters.posts.includes(comment.postId)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (commentFilters.sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "author":
          comparison = a.authorName.localeCompare(b.authorName);
          break;
        case "post":
          comparison = a.postTitle.localeCompare(b.postTitle);
          break;
      }
      return commentFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [comments, commentFilters]);

  // Update stats based on current comments
  const computedStats = useMemo(() => {
    const total = comments.length;
    const pending = comments.filter((c) => c.status === "pending").length;
    const approved = comments.filter((c) => c.status === "approved").length;
    const spam = comments.filter((c) => c.status === "spam").length;
    const trash = comments.filter((c) => c.status === "trash").length;

    return { total, pending, approved, spam, trash };
  }, [comments]);

  const updateCommentStatus = (commentId: string, newStatus: CommentStatus) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      )
    );
  };

  const handleApprove = (comment: Comment) => {
    updateCommentStatus(comment.id, "approved");
  };

  const handleSpam = (comment: Comment) => {
    updateCommentStatus(comment.id, "spam");
  };

  const handleTrash = (comment: Comment) => {
    updateCommentStatus(comment.id, "trash");
  };

  const handleDelete = (comment: Comment) => {
    setDeletingComment(comment);
  };

  const confirmDelete = async () => {
    if (deletingComment) {
      try {
        setComments((prev) =>
          prev.filter((c) => c.id !== deletingComment.id)
        );
        setDeletingComment(undefined);
        // TODO: Implement API call to delete comment
        console.log("Deleting comment:", deletingComment.id);
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete comment. Please try again."
        );
      }
    }
  };

  const handleBulkAction = async (action: CommentStatus | "delete") => {
    // TODO: Implement bulk actions
    console.log("Bulk action:", action);
  };

  return (
    <PageTitle
      title="Blog Comments"
      description="Manage and moderate blog post comments"
    >
      <div className="space-y-6">
        {/* Stats */}
        <CommentsStats stats={computedStats} />

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CommentsSearch
              filters={commentFilters}
              onFiltersChange={setCommentFilters}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction("approved")}
                disabled={filteredComments.length === 0}
              >
                <i className="ri-check-line mr-2 text-sm" />
                Approve Selected
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("spam")}
                disabled={filteredComments.length === 0}
              >
                <i className="ri-spam-line mr-2 text-sm" />
                Mark as Spam
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("trash")}
                disabled={filteredComments.length === 0}
              >
                <i className="ri-delete-bin-line mr-2 text-sm" />
                Move to Trash
              </Button>
            </div>
          </div>

          <CommentsFilters
            filters={commentFilters}
            onFiltersChange={setCommentFilters}
            posts={posts}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Comments ({filteredComments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentsTable
                comments={filteredComments}
                onApprove={handleApprove}
                onSpam={handleSpam}
                onTrash={handleTrash}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingComment}
        onOpenChange={(open) => !open && setDeletingComment(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment Permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              comment by {deletingComment?.authorName} on "
              {deletingComment?.postTitle}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTitle>
  );
}

