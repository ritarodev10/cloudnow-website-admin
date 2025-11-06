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

async function updateFAQ({
  id,
  data,
}: {
  id: string;
  data: FAQFormData;
}): Promise<FAQ> {
  const response = await fetch(`/api/faqs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update FAQ");
  }

  const result = await response.json();
  return transformFAQ(result.faq as FAQRow);
}

export function useUpdateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFAQ,
    onSuccess: (_, variables) => {
      // Invalidate and refetch FAQs list
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.lists(),
      });
      // Invalidate specific FAQ detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.detail(variables.id),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.stats,
      });
    },
  });
}




