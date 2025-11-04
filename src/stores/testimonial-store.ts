import { create } from "zustand";

interface TestimonialStore {
  count: number | null;
  setCount: (count: number) => void;
}

/**
 * Zustand store for testimonial count badge in sidebar
 * The count is updated from React Query data in the testimonial page component
 * This keeps the UI state separate from data fetching
 */
export const useTestimonialStore = create<TestimonialStore>((set) => ({
  count: null,
  setCount: (count) => set({ count }),
}));
