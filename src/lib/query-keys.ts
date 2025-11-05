/**
 * Centralized query key factory for consistent cache key management
 * Follows pattern: ['module', 'resource', id?]
 */

export const queryKeys = {
  // Testimonials
  testimonials: {
    all: ["testimonials"] as const,
    lists: () => [...queryKeys.testimonials.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.testimonials.lists(), filters] as const,
    details: () => [...queryKeys.testimonials.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.testimonials.details(), id] as const,
    groups: {
      all: ["testimonials", "groups"] as const,
      lists: () => [...queryKeys.testimonials.groups.all, "list"] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.testimonials.groups.lists(), filters] as const,
      details: () => [...queryKeys.testimonials.groups.all, "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.testimonials.groups.details(), id] as const,
    },
    stats: ["testimonials", "stats"] as const,
    categories: ["testimonials", "categories"] as const,
    count: ["testimonials", "count"] as const,
  },
  // FAQs
  faqs: {
    all: ["faqs"] as const,
    lists: () => [...queryKeys.faqs.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.faqs.lists(), filters] as const,
    details: () => [...queryKeys.faqs.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.faqs.details(), id] as const,
    groups: {
      all: ["faqs", "groups"] as const,
      lists: () => [...queryKeys.faqs.groups.all, "list"] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.faqs.groups.lists(), filters] as const,
      details: () => [...queryKeys.faqs.groups.all, "detail"] as const,
      detail: (id: string) => [...queryKeys.faqs.groups.details(), id] as const,
    },
    stats: ["faqs", "stats"] as const,
  },
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },
  // Analytics
  analytics: {
    all: ["analytics"] as const,
    overview: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "overview", params] as const,
    realtime: () => [...queryKeys.analytics.all, "realtime"] as const,
    sessions: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "sessions", params] as const,
    location: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "location", params] as const,
    environment: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "environment", params] as const,
  },
  // Blog Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
    stats: ["categories", "stats"] as const,
  },
  // Blog Tags
  blog: {
    tags: {
      all: ["blog", "tags"] as const,
      lists: () => [...queryKeys.blog.tags.all, "list"] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.blog.tags.lists(), filters] as const,
      details: () => [...queryKeys.blog.tags.all, "detail"] as const,
      detail: (id: string) => [...queryKeys.blog.tags.details(), id] as const,
      stats: ["blog", "tags", "stats"] as const,
    },
  },
  // Blog Posts
  posts: {
    all: ["blog", "posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    stats: ["blog", "posts", "stats"] as const,
  },
};
