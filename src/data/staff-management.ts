import {
  Staff,
  StaffCategory,
  StaffRole,
  HourlyRate,
  StaffPermissions,
  StaffSummary,
} from "@/types";

// Sample staff categories
export const sampleStaffCategories: StaffCategory[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Services",
    description: "Cybersecurity and IT security team",
    color: "#EF4444",
    permissions: {
      canViewOwnLogs: true,
      canViewTeamLogs: true,
      canViewAllLogs: false,
      canManageStaff: false,
      canApproveInvoices: false,
    },
  },
  {
    id: "it-services",
    name: "Information Technology Services",
    description: "IT infrastructure and systems administration",
    color: "#3B82F6",
    permissions: {
      canViewOwnLogs: true,
      canViewTeamLogs: true,
      canViewAllLogs: false,
      canManageStaff: false,
      canApproveInvoices: false,
    },
  },
  {
    id: "cloud-systems",
    name: "Cloud & Systems Services",
    description: "Cloud infrastructure and systems management",
    color: "#10B981",
    permissions: {
      canViewOwnLogs: true,
      canViewTeamLogs: true,
      canViewAllLogs: false,
      canManageStaff: false,
      canApproveInvoices: false,
    },
  },
  {
    id: "executive",
    name: "Executive",
    description: "Executive leadership team",
    color: "#8B5CF6",
    permissions: {
      canViewOwnLogs: true,
      canViewTeamLogs: true,
      canViewAllLogs: true,
      canManageStaff: true,
      canApproveInvoices: true,
    },
  },
];

// Sample staff data
export const sampleStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Michael Barreto",
    email: "michaelbarreto@cloudnowcorp.com",
    role: "ceo",
    category: sampleStaffCategories[3], // Executive
    hourlyRate: 120,
    isActive: true,
    avatar: "/avatars/michael-barreto.jpg",
    department: "Executive",
    position: "Chief Executive Officer",
    hireDate: "2021-01-01",
    createdAt: "2021-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "staff-2",
    name: "Everton de Almeida",
    email: "evertondealmeida@cloudnowcorp.com",
    role: "supervisor",
    category: sampleStaffCategories[0], // Cybersecurity Services
    hourlyRate: 85,
    isActive: true,
    avatar: "/avatars/everton-almeida.jpg",
    department: "Cybersecurity Services",
    position: "Director of Cybersecurity",
    hireDate: "2022-03-15",
    createdAt: "2022-03-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "staff-3",
    name: "Muhammad Khuluqil Karim",
    email: "muhammadkarim@cloudnowcorp.com",
    role: "staff",
    category: sampleStaffCategories[0], // Cybersecurity Services
    hourlyRate: 65,
    isActive: true,
    avatar: "/avatars/muhammad-karim.jpg",
    department: "Cybersecurity Services",
    position: "Cybersecurity Operations Analyst",
    hireDate: "2023-06-01",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "staff-4",
    name: "Raihan Habibi",
    email: "raihanhabibi@cloudnowcorp.com",
    role: "staff",
    category: sampleStaffCategories[2], // Cloud & Systems Services
    hourlyRate: 60,
    isActive: true,
    avatar: "/avatars/raihan-habibi.jpg",
    department: "Cloud & Systems Services",
    position: "IT Systems Administrator",
    hireDate: "2023-02-01",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "staff-5",
    name: "Riza Taufiqur Rohman",
    email: "rizarohman@cloudnowcorp.com",
    role: "staff",
    category: sampleStaffCategories[1], // Information Technology Services
    hourlyRate: 55,
    isActive: true,
    avatar: "/avatars/riza-rohman.jpg",
    department: "Information Technology Services",
    position: "Web Developer",
    hireDate: "2023-04-15",
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

