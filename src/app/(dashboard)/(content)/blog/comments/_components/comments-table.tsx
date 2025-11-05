"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment, CommentStatus } from "@/types/comments";

interface CommentsTableProps {
  comments: Comment[];
  onApprove?: (comment: Comment) => void;
  onSpam?: (comment: Comment) => void;
  onTrash?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
  onEdit?: (comment: Comment) => void;
}

export function CommentsTable({
  comments,
  onApprove,
  onSpam,
  onTrash,
  onDelete,
  onEdit,
}: CommentsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: CommentStatus) => {
    const variants: Record<
      CommentStatus,
      "default" | "destructive" | "secondary"
    > = {
      approved: "default",
      pending: "secondary",
      spam: "destructive",
      trash: "secondary",
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <i className="ri-chat-3-line text-2xl text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No comments found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{comment.authorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.authorEmail}
                    </div>
                    {comment.authorUrl && (
                      <div className="text-xs text-muted-foreground">
                        <a
                          href={comment.authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {truncateText(comment.authorUrl, 30)}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-foreground max-w-md">
                    {truncateText(comment.content, 100)}
                  </div>
                  {comment.parentId && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <i className="ri-reply-line mr-1" />
                      Reply to comment
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="font-medium max-w-xs">
                    {truncateText(comment.postTitle, 40)}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(comment.status)}</TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <i className="ri-more-line text-sm" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {comment.status === "pending" && onApprove && (
                        <DropdownMenuItem
                          onClick={() => onApprove(comment)}
                          className="text-green-600 dark:text-green-400"
                        >
                          <i className="ri-check-line mr-2 text-sm" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {comment.status !== "approved" && onApprove && (
                        <DropdownMenuItem
                          onClick={() => onApprove(comment)}
                          className="text-green-600 dark:text-green-400"
                        >
                          <i className="ri-check-line mr-2 text-sm" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {comment.status !== "spam" && onSpam && (
                        <DropdownMenuItem
                          onClick={() => onSpam(comment)}
                          className="text-yellow-600 dark:text-yellow-400"
                        >
                          <i className="ri-spam-line mr-2 text-sm" />
                          Mark as Spam
                        </DropdownMenuItem>
                      )}
                      {comment.status !== "trash" && onTrash && (
                        <DropdownMenuItem
                          onClick={() => onTrash(comment)}
                          className="text-muted-foreground"
                        >
                          <i className="ri-delete-bin-line mr-2 text-sm" />
                          Move to Trash
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(comment)}>
                          <i className="ri-pencil-line mr-2 text-sm" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(comment)}
                          className="text-destructive focus:text-destructive"
                        >
                          <i className="ri-delete-bin-7-line mr-2 text-sm" />
                          Delete Permanently
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
