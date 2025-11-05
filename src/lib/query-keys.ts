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
  },
};
