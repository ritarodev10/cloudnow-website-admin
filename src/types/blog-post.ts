/**
 * Blog Post Types for Strapi Integration
 *
 * These types are designed to work with Strapi CMS API structure
 * and include all necessary fields for a complete blog post management system.
 */

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiMedia extends StrapiEntity {
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface BlogCategory extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogTag extends StrapiEntity {
  name: string;
  slug: string;
  color?: string;
}

export interface BlogAuthor extends StrapiEntity {
  name: string;
  email: string;
  bio?: string;
  avatar?: StrapiMedia;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogPost extends StrapiEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // Rich text content (HTML/Markdown)
  featuredImage?: StrapiMedia;
  gallery?: StrapiMedia[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  readingTime?: number; // in minutes
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  author: BlogAuthor;
  category: BlogCategory;
  tags: BlogTag[];
  relatedPosts?: BlogPost[];
  allowComments: boolean;
  commentCount?: number;
  isFeatured: boolean;
  isPinned: boolean;
  customFields?: Record<string, unknown>; // For custom fields
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: File | string; // File for upload, string for existing
  gallery?: File[] | string[]; // Files for upload, strings for existing
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  authorId: number;
  categoryId: number;
  tagIds: number[];
  allowComments: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  customFields?: Record<string, unknown>;
}

export interface BlogPostFilters {
  status?: "draft" | "published" | "archived";
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  featured?: boolean;
  pinned?: boolean;
}

export interface BlogPostSortOptions {
  field:
    | "title"
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "viewCount"
    | "likeCount";
  order: "asc" | "desc";
}

// API Response Types
export type BlogPostResponse = StrapiResponse<BlogPost>;
export type BlogPostsResponse = StrapiResponse<BlogPost[]>;
export type BlogCategoryResponse = StrapiResponse<BlogCategory>;
export type BlogCategoriesResponse = StrapiResponse<BlogCategory[]>;
export type BlogTagResponse = StrapiResponse<BlogTag>;
export type BlogTagsResponse = StrapiResponse<BlogTag[]>;
export type BlogAuthorResponse = StrapiResponse<BlogAuthor>;
export type BlogAuthorsResponse = StrapiResponse<BlogAuthor[]>;

// Form validation types
export interface BlogPostValidationErrors {
  title?: string;
  slug?: string;
  content?: string;
  authorId?: string;
  categoryId?: string;
  tagIds?: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledAt?: string;
}

// Editor types
export interface EditorState {
  content: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  wordCount: number;
  characterCount: number;
  readingTime: number;
}

export interface EditorToolbarItem {
  type:
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "link"
    | "image"
    | "video"
    | "code"
    | "quote"
    | "list"
    | "heading";
  label: string;
  icon: string;
  action: () => void;
  isActive?: boolean;
}

// Strapi API endpoints
export const STRAPI_ENDPOINTS = {
  BLOG_POSTS: "/api/blog-posts",
  BLOG_CATEGORIES: "/api/blog-categories",
  BLOG_TAGS: "/api/blog-tags",
  BLOG_AUTHORS: "/api/blog-authors",
  UPLOAD: "/api/upload",
  MEDIA: "/api/upload/files",
} as const;
