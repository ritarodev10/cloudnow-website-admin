import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  Comment,
  CommentStats,
  CommentRow,
  CommentFilters,
} from "@/types/comments";

/**
 * Transform Supabase comment row to Comment type
 */
function transformComment(row: any): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    postTitle: row.posts?.title || "",
    authorName: row.author_name,
    authorEmail: row.author_email,
    authorUrl: row.author_url || undefined,
    content: row.content,
    status: row.status as Comment["status"],
    parentId: row.parent_id || undefined,
    ipAddress: row.ip_address || undefined,
    userAgent: row.user_agent || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Fetch all comments from Supabase with optional filters
 * Includes post title via JOIN
 */
export async function getComments(
  filters?: CommentFilters
): Promise<Comment[]> {
  const supabase = await createClient();

  // Select comments with post title
  let query = supabase.from("blog_comments").select(`
      *,
      posts (
        id,
        title
      )
    `);

  // Apply filters
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.posts && filters.posts.length > 0) {
    query = query.in("post_id", filters.posts);
  }

  if (filters?.search) {
    query = query.or(
      `author_name.ilike.%${filters.search}%,author_email.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  const sortBy = filters?.sortBy || "date";
  const sortOrder = filters?.sortOrder || "desc";

  switch (sortBy) {
    case "date":
      query = query.order("created_at", { ascending: sortOrder === "asc" });
      break;
    case "author":
      query = query.order("author_name", { ascending: sortOrder === "asc" });
      break;
    case "post":
      query = query.order("post_id", { ascending: sortOrder === "asc" });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("[COMMENTS] Error fetching comments:", error);
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }

  // Transform the data
  return (data || []).map(transformComment);
}

/**
 * Calculate comment statistics from database
 */
export async function getCommentStats(): Promise<CommentStats> {
  const supabase = await createClient();

  // Get all comments
  const { data: comments, error: commentsError } = await supabase
    .from("blog_comments")
    .select("status");

  if (commentsError) {
    console.error(
      "[COMMENTS] Error fetching comments for stats:",
      commentsError
    );
    throw new Error(`Failed to fetch comments: ${commentsError.message}`);
  }

  // Calculate statistics
  const total = comments?.length || 0;
  const pending =
    comments?.filter((comment) => comment.status === "pending").length || 0;
  const approved =
    comments?.filter((comment) => comment.status === "approved").length || 0;
  const spam =
    comments?.filter((comment) => comment.status === "spam").length || 0;
  const trash =
    comments?.filter((comment) => comment.status === "trash").length || 0;

  return {
    total,
    pending,
    approved,
    spam,
    trash,
  };
}
