/**
 * Blog Post Data for Strapi Integration
 *
 * This file contains sample data and utility functions for blog post management
 * designed to work with Strapi CMS API structure.
 */

import {
  BlogPost,
  BlogPostFormData,
  BlogPostFilters,
  BlogPostSortOptions,
  BlogCategory,
  BlogTag,
  BlogAuthor,
  EditorState,
} from "@/types/blog-strapi";

// Sample blog categories (will be fetched from Strapi)
export const sampleCategories: BlogCategory[] = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    description: "Latest technology trends and innovations",
    color: "#3B82F6",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    description: "Business insights and strategies",
    color: "#10B981",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Design",
    slug: "design",
    description: "Design trends and best practices",
    color: "#F59E0B",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
];

// Sample blog tags (will be fetched from Strapi)
export const sampleTags: BlogTag[] = [
  {
    id: 1,
    name: "React",
    slug: "react",
    color: "#61DAFB",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Next.js",
    slug: "nextjs",
    color: "#000000",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "TypeScript",
    slug: "typescript",
    color: "#3178C6",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 4,
    name: "UI/UX",
    slug: "ui-ux",
    color: "#8B5CF6",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
];

// Sample blog authors (will be fetched from Strapi)
export const sampleAuthors: BlogAuthor[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@cloudnow.com",
    bio: "Senior Developer with 5+ years of experience in React and Node.js",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
    socialLinks: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@cloudnow.com",
    bio: "UI/UX Designer passionate about creating beautiful and functional designs",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
    socialLinks: {
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
    },
  },
];

// Sample blog post (for reference)
export const sampleBlogPost: BlogPost = {
  id: 1,
  title: "Getting Started with Next.js 14",
  slug: "getting-started-with-nextjs-14",
  excerpt:
    "Learn how to build modern web applications with Next.js 14 and its new features.",
  content: `<h1>Introduction</h1>
<p>Next.js 14 brings exciting new features and improvements to the React ecosystem...</p>
<h2>Key Features</h2>
<ul>
  <li>App Router improvements</li>
  <li>Enhanced performance</li>
  <li>Better TypeScript support</li>
</ul>
<p>Let's dive into these features and see how they can improve your development workflow.</p>`,
  status: "published",
  publishedAt: "2024-01-15T10:00:00.000Z",
  seoTitle: "Next.js 14 Tutorial - Complete Guide for Beginners",
  seoDescription:
    "Complete guide to Next.js 14 with examples, best practices, and new features explained.",
  seoKeywords: ["nextjs", "react", "javascript", "web development"],
  readingTime: 8,
  viewCount: 1250,
  likeCount: 45,
  shareCount: 12,
  author: sampleAuthors[0],
  category: sampleCategories[0],
  tags: [sampleTags[0], sampleTags[1]],
  allowComments: true,
  commentCount: 8,
  isFeatured: true,
  isPinned: false,
  createdAt: "2024-01-15T09:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
};

// Default form data for new posts
export const defaultBlogPostFormData: BlogPostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  authorId: 1, // Default to first author
  categoryId: 1, // Default to first category
  tagIds: [],
  allowComments: true,
  isFeatured: false,
  isPinned: false,
  customFields: {},
};

// Default editor state
export const defaultEditorState: EditorState = {
  content: "",
  isDirty: false,
  isSaving: false,
  wordCount: 0,
  characterCount: 0,
  readingTime: 0,
};

// Utility functions for blog post management

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
};

/**
 * Calculate reading time based on content
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Extract word and character count from content
 */
export const getContentStats = (content: string) => {
  const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const wordCount = textContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const characterCount = textContent.length;
  const readingTime = calculateReadingTime(content);

  return {
    wordCount,
    characterCount,
    readingTime,
  };
};

/**
 * Validate blog post form data
 */
export const validateBlogPost = (data: BlogPostFormData) => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.length < 5) {
    errors.title = "Title must be at least 5 characters";
  }

  if (!data.slug.trim()) {
    errors.slug = "Slug is required";
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug =
      "Slug can only contain lowercase letters, numbers, and hyphens";
  }

  if (!data.content.trim()) {
    errors.content = "Content is required";
  } else if (data.content.length < 100) {
    errors.content = "Content must be at least 100 characters";
  }

  if (!data.authorId) {
    errors.authorId = "Author is required";
  }

  if (!data.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (data.tagIds.length === 0) {
    errors.tagIds = "At least one tag is required";
  }

  return errors;
};

/**
 * Filter blog posts based on criteria
 */
export const filterBlogPosts = (
  posts: BlogPost[],
  filters: BlogPostFilters
): BlogPost[] => {
  return posts.filter((post) => {
    if (filters.status && post.status !== filters.status) return false;
    if (filters.category && post.category.slug !== filters.category)
      return false;
    if (filters.tags && filters.tags.length > 0) {
      const postTagSlugs = post.tags.map((tag: BlogTag) => tag.slug);
      if (!filters.tags.some((tag) => postTagSlugs.includes(tag))) return false;
    }
    if (
      filters.author &&
      post.author.name.toLowerCase().includes(filters.author.toLowerCase())
    )
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !post.title.toLowerCase().includes(searchLower) &&
        !post.excerpt?.toLowerCase().includes(searchLower)
      )
        return false;
    }
    if (filters.featured !== undefined && post.isFeatured !== filters.featured)
      return false;
    if (filters.pinned !== undefined && post.isPinned !== filters.pinned)
      return false;

    return true;
  });
};

/**
 * Sort blog posts based on criteria
 */
export const sortBlogPosts = (
  posts: BlogPost[],
  sortOptions: BlogPostSortOptions
): BlogPost[] => {
  return [...posts].sort((a, b) => {
    let aValue: string | number, bValue: string | number;

    switch (sortOptions.field) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      case "publishedAt":
        aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        break;
      case "viewCount":
        aValue = a.viewCount || 0;
        bValue = b.viewCount || 0;
        break;
      case "likeCount":
        aValue = a.likeCount || 0;
        bValue = b.likeCount || 0;
        break;
      default:
        return 0;
    }

    if (sortOptions.order === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

/**
 * Format date for display
 */
export const formatBlogPostDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get status badge variant
 */
export const getStatusBadgeVariant = (status: BlogPost["status"]) => {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "archived":
      return "destructive";
    default:
      return "secondary";
  }
};

/**
 * Get status badge label
 */
export const getStatusBadgeLabel = (status: BlogPost["status"]) => {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return "Unknown";
  }
};
