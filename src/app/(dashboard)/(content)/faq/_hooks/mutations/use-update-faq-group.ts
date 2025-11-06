"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FAQGroup, FAQGroupFormData, FAQGroupRow } from "@/types/faqs";
import { queryKeys } from "@/lib/query-keys";

/**
 * Transform API response (snake_case) to FAQGroup type (camelCase)
 */
function transformFAQGroup(row: FAQGroupRow): FAQGroup {
  return {
    id: row.id,
    groupName: row.group_name,
    description: row.description || undefined,
    usagePaths: row.usage_paths,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function updateFAQGroup({
  id,
  data,
}: {
  id: string;
  data: FAQGroupFormData;
}): Promise<FAQGroup> {
  const response = await fetch(`/api/faqs/groups/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update FAQ group");
  }

  const result = await response.json();
  return transformFAQGroup(result.group as FAQGroupRow);
}

export function useUpdateFAQGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFAQGroup,
    onSuccess: (_, variables) => {
      // Invalidate and refetch FAQ groups list
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.groups.lists(),
      });
      // Invalidate specific group detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.groups.detail(variables.id),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.faqs.stats,
      });
    },
  });
}



