import { z } from "zod";

export const faqFormSchema = z.object({
  groupId: z.string().min(1, "Group is required"),
  question: z
    .string()
    .min(1, "Question is required")
    .max(500, "Question must be less than 500 characters"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .max(5000, "Answer must be less than 5000 characters"),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

export type FAQFormSchema = z.infer<typeof faqFormSchema>;


