import { FAQ, FAQCategory, FAQFormData } from "@/types/faqs";

// FAQ categories
export const faqCategories: FAQCategory[] = [
  "General",
  "Cloud Services",
  "Billing",
  "Technical Support",
  "Security",
  "Implementation",
  "Other"
];

// Mock FAQs data
export const faqs: FAQ[] = [
  {
    id: "faq_1",
    question: "What cloud services does CloudNow offer?",
    answer: "CloudNow provides comprehensive cloud solutions including cloud migration, cloud consulting, DevOps automation, cloud security, Microsoft Solutions, hosting services, backup & recovery, and IT consulting. We help businesses transition to the cloud and optimize their cloud infrastructure.",
    categories: ["General", "Cloud Services"],
    isVisible: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "faq_2",
    question: "How long does a typical cloud migration take?",
    answer: "The duration of a cloud migration depends on several factors including the size of your infrastructure, complexity of applications, and data volume. Typically, small to medium businesses can expect 2-6 months, while enterprise migrations may take 6-18 months. We provide detailed timelines during our initial consultation.",
    categories: ["Cloud Services", "Implementation"],
    isVisible: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "faq_3",
    question: "What security measures do you implement?",
    answer: "We implement enterprise-grade security measures including multi-factor authentication, encryption at rest and in transit, regular security audits, compliance with industry standards (SOC 2, ISO 27001), and 24/7 security monitoring. Our security team conducts regular penetration testing and vulnerability assessments.",
    categories: ["Security", "Technical Support"],
    isVisible: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "faq_4",
    question: "Do you offer 24/7 technical support?",
    answer: "Yes, we provide 24/7 technical support for all our cloud services. Our support team includes certified cloud engineers who can help with technical issues, performance optimization, and emergency response. Support is available via phone, email, and our customer portal.",
    categories: ["Technical Support"],
    isVisible: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    id: "faq_5",
    question: "What are your pricing models?",
    answer: "We offer flexible pricing models including pay-as-you-go, reserved instances, and enterprise agreements. Pricing depends on the services you need, usage volume, and support level. Contact our sales team for a customized quote based on your specific requirements.",
    categories: ["Billing"],
    isVisible: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  },
  {
    id: "faq_6",
    question: "Can you help with Microsoft 365 migration?",
    answer: "Absolutely! We specialize in Microsoft 365 migrations including email migration, SharePoint setup, Teams deployment, and Azure AD configuration. Our certified Microsoft engineers ensure a smooth transition with minimal downtime and comprehensive training for your team.",
    categories: ["Implementation"],
    isVisible: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20")
  },
  {
    id: "faq_7",
    question: "What happens if there's a data breach?",
    answer: "In the unlikely event of a data breach, we have a comprehensive incident response plan. We immediately notify affected clients, implement containment measures, conduct forensic analysis, and work with legal and compliance teams. We also provide credit monitoring services and support throughout the recovery process.",
    categories: ["Security"],
    isVisible: false,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25")
  },
  {
    id: "faq_8",
    question: "Do you provide training for our team?",
    answer: "Yes, we offer comprehensive training programs for your team including cloud fundamentals, specific platform training (AWS, Azure, Google Cloud), security best practices, and DevOps methodologies. Training can be delivered on-site, remotely, or through our learning management system.",
    categories: ["Implementation", "Technical Support"],
    isVisible: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  }
];

// Helper functions
export const generateFaqId = (): string => {
  return `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getFaqById = (id: string): FAQ | undefined => {
  return faqs.find(faq => faq.id === id);
};

export const getFaqsByCategory = (category: FAQCategory): FAQ[] => {
  return faqs.filter(faq => faq.categories.includes(category));
};

export const getVisibleFaqs = (): FAQ[] => {
  return faqs.filter(faq => faq.isVisible);
};

export const searchFaqs = (query: string): FAQ[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery) ||
    faq.categories.some(category => 
      category.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const filterFaqs = (
  faqs: FAQ[],
  filters: {
    search?: string;
    categories?: FAQCategory[];
    visibility?: "all" | "visible" | "hidden";
  }
): FAQ[] => {
  let filtered = [...faqs];

  // Search filter
  if (filters.search) {
    const lowercaseQuery = filters.search.toLowerCase();
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.categories.some(category => 
        category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(faq =>
      faq.categories.some(category => filters.categories!.includes(category))
    );
  }

  // Visibility filter
  if (filters.visibility === "visible") {
    filtered = filtered.filter(faq => faq.isVisible);
  } else if (filters.visibility === "hidden") {
    filtered = filtered.filter(faq => !faq.isVisible);
  }

  return filtered;
};

export const sortFaqs = (
  faqs: FAQ[],
  sortBy: "date" | "question" | "category",
  sortOrder: "asc" | "desc" = "desc"
): FAQ[] => {
  const sorted = [...faqs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "question":
        comparison = a.question.localeCompare(b.question);
        break;
      case "category":
        comparison = a.categories[0].localeCompare(b.categories[0]);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
};

export const validateFaqForm = (data: FAQFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.question || data.question.trim().length < 5) {
    errors.question = "Question must be at least 5 characters";
  }
  if (data.question && data.question.length > 200) {
    errors.question = "Question must be less than 200 characters";
  }

  if (!data.answer || data.answer.trim().length < 10) {
    errors.answer = "Answer must be at least 10 characters";
  }
  if (data.answer && data.answer.length > 2000) {
    errors.answer = "Answer must be less than 2000 characters";
  }

  if (!data.categories || data.categories.length === 0) {
    errors.categories = "At least one category must be selected";
  }

  return errors;
};
