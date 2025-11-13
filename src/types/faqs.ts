// FAQ types for the CloudNow FAQs module
// Compatible with Supabase database structure

export interface FAQ {
  id: string;
  groupId: string;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQGroup {
  id: string;
  groupName: string;
  description?: string;
  usagePaths: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQFormData {
  groupId: string;
  question: string;
  answer: string;
  order: number;
}

export interface FAQGroupFormData {
  groupName: string;
  description?: string;
  usagePaths: string[];
  isActive: boolean;
}

export interface FAQFilters {
  search: string;
  groups: string[];
  sortBy: "date" | "order" | "question";
  sortOrder: "asc" | "desc";
}

export interface FAQStats {
  total: number;
  totalGroups: number;
  activeGroups: number;
  usedGroups: number;
  unusedGroups: number;
}

// Supabase database row types (raw from database)
export interface FAQRow {
  id: string;
  group_id: string;
  question: string;
  answer: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQGroupRow {
  id: string;
  group_name: string;
  description: string | null;
  usage_paths: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}





