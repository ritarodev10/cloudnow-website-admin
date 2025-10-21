// FAQ types for the CloudNow FAQs module

export type FAQCategory = 
  | "General"
  | "Cloud Services"
  | "Billing"
  | "Technical Support"
  | "Security"
  | "Implementation"
  | "Other";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categories: FAQCategory[];
  isVisible: boolean;
  groupId: string; // Required - each FAQ belongs to exactly one group
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQGroup {
  id: string;
  name: string;
  description?: string;
  faqIds: string[];
  order: string[]; // Custom ordering of FAQs
  isActive: boolean;
  usagePaths: string[]; // Array of page paths where this group is used
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQFormData {
  question: string;
  answer: string;
  categories: FAQCategory[];
  isVisible: boolean;
  groupId: string; // Required - FAQ must belong to a group
}

export interface FAQGroupFormData {
  name: string;
  description?: string;
  faqIds: string[];
  order: string[];
  isActive: boolean;
}

export interface FAQFilters {
  search: string;
  categories: FAQCategory[];
  visibility: "all" | "visible" | "hidden";
  sortBy: "date" | "question" | "category";
  sortOrder: "asc" | "desc";
}

// For page builder integration
export interface FAQBlockProps {
  groupId?: string;
  displayStyle: "accordion" | "list" | "grid";
  showGroupName?: boolean;
  maxItems?: number;
}
