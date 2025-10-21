import { PageContent } from "./service-page-builder";

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  featured: boolean;
  pageContent?: PageContent;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory = 
  | "IT Consulting"
  | "Cloud Solutions"
  | "Hosting Services"
  | "Backup & Recovery"
  | "Cybersecurity"
  | "Professional Services"
  | "Microsoft Solutions"
  | "Other";

export type ServiceStatus = "active" | "inactive" | "draft";

export interface ServiceFormData {
  title: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  featured: boolean;
}

export interface ServiceFilters {
  search: string;
  category: ServiceCategory | "all";
  status: ServiceStatus | "all";
  featured: boolean | "all";
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  featured: number;
  byCategory: Record<ServiceCategory, number>;
}

export interface ServiceSortOptions {
  field: "title" | "category" | "status" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export interface ServiceValidationErrors {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
}






