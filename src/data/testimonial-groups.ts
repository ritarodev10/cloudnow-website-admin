import { TestimonialGroup, TestimonialGroupFormData, Testimonial } from "@/types/testimonials";
import { testimonials } from "./testimonials";

// Mock testimonial groups data
export const testimonialGroups: TestimonialGroup[] = [
  {
    id: "group_1",
    name: "Customer Success Stories",
    description: "Testimonials highlighting successful customer implementations and outcomes",
    testimonialIds: ["testimonial_1", "testimonial_6"],
    order: ["testimonial_1", "testimonial_6"],
    isActive: true,
    usagePaths: ["/services/cloud-migration", "/services/cloud-consulting"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "group_2", 
    name: "Technical Excellence",
    description: "Testimonials showcasing our technical expertise and support quality",
    testimonialIds: ["testimonial_2", "testimonial_5"],
    order: ["testimonial_2", "testimonial_5"],
    isActive: true,
    usagePaths: ["/services/devops-automation", "/services/cloud-security"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "group_3",
    name: "Service Quality",
    description: "Testimonials emphasizing our service quality and customer satisfaction",
    testimonialIds: ["testimonial_2", "testimonial_4", "testimonial_5"],
    order: ["testimonial_2", "testimonial_4", "testimonial_5"],
    isActive: true,
    usagePaths: ["/services/cloud-support", "/services/cloud-monitoring"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "group_4",
    name: "Implementation Success",
    description: "Testimonials from successful project implementations",
    testimonialIds: ["testimonial_1", "testimonial_3"],
    order: ["testimonial_1", "testimonial_3"],
    isActive: true,
    usagePaths: ["/services/cloud-migration"],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: "group_5",
    name: "Partnership Testimonials",
    description: "Long-term partnership and collaboration testimonials",
    testimonialIds: ["testimonial_4"],
    order: ["testimonial_4"],
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

export const getGroupById = (id: string): TestimonialGroup | undefined => {
  return testimonialGroups.find(group => group.id === id);
};

export const getTestimonialsByGroupId = (groupId: string): Testimonial[] => {
  const group = getGroupById(groupId);
  if (!group) return [];
  
  // Return testimonials in the order specified by the group
  const testimonialsInOrder = group.order
    .map(testimonialId => testimonials.find(t => t.id === testimonialId))
    .filter((testimonial): testimonial is Testimonial => testimonial !== undefined);
  
  return testimonialsInOrder;
};

export const getActiveGroups = (): TestimonialGroup[] => {
  return testimonialGroups.filter(group => group.isActive);
};

export const getGroupsByTestimonialId = (testimonialId: string): TestimonialGroup[] => {
  return testimonialGroups.filter(group => group.testimonialIds.includes(testimonialId));
};

export const searchGroups = (query: string): TestimonialGroup[] => {
  const lowercaseQuery = query.toLowerCase();
  return testimonialGroups.filter(group =>
    group.name.toLowerCase().includes(lowercaseQuery) ||
    (group.description && group.description.toLowerCase().includes(lowercaseQuery)) ||
    group.usagePaths.some(path => 
      path.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const searchGroupsWithTestimonials = (query: string): TestimonialGroup[] => {
  const lowercaseQuery = query.toLowerCase();
  return testimonialGroups.filter(group => {
    // Search in group properties
    if (group.name.toLowerCase().includes(lowercaseQuery) ||
        (group.description && group.description.toLowerCase().includes(lowercaseQuery)) ||
        group.usagePaths.some(path => path.toLowerCase().includes(lowercaseQuery))) {
      return true;
    }

    // Search in testimonial content within the group
    const groupTestimonials = getTestimonialsByGroupId(group.id);
    return groupTestimonials.some(testimonial =>
      testimonial.name.toLowerCase().includes(lowercaseQuery) ||
      testimonial.title.toLowerCase().includes(lowercaseQuery) ||
      testimonial.company.toLowerCase().includes(lowercaseQuery) ||
      testimonial.testimony.toLowerCase().includes(lowercaseQuery) ||
      testimonial.categories.some((category: string) => 
        category.toLowerCase().includes(lowercaseQuery)
      )
    );
  });
};

export const validateGroupForm = (data: TestimonialGroupFormData): Record<string, string> => {
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

  if (!data.testimonialIds || data.testimonialIds.length === 0) {
    errors.testimonialIds = "At least one testimonial must be selected";
  }

  // Validate that all testimonial IDs exist
  if (data.testimonialIds) {
    const invalidIds = data.testimonialIds.filter(id => 
      !testimonials.some(testimonial => testimonial.id === id)
    );
    if (invalidIds.length > 0) {
      errors.testimonialIds = "Some selected testimonials are invalid";
    }
  }

  // Validate order array matches testimonialIds
  if (data.order && data.testimonialIds) {
    const orderSet = new Set(data.order);
    const testimonialIdsSet = new Set(data.testimonialIds);
    
    if (orderSet.size !== testimonialIdsSet.size || 
        ![...orderSet].every(id => testimonialIdsSet.has(id))) {
      errors.order = "Order array must contain exactly the same testimonial IDs";
    }
  }

  return errors;
};

export const createGroupFromTestimonials = (
  name: string,
  testimonialIds: string[],
  description?: string
): TestimonialGroup => {
  return {
    id: generateGroupId(),
    name,
    description,
    testimonialIds,
    order: [...testimonialIds], // Default order matches selection order
    isActive: true,
    usagePaths: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const duplicateGroup = (groupId: string, newName: string): TestimonialGroup | null => {
  const originalGroup = getGroupById(groupId);
  if (!originalGroup) return null;

  return {
    id: generateGroupId(),
    name: newName,
    description: originalGroup.description,
    testimonialIds: [...originalGroup.testimonialIds],
    order: [...originalGroup.order],
    isActive: true,
    usagePaths: [], // New groups start with no usage
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const calculateGroupStats = (groups: TestimonialGroup[]): {
  total: number;
  active: number;
  inactive: number;
  totalTestimonials: number;
  usedGroups: number;
  unusedGroups: number;
} => {
  const total = groups.length;
  const active = groups.filter(g => g.isActive).length;
  const inactive = total - active;
  
  const totalTestimonials = groups.reduce((sum, group) => sum + group.testimonialIds.length, 0);
  const usedGroups = groups.filter(g => g.usagePaths.length > 0).length;
  const unusedGroups = total - usedGroups;

  return {
    total,
    active,
    inactive,
    totalTestimonials,
    usedGroups,
    unusedGroups
  };
};

// Helper functions for usage tracking
export const addUsagePath = (groupId: string, path: string): TestimonialGroup | null => {
  const group = getGroupById(groupId);
  if (!group) return null;

  if (!group.usagePaths.includes(path)) {
    group.usagePaths.push(path);
    group.updatedAt = new Date();
  }
  
  return group;
};

export const removeUsagePath = (groupId: string, path: string): TestimonialGroup | null => {
  const group = getGroupById(groupId);
  if (!group) return null;

  group.usagePaths = group.usagePaths.filter(p => p !== path);
  group.updatedAt = new Date();
  
  return group;
};

export const getGroupsByUsagePath = (path: string): TestimonialGroup[] => {
  return testimonialGroups.filter(group => group.usagePaths.includes(path));
};

export const getUsageStats = (): {
  totalPaths: number;
  uniquePaths: string[];
  mostUsedGroups: Array<{ group: TestimonialGroup; usageCount: number }>;
} => {
  const allPaths = testimonialGroups.flatMap(group => group.usagePaths);
  const uniquePaths = [...new Set(allPaths)];
  
  const mostUsedGroups = testimonialGroups
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
