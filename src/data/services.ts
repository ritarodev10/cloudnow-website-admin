import { Service, ServiceFormData, ServiceStats, ServiceFilters, ServiceCategory, PageContent } from "@/types";

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Generate unique ID for new services
export const generateServiceId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Sample services data based on the image
export const services: Service[] = [
  {
    id: "1",
    title: "IT Consulting",
    slug: "it-consulting",
    description: "Transform your business with our tailored IT consulting services designed for your unique needs.",
    category: "IT Consulting",
    status: "active",
    featured: true,
    pageContent: {
      blocks: [
        {
          id: "hero_1",
          type: "hero",
          category: "header",
          props: {
            title: "IT Consulting Services",
            subtitle: "Transform your business with expert IT solutions",
            description: "We provide comprehensive IT consulting services to help your business thrive in the digital age.",
            ctaText: "Get Started",
            ctaLink: "#contact"
          },
          order: 0
        }
      ],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Hosting Services",
    slug: "hosting-services",
    description: "Discover how our hosting services enhance performance, security, and scalability for your business needs.",
    category: "Hosting Services",
    status: "active",
    featured: true,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    title: "Microsoft Azure",
    slug: "microsoft-azure",
    description: "Microsoft Azure offers scalable solutions that drive innovation and efficiency for modern businesses.",
    category: "Microsoft Solutions",
    status: "active",
    featured: false,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    title: "Cloud Solutions",
    slug: "cloud-solutions",
    description: "Unlock efficiency and scalability with our tailored cloud solutions for seamless migration and optimization.",
    category: "Cloud Solutions",
    status: "active",
    featured: true,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    title: "Backup as a Service (BaaS)",
    slug: "backup-as-a-service",
    description: "Ensure your business continuity with our comprehensive Backup as a Service solutions tailored for you.",
    category: "Backup & Recovery",
    status: "active",
    featured: false,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "6",
    title: "Microsoft 365",
    slug: "microsoft-365",
    description: "Microsoft 365 transforms the way businesses operate, offering seamless collaboration and productivity tools.",
    category: "Microsoft Solutions",
    status: "active",
    featured: false,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "7",
    title: "Professional Services",
    slug: "professional-services",
    description: "Expert-led solutions for your business needs, ensuring high availability and performance.",
    category: "Professional Services",
    status: "active",
    featured: false,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "8",
    title: "Cybersecurity",
    slug: "cybersecurity",
    description: "Protect your critical data and assets with our comprehensive cybersecurity solutions tailored for your business.",
    category: "Cybersecurity",
    status: "active",
    featured: true,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "9",
    title: "Veeam Backup & Disaster Recovery",
    slug: "veeam-backup-disaster-recovery",
    description: "Veeam Backup & Disaster Recovery ensures your business data is secure, accessible, and easily recoverable.",
    category: "Backup & Recovery",
    status: "active",
    featured: false,
    pageContent: {
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1
      }
    },
    createdAt: new Date("2024-01-23"),
    updatedAt: new Date("2024-01-23"),
  },
];

// Service categories for dropdowns
export const serviceCategories: ServiceCategory[] = [
  "IT Consulting",
  "Cloud Solutions", 
  "Hosting Services",
  "Backup & Recovery",
  "Cybersecurity",
  "Professional Services",
  "Microsoft Solutions",
  "Other"
];

// Calculate service statistics
export const calculateServiceStats = (services: Service[]): ServiceStats => {
  const stats: ServiceStats = {
    total: services.length,
    active: services.filter(s => s.status === "active").length,
    inactive: services.filter(s => s.status === "inactive").length,
    draft: services.filter(s => s.status === "draft").length,
    featured: services.filter(s => s.featured).length,
    byCategory: {} as Record<ServiceCategory, number>
  };

  // Initialize category counts
  serviceCategories.forEach(category => {
    stats.byCategory[category] = 0;
  });

  // Count services by category
  services.forEach(service => {
    stats.byCategory[service.category]++;
  });

  return stats;
};

// Filter services based on criteria
export const filterServices = (services: Service[], filters: ServiceFilters): Service[] => {
  return services.filter(service => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== "all" && service.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && service.status !== filters.status) {
      return false;
    }

    // Featured filter
    if (filters.featured !== "all" && service.featured !== filters.featured) {
      return false;
    }

    return true;
  });
};

// Sort services
export const sortServices = (services: Service[], field: keyof Service, direction: "asc" | "desc"): Service[] => {
  return [...services].sort((a, b) => {
    let aValue: unknown = a[field];
    let bValue: unknown = b[field];

    // Skip sorting for complex types like PageContent
    if (field === "pageContent") {
      return 0;
    }

    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return direction === "asc" ? 1 : -1;
    if (bValue === undefined) return direction === "asc" ? -1 : 1;

    // Handle date fields
    if (field === "createdAt" || field === "updatedAt") {
      aValue = new Date(aValue as Date).getTime();
      bValue = new Date(bValue as Date).getTime();
    }

    // Handle string fields
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Convert to comparable types for comparison
    const aComparable = typeof aValue === "string" ? aValue : typeof aValue === "number" ? aValue : String(aValue);
    const bComparable = typeof bValue === "string" ? bValue : typeof bValue === "number" ? bValue : String(bValue);

    if (direction === "asc") {
      return aComparable < bComparable ? -1 : aComparable > bComparable ? 1 : 0;
    } else {
      return aComparable > bComparable ? -1 : aComparable < bComparable ? 1 : 0;
    }
  });
};

// Validate service form data
export const validateServiceForm = (data: ServiceFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  } else if (data.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  if (!data.status) {
    errors.status = "Status is required";
  }

  return errors;
};

// Page content helpers
export const createEmptyPageContent = (): PageContent => {
  return {
    blocks: [],
    metadata: {
      lastEditedAt: new Date(),
      version: 1
    }
  };
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const updateServicePageContent = (serviceId: string, pageContent: PageContent): Service | undefined => {
  const serviceIndex = services.findIndex(service => service.id === serviceId);
  if (serviceIndex === -1) return undefined;
  
  services[serviceIndex] = {
    ...services[serviceIndex],
    pageContent,
    updatedAt: new Date()
  };
  
  return services[serviceIndex];
};

// Future API integration hooks (placeholder)
export const useServices = () => {
  // TODO: Replace with actual API call
  return { 
    data: services, 
    loading: false, 
    error: null 
  };
};

export const useServiceStats = () => {
  // TODO: Replace with actual API call
  return { 
    data: calculateServiceStats(services), 
    loading: false, 
    error: null 
  };
};






