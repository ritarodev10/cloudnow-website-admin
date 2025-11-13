// Tag types for the CloudNow Blog module

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagFormData {
  name: string;
  slug?: string;
  description?: string;
}

export interface TagFilters {
  search: string;
  sortBy: "name" | "usage" | "date";
  sortOrder: "asc" | "desc";
}

export interface TagStats {
  total: number;
  totalUsage: number;
  unused: number;
}

// Supabase database row types (raw from database)
export interface TagRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}




