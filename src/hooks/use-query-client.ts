import { useQueryClient } from "@tanstack/react-query";

/**
 * Shared hook to access QueryClient instance
 * Useful for programmatic cache invalidation
 */
export function useAppQueryClient() {
  return useQueryClient();
}
