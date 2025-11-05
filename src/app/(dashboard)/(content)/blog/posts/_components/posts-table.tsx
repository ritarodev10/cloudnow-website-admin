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
import { Post } from "@/types/posts";
import Link from "next/link";

interface PostsTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostsTable({ posts, onEdit, onDelete }: PostsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: Post["status"]) => {
    const variants: Record<
      Post["status"],
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        className: string;
      }
    > = {
      published: {
        variant: "default",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      draft: {
        variant: "secondary",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      scheduled: {
        variant: "outline",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      },
      archived: {
        variant: "outline",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <i className="ri-article-line text-2xl text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No posts found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      /{post.slug}
                    </div>
                    {/* Featured badge removed - featured field not in Post type */}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(post.status)}</TableCell>

                <TableCell>
                  {post.category ? (
                    <Badge variant="outline">{post.category}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  {post.tags && post.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{post.authorName}</div>
                    <div className="text-muted-foreground text-xs">
                      {post.authorEmail}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm font-medium">
                    {post.views.toLocaleString()}
                  </div>
                </TableCell>

                <TableCell>
                  {post.publishedAt ? (
                    <div className="text-sm">
                      {formatDate(post.publishedAt)}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <i className="ri-more-2-line" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {post.status === "published" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <i className="ri-external-link-line mr-2" />
                            View Post
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <i className="ri-edit-line mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(post)}
                        className="text-destructive"
                      >
                        <i className="ri-delete-bin-line mr-2" />
                        Delete
                      </DropdownMenuItem>
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
