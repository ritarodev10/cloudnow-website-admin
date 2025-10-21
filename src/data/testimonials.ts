import { Testimonial, TestimonialCategory, TestimonialFormData } from "@/types/testimonials";

// Testimonial categories
export const testimonialCategories: TestimonialCategory[] = [
  "Customer Success",
  "Product Review",
  "Service Quality", 
  "Technical Support",
  "Implementation",
  "Partnership",
  "General Feedback"
];

// Mock testimonials data
export const testimonials: Testimonial[] = [
  {
    id: "testimonial_1",
    name: "Sarah Johnson",
    title: "CTO",
    company: "TechCorp Solutions",
    testimony: "CloudNow's cloud migration service was exceptional. They helped us seamlessly transition our entire infrastructure to AWS, reducing costs by 40% while improving performance. Their team's expertise and support throughout the process was outstanding.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: ["Customer Success", "Implementation"],
    isVisible: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "testimonial_2", 
    name: "Michael Chen",
    title: "IT Director",
    company: "Global Enterprises",
    testimony: "The technical support team at CloudNow is incredibly responsive and knowledgeable. They resolved our critical issues within hours and provided excellent guidance on best practices. Highly recommended!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: ["Technical Support", "Service Quality"],
    isVisible: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "testimonial_3",
    name: "Emily Rodriguez",
    title: "VP of Operations", 
    company: "StartupXYZ",
    testimony: "CloudNow's Microsoft Solutions team helped us implement Office 365 and Azure AD across our organization. The migration was smooth and their training sessions were very helpful for our team.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    categories: ["Implementation"],
    isVisible: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "testimonial_4",
    name: "David Thompson",
    title: "CEO",
    company: "InnovateTech",
    testimony: "We've been using CloudNow's hosting services for over two years. The uptime is excellent and their customer service is top-notch. They've become an essential partner for our business.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: ["Partnership"],
    isVisible: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: "testimonial_5",
    name: "Lisa Wang",
    title: "Security Manager",
    company: "SecureCorp",
    testimony: "CloudNow's cybersecurity services helped us strengthen our security posture significantly. Their comprehensive security assessment identified vulnerabilities we weren't aware of, and their remediation plan was thorough and effective.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: ["Service Quality"],
    isVisible: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  },
  {
    id: "testimonial_6",
    name: "Robert Kim",
    title: "IT Manager",
    company: "ManufacturingCo",
    testimony: "The backup and recovery solution from CloudNow saved us from a major data loss incident. Their automated backup system worked flawlessly and their recovery process was quick and efficient.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: ["Customer Success"],
    isVisible: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20")
  },
  {
    id: "testimonial_7",
    name: "Jennifer Adams",
    title: "Operations Director",
    company: "RetailMax",
    testimony: "CloudNow's IT consulting services provided us with valuable insights into our technology infrastructure. Their recommendations helped us optimize our systems and improve efficiency across all departments.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    categories: ["General Feedback"],
    isVisible: false,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25")
  }
];

// Helper functions
export const generateTestimonialId = (): string => {
  return `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(testimonial => testimonial.id === id);
};

export const getTestimonialsByCategory = (category: TestimonialCategory): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.categories.includes(category));
};

export const getVisibleTestimonials = (): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.isVisible);
};

export const getTestimonialsByRating = (rating: number): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.rating === rating);
};

export const searchTestimonials = (query: string): Testimonial[] => {
  const lowercaseQuery = query.toLowerCase();
  return testimonials.filter(testimonial => 
    testimonial.name.toLowerCase().includes(lowercaseQuery) ||
    testimonial.company.toLowerCase().includes(lowercaseQuery) ||
    testimonial.title.toLowerCase().includes(lowercaseQuery) ||
    testimonial.testimony.toLowerCase().includes(lowercaseQuery) ||
    testimonial.categories.some(category => 
      category.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const filterTestimonials = (
  testimonials: Testimonial[],
  filters: {
    search?: string;
    categories?: TestimonialCategory[];
    rating?: number | null;
    visibility?: "all" | "visible" | "hidden";
  }
): Testimonial[] => {
  let filtered = [...testimonials];

  // Search filter
  if (filters.search) {
    const lowercaseQuery = filters.search.toLowerCase();
    filtered = filtered.filter(testimonial =>
      testimonial.name.toLowerCase().includes(lowercaseQuery) ||
      testimonial.company.toLowerCase().includes(lowercaseQuery) ||
      testimonial.title.toLowerCase().includes(lowercaseQuery) ||
      testimonial.testimony.toLowerCase().includes(lowercaseQuery) ||
      testimonial.categories.some(category => 
        category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(testimonial =>
      testimonial.categories.some(category => filters.categories!.includes(category))
    );
  }

  // Rating filter
  if (filters.rating) {
    filtered = filtered.filter(testimonial => testimonial.rating === filters.rating);
  }

  // Visibility filter
  if (filters.visibility === "visible") {
    filtered = filtered.filter(testimonial => testimonial.isVisible);
  } else if (filters.visibility === "hidden") {
    filtered = filtered.filter(testimonial => !testimonial.isVisible);
  }

  return filtered;
};

export const sortTestimonials = (
  testimonials: Testimonial[],
  sortBy: "date" | "rating" | "name" | "company",
  sortOrder: "asc" | "desc" = "desc"
): Testimonial[] => {
  const sorted = [...testimonials].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
};

export const calculateTestimonialStats = (testimonials: Testimonial[]): {
  total: number;
  averageRating: number;
  visible: number;
  hidden: number;
} => {
  const total = testimonials.length;
  const visible = testimonials.filter(t => t.isVisible).length;
  const hidden = total - visible;
  
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  const averageRating = total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0;

  return {
    total,
    averageRating,
    visible,
    hidden
  };
};

export const validateTestimonialForm = (data: TestimonialFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (data.name && data.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  if (!data.title || data.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters";
  }
  if (data.title && data.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  if (!data.company || data.company.trim().length < 2) {
    errors.company = "Company must be at least 2 characters";
  }
  if (data.company && data.company.length > 100) {
    errors.company = "Company must be less than 100 characters";
  }

  if (!data.testimony || data.testimony.trim().length < 10) {
    errors.testimony = "Testimony must be at least 10 characters";
  }
  if (data.testimony && data.testimony.length > 1000) {
    errors.testimony = "Testimony must be less than 1000 characters";
  }

  if (data.rating < 1 || data.rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (!data.categories || data.categories.length === 0) {
    errors.categories = "At least one category must be selected";
  }

  if (data.image && data.image.trim()) {
    try {
      new URL(data.image);
    } catch {
      errors.image = "Please enter a valid image URL";
    }
  }

  return errors;
};
