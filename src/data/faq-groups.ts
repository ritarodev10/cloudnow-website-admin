import { FAQGroup, FAQGroupFormData, FAQ } from "@/types/faqs";
import { faqs } from "./faqs";

// Mock FAQ groups data
export const faqGroups: FAQGroup[] = [
  {
    id: "group_1",
    name: "Main FAQ",
    description: "Primary FAQ group containing the most commonly asked questions",
    faqIds: ["faq_1", "faq_2", "faq_4", "faq_5"],
    order: ["faq_1", "faq_2", "faq_4", "faq_5"],
    isActive: true,
    usagePaths: ["/faq", "/support"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "group_2", 
    name: "Cloud Services FAQ",
    description: "Frequently asked questions about our cloud services and solutions",
    faqIds: ["faq_1", "faq_2", "faq_6"],
    order: ["faq_1", "faq_2", "faq_6"],
    isActive: true,
    usagePaths: ["/services/cloud-migration", "/services/cloud-consulting"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "group_3",
    name: "Security & Support FAQ",
    description: "Questions about security measures and technical support",
    faqIds: ["faq_3", "faq_4", "faq_7"],
    order: ["faq_3", "faq_4", "faq_7"],
    isActive: true,
    usagePaths: ["/services/cloud-security", "/support"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "group_4",
    name: "Implementation FAQ",
    description: "Questions about project implementation and training",
    faqIds: ["faq_2", "faq_6", "faq_8"],
    order: ["faq_2", "faq_6", "faq_8"],
    isActive: true,
    usagePaths: ["/services/implementation"],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: "group_5",
    name: "Billing FAQ",
    description: "Questions about pricing, billing, and payment",
    faqIds: ["faq_5"],
    order: ["faq_5"],
    isActive: false,
    usagePaths: [],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  }
];

// Helper functions
export const generateGroupId = (): string => {
  return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getGroupById = (id: string): FAQGroup | undefined => {
  return faqGroups.find(group => group.id === id);
};

export const getFaqsByGroupId = (groupId: string): FAQ[] => {
  const group = getGroupById(groupId);
  if (!group) return [];
  
  // Return FAQs in the order specified by the group
  const faqsInOrder = group.order
    .map(faqId => faqs.find(f => f.id === faqId))
    .filter((faq): faq is FAQ => faq !== undefined);
  
  return faqsInOrder;
};

export const getActiveGroups = (): FAQGroup[] => {
  return faqGroups.filter(group => group.isActive);
};

export const getGroupsByFaqId = (faqId: string): FAQGroup[] => {
  return faqGroups.filter(group => group.faqIds.includes(faqId));
};

export const searchGroups = (query: string): FAQGroup[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqGroups.filter(group =>
    group.name.toLowerCase().includes(lowercaseQuery) ||
    (group.description && group.description.toLowerCase().includes(lowercaseQuery)) ||
    group.usagePaths.some(path => 
      path.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const searchGroupsWithFaqs = (query: string): FAQGroup[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqGroups.filter(group => {
    // Search in group properties
    if (group.name.toLowerCase().includes(lowercaseQuery) ||
        (group.description && group.description.toLowerCase().includes(lowercaseQuery)) ||
        group.usagePaths.some(path => path.toLowerCase().includes(lowercaseQuery))) {
      return true;
    }

    // Search in FAQ content within the group
    const groupFaqs = getFaqsByGroupId(group.id);
    return groupFaqs.some(faq =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.categories.some((category: string) => 
        category.toLowerCase().includes(lowercaseQuery)
      )
    );
  });
};

export const validateGroupForm = (data: FAQGroupFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Group name must be at least 2 characters";
  }
  if (data.name && data.name.length > 100) {
    errors.name = "Group name must be less than 100 characters";
  }

  if (data.description && data.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }

  if (!data.faqIds || data.faqIds.length === 0) {
    errors.faqIds = "At least one FAQ must be selected";
  }

  // Validate that all FAQ IDs exist
  if (data.faqIds) {
    const invalidIds = data.faqIds.filter(id => 
      !faqs.some(faq => faq.id === id)
    );
    if (invalidIds.length > 0) {
      errors.faqIds = "Some selected FAQs are invalid";
    }
  }

  // Validate order array matches faqIds
  if (data.order && data.faqIds) {
    const orderSet = new Set(data.order);
    const faqIdsSet = new Set(data.faqIds);
    
    if (orderSet.size !== faqIdsSet.size || 
        ![...orderSet].every(id => faqIdsSet.has(id))) {
      errors.order = "Order array must contain exactly the same FAQ IDs";
    }
  }

  return errors;
};

export const createGroupFromFaqs = (
  name: string,
  faqIds: string[],
  description?: string
): FAQGroup => {
  return {
    id: generateGroupId(),
    name,
    description,
    faqIds,
    order: [...faqIds], // Default order matches selection order
    isActive: true,
    usagePaths: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const duplicateGroup = (groupId: string, newName: string): FAQGroup | null => {
  const originalGroup = getGroupById(groupId);
  if (!originalGroup) return null;

  return {
    id: generateGroupId(),
    name: newName,
    description: originalGroup.description,
    faqIds: [...originalGroup.faqIds],
    order: [...originalGroup.order],
    isActive: true,
    usagePaths: [], // New groups start with no usage
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const calculateGroupStats = (groups: FAQGroup[]): {
  total: number;
  active: number;
  inactive: number;
  totalFaqs: number;
  usedGroups: number;
  unusedGroups: number;
} => {
  const total = groups.length;
  const active = groups.filter(g => g.isActive).length;
  const inactive = total - active;
  
  const totalFaqs = groups.reduce((sum, group) => sum + group.faqIds.length, 0);
  const usedGroups = groups.filter(g => g.usagePaths.length > 0).length;
  const unusedGroups = total - usedGroups;

  return {
    total,
    active,
    inactive,
    totalFaqs,
    usedGroups,
    unusedGroups
  };
};

// Helper functions for usage tracking
export const addUsagePath = (groupId: string, path: string): FAQGroup | null => {
  const group = getGroupById(groupId);
  if (!group) return null;

  if (!group.usagePaths.includes(path)) {
    group.usagePaths.push(path);
    group.updatedAt = new Date();
  }
  
  return group;
};

export const removeUsagePath = (groupId: string, path: string): FAQGroup | null => {
  const group = getGroupById(groupId);
  if (!group) return null;

  group.usagePaths = group.usagePaths.filter(p => p !== path);
  group.updatedAt = new Date();
  
  return group;
};

export const getGroupsByUsagePath = (path: string): FAQGroup[] => {
  return faqGroups.filter(group => group.usagePaths.includes(path));
};

export const getUsageStats = (): {
  totalPaths: number;
  uniquePaths: string[];
  mostUsedGroups: Array<{ group: FAQGroup; usageCount: number }>;
} => {
  const allPaths = faqGroups.flatMap(group => group.usagePaths);
  const uniquePaths = [...new Set(allPaths)];
  
  const mostUsedGroups = faqGroups
    .map(group => ({
      group,
      usageCount: group.usagePaths.length
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5);

  return {
    totalPaths: allPaths.length,
    uniquePaths,
    mostUsedGroups
  };
};





