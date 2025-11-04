import {
  getTestimonials,
  getTestimonialGroups,
  getTestimonialStats,
} from "@/lib/testimonials/queries";
import { TestimonialClientPage } from "./testimonial-client-page";

export default async function TestimonialPage() {
  // Fetch data from Supabase
  const [testimonials, groups, stats] = await Promise.all([
    getTestimonials(),
    getTestimonialGroups(),
    getTestimonialStats(),
  ]);

  return (
    <TestimonialClientPage
      initialTestimonials={testimonials}
      initialGroups={groups}
      initialStats={stats}
    />
  );
}
