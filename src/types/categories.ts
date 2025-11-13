// Blog Category types for the CloudNow Blog module
// Compatible with Supabase database structure

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface CategoryFilters {
  search: string;
  sortBy: "date" | "name" | "posts";
  sortOrder: "asc" | "desc";
  activeOnly: boolean;
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  totalPosts: number;
}

// Supabase database row types (raw from database)
export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}




