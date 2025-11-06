"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FAQ, FAQFormData, FAQRow } from "@/types/faqs";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to FAQ type (camelCase)
 */
function transformFAQ(row: FAQRow): FAQ {
  return {
    id: row.id,
    groupId: row.group_id,
    question: row.question,
    answer: row.answer,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function createFAQ(data: FAQFormData): Promise<FAQ> {
  const response = await fetch("/api/faqs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create FAQ");
  }

  const result = await response.json();
  return transformFAQ(result.faq as FAQRow);
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      // Invalidate and refetch FAQs list
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.stats,
      });
    },
  });
}




