"use client";

import { TestimonialGroup, TestimonialGroupFormData } from "@/types/testimonials";

interface TestimonialGroupFormProps {
  group?: TestimonialGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialGroupFormData) => void;
  loading?: boolean;
}

export function TestimonialGroupForm({ group, open, onOpenChange, onSubmit, loading = false }: TestimonialGroupFormProps) {
  // TODO: Implement full form UI
  // For now, this is a placeholder component
  return null;
}

