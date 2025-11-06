// Comment types for the CloudNow Blog Comments module
// Compatible with Supabase database structure

export type CommentStatus = "pending" | "approved" | "spam" | "trash";

export interface Comment {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
  status: CommentStatus;
  parentId?: string; // For nested/replies
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentFilters {
  search: string;
  status: CommentStatus | "all";
  posts: string[]; // Post IDs to filter by
  sortBy: "date" | "author" | "post";
  sortOrder: "asc" | "desc";
}

export interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  spam: number;
  trash: number;
}

// Supabase database row types (raw from database)
export interface CommentRow {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  author_url: string | null;
  content: string;
  status: CommentStatus;
  parent_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}



