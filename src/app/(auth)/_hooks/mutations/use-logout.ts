"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";

async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Logout failed");
  }
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear auth-related queries
      queryClient.removeQueries({
        queryKey: queryKeys.auth.user,
      });
      router.push("/login");
      router.refresh();
    },
  });
}

