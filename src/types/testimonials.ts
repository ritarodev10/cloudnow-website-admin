// Testimonial types for the CloudNow testimonials module
// Compatible with Supabase database structure

// Categories come from testimonial_groups.name - fetched dynamically from database
// Changed from union type to string to support dynamic categories
export type TestimonialCategory = string;

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

// Supabase database row types (raw from database)
export interface TestimonialRow {
  id: string;
  name: string;
  title: string;
  company: string;
  testimony: string;
  image: string | null;
  rating: number;
  categories: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialGroupRow {
  id: string;
  name: string;
  description: string | null;
  testimonial_ids: string[];
  order_array: string[];
  is_active: boolean;
  usage_paths: string[];
  created_at: string;
  updated_at: string;
}