// Sample hourly rates history
export const sampleHourlyRates: HourlyRate[] = [
  {
    id: "rate-1",
    staffId: "staff-1",
    rate: 120,
    effectiveDate: "2024-01-01",
    currency: "USD",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rate-2",
    staffId: "staff-2",
    rate: 85,
    effectiveDate: "2024-01-01",
    currency: "USD",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rate-3",
    staffId: "staff-3",
    rate: 65,
    effectiveDate: "2024-01-01",
    currency: "USD",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rate-4",
    staffId: "staff-4",
    rate: 60,
    effectiveDate: "2024-01-01",
    currency: "USD",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rate-5",
    staffId: "staff-5",
    rate: 55,
    effectiveDate: "2024-01-01",
    currency: "USD",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Utility functions for staff management
export const getStaffById = (staffId: string): Staff | undefined => {
  return sampleStaff.find((staff) => staff.id === staffId);
};

export const getStaffByRole = (role: StaffRole): Staff[] => {
  return sampleStaff.filter((staff) => staff.role === role);
};

export const getStaffByCategory = (categoryId: string): Staff[] => {
  return sampleStaff.filter((staff) => staff.category.id === categoryId);
};

export const getActiveStaff = (): Staff[] => {
  return sampleStaff.filter((staff) => staff.isActive);
};

export const getStaffPermissions = (staff: Staff): StaffPermissions => {
  return {
    canViewOwnLogs: staff.category.permissions.canViewOwnLogs,
    canViewTeamLogs: staff.category.permissions.canViewTeamLogs,
    canViewAllLogs: staff.category.permissions.canViewAllLogs,
    canManageStaff: staff.category.permissions.canManageStaff,
    canApproveInvoices: staff.category.permissions.canApproveInvoices,
    canEditOwnRate: staff.role === "ceo" || staff.role === "admin",
  };
};

export const canAccessStaffData = (
  currentStaff: Staff,
  targetStaffId: string
): boolean => {
  const permissions = getStaffPermissions(currentStaff);

  // Can always view own data
  if (currentStaff.id === targetStaffId) {
    return true;
  }

  // Check permissions based on role
  if (permissions.canViewAllLogs) {
    return true;
  }

  if (permissions.canViewTeamLogs) {
    const targetStaff = getStaffById(targetStaffId);
    if (targetStaff && targetStaff.category.id === currentStaff.category.id) {
      return true;
    }
  }

  return false;
};

export const calculateStaffSummary = (): StaffSummary => {
  const activeStaff = getActiveStaff();
  const totalStaff = sampleStaff.length;
  const inactiveStaff = totalStaff - activeStaff.length;
  const totalCategories = sampleStaffCategories.length;

  const averageHourlyRate =
    activeStaff.length > 0
      ? activeStaff.reduce((sum, staff) => sum + staff.hourlyRate, 0) /
        activeStaff.length
      : 0;

  return {
    totalStaff,
    activeStaff: activeStaff.length,
    inactiveStaff,
    totalCategories,
    averageHourlyRate: Math.round(averageHourlyRate * 100) / 100,
  };
};

export const getRoleDisplayName = (role: StaffRole): string => {
  const roleNames: Record<StaffRole, string> = {
    staff: "Staff Member",
    supervisor: "Supervisor",
    hr: "HR Manager",
    admin: "Administrator",
    ceo: "CEO",
  };

  return roleNames[role] || role;
};

export const getRoleColor = (role: StaffRole): string => {
  const roleColors: Record<StaffRole, string> = {
    staff: "bg-blue-100 text-blue-800",
    supervisor: "bg-green-100 text-green-800",
    hr: "bg-purple-100 text-purple-800",
    admin: "bg-yellow-100 text-yellow-800",
    ceo: "bg-red-100 text-red-800",
  };

  return roleColors[role] || "bg-gray-100 text-gray-800";
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const validateHourlyRate = (rate: number): boolean => {
  return rate > 0 && rate <= 1000; // Reasonable range
};

export const updateStaffHourlyRate = (
  staffId: string,
  newRate: number
): Staff | null => {
  const staffIndex = sampleStaff.findIndex((staff) => staff.id === staffId);
  if (staffIndex === -1) return null;

  sampleStaff[staffIndex].hourlyRate = newRate;
  sampleStaff[staffIndex].updatedAt = new Date().toISOString();

  return sampleStaff[staffIndex];
};
