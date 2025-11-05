import { z } from "zod";
import { PostStatus } from "@/types/posts";

export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be a valid URL slug"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(100000, "Content must be less than 100000 characters"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  featured: z.boolean(),
  pinned: z.boolean(),
  allowComments: z.boolean(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;

