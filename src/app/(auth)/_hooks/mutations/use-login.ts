"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  error?: string;
}

async function login(data: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Login failed");
  }

  return result;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });
}

