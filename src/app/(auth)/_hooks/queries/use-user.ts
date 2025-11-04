"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface User {
  email: string | null;
  avatarUrl: string | null;
}

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user");
  if (!response.ok) {
    // Not authenticated, return null
    return null;
  }
  const data = await response.json();
  if (data.user) {
    return {
      email: data.user.email || null,
      avatarUrl: data.user.avatarUrl || null,
    };
  }
  return null;
}

export function useUser(
  options?: Omit<UseQueryOptions<User | null, Error>, "queryKey" | "queryFn">
) {
  return useQuery<User | null, Error>({
    queryKey: queryKeys.auth.user,
    queryFn: fetchUser,
    ...options,
  });
}

