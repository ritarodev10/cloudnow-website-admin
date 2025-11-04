import { z } from "zod";
import { TestimonialCategory } from "@/types/testimonials";

export const testimonialFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(255, "Company must be less than 255 characters"),
  testimony: z
    .string()
    .min(10, "Testimony must be at least 10 characters")
    .max(5000, "Testimony must be less than 5000 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  isVisible: z.boolean(),
});

// Export the inferred type, but we'll cast categories to TestimonialCategory[] where needed
export type TestimonialFormSchema = Omit<
  z.infer<typeof testimonialFormSchema>,
  "categories"
> & {
  categories: TestimonialCategory[];
};
