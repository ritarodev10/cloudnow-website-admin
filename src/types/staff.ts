export type StaffRole = "staff" | "supervisor" | "hr" | "admin" | "ceo";
export type PermissionLevel = "none" | "read" | "write" | "admin";

export interface StaffCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  permissions: {
    canViewOwnLogs: boolean;
    canViewTeamLogs: boolean;
    canViewAllLogs: boolean;
    canManageStaff: boolean;
    canApproveInvoices: boolean;
  };
}

export interface HourlyRate {
  id: string;
  staffId: string;
  rate: number;
  effectiveDate: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  category: StaffCategory;
  hourlyRate: number;
  isActive: boolean;
  avatar?: string;
  department?: string;
  position?: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffPermissions {
  canViewOwnLogs: boolean;
  canViewTeamLogs: boolean;
  canViewAllLogs: boolean;
  canManageStaff: boolean;
  canApproveInvoices: boolean;
  canEditOwnRate: boolean;
}

export interface StaffSummary {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  totalCategories: number;
  averageHourlyRate: number;
}



