// Testimonial types for the CloudNow testimonials module

export type TestimonialCategory = 
  | "Customer Success"
  | "Product Review" 
  | "Service Quality"
  | "Technical Support"
  | "Implementation"
  | "Partnership"
  | "General Feedback";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  testimony: string;
  image?: string;
  rating: number; // 1-5 stars
  categories: TestimonialCategory[];
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialGroup {
  id: string;
  name: string;
  description?: string;
  testimonialIds: string[];
  order: string[]; // Custom ordering of testimonials
  isActive: boolean;
  usagePaths: string[]; // Array of service page paths where this group is used
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialFormData {
  name: string;
  title: string;
  company: string;
  testimony: string;
  image?: string;
  rating: number;
  categories: TestimonialCategory[];
  isVisible: boolean;
}

export interface TestimonialGroupFormData {
  name: string;
  description?: string;
  testimonialIds: string[];
  order: string[];
  isActive: boolean;
}

export interface TestimonialFilters {
  search: string;
  categories: TestimonialCategory[];
  rating: number | null;
  visibility: "all" | "visible" | "hidden";
  sortBy: "date" | "rating" | "name" | "company";
  sortOrder: "asc" | "desc";
}

export interface TestimonialStats {
  total: number;
  averageRating: number;
  visible: number;
  hidden: number;
  totalGroups: number;
  activeGroups: number;
  usedGroups: number;
  unusedGroups: number;
}

// For page builder integration
export interface TestimonialsBlockProps {
  groupId?: string;
  displayStyle: "grid" | "carousel" | "list";
  showGroupName?: boolean;
  maxItems?: number;
}
