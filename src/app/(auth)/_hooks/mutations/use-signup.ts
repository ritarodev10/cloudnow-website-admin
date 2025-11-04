"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface SignupData {
  email: string;
  password: string;
}

interface SignupResponse {
  message?: string;
  error?: string;
}

async function signup(data: SignupData): Promise<SignupResponse> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Signup failed");
  }

  return result;
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });
}

