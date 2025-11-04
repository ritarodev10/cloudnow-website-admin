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
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },
};
