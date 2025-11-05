// Post types for the CloudNow Blog module

export type PostStatus = "draft" | "published" | "scheduled" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: PostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  category?: string;
  tags: string[];
  featuredImage?: string;
}

export interface PostStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  totalViews: number;
  averageViews: number;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: PostStatus;
  publishedAt?: Date | string;
  scheduledAt?: Date | string;
  category?: string;
  tags: string[];
  featuredImage?: string;
  featured: boolean;
  pinned: boolean;
  allowComments: boolean;
}

export interface PostFilters {
  search: string;
  status?: PostStatus;
  category?: string;
  sortBy: "date" | "title" | "views" | "status";
  sortOrder: "asc" | "desc";
}

// Supabase database row types (raw from database)
export interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author_id: string;
  author_name: string;
  author_email: string;
  status: string;
  published_at: string | null;
  scheduled_at: string | null;
  category_id: string | null; // FK to blog_categories.id
  featured_image: string | null;
  featured: boolean;
  pinned: boolean;
  allow_comments: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

