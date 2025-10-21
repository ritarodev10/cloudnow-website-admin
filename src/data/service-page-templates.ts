import { ComponentTemplate, TemplateCategory, PageBlock, PageContent } from "@/types/service-page-builder";

// Predefined page templates
export const servicePageTemplates: ComponentTemplate[] = [
  {
    id: "standard-service",
    name: "Standard Service",
    description: "A clean, professional layout perfect for most services",
    category: "business",
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "Your Service Title",
          subtitle: "Compelling subtitle that describes your service",
          description: "Brief description of what makes your service unique and valuable to customers.",
          ctaText: "Get Started",
          ctaLink: "#contact",
          alignment: "center",
          height: "large"
        },
        order: 0
      },
      {
        id: "features_1",
        type: "features",
        category: "content",
        props: {
          title: "Key Features",
          subtitle: "What sets us apart",
          features: [
            {
              id: "1",
              title: "Feature 1",
              description: "Detailed description of your first key feature and its benefits"
            },
            {
              id: "2",
              title: "Feature 2", 
              description: "Detailed description of your second key feature and its benefits"
            },
            {
              id: "3",
              title: "Feature 3",
              description: "Detailed description of your third key feature and its benefits"
            }
          ],
          columns: 3,
          layout: "grid"
        },
        order: 1
      },
      {
        id: "cta_1",
        type: "cta",
        category: "conversion",
        props: {
          title: "Ready to Get Started?",
          description: "Contact us today to learn more about our services and how we can help your business grow.",
          buttonText: "Contact Us",
          buttonLink: "#contact",
          background: "primary",
          alignment: "center"
        },
        order: 2
      }
    ],
    tags: ["business", "professional", "standard", "clean"]
  },
  {
    id: "premium-service",
    name: "Premium Service",
    description: "A sophisticated layout with testimonials and statistics",
    category: "premium",
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "Premium Service",
          subtitle: "Experience the difference with our premium offering",
          description: "Comprehensive solution designed for discerning clients who demand the best.",
          ctaText: "Learn More",
          ctaLink: "#features",
          ctaSecondaryText: "View Pricing",
          ctaSecondaryLink: "#pricing",
          alignment: "center",
          height: "large"
        },
        order: 0
      },
      {
        id: "stats_1",
        type: "stats",
        category: "social-proof",
        props: {
          title: "Proven Results",
          subtitle: "Numbers that speak for themselves",
          stats: [
            { id: "1", value: "99%", label: "Success Rate" },
            { id: "2", value: "500+", label: "Happy Clients" },
            { id: "3", value: "24/7", label: "Support" },
            { id: "4", value: "5★", label: "Average Rating" }
          ],
          layout: "grid",
          columns: 4
        },
        order: 1
      },
      {
        id: "features_1",
        type: "features",
        category: "content",
        props: {
          title: "Premium Features",
          subtitle: "Everything you need for success",
          features: [
            {
              id: "1",
              title: "Advanced Analytics",
              description: "Comprehensive reporting and insights to track your progress"
            },
            {
              id: "2",
              title: "Priority Support",
              description: "Dedicated support team available around the clock"
            },
            {
              id: "3",
              title: "Custom Solutions",
              description: "Tailored solutions designed specifically for your needs"
            }
          ],
          columns: 3,
          layout: "cards"
        },
        order: 2
      },
      {
        id: "testimonials_1",
        type: "testimonials",
        category: "social-proof",
        props: {
          title: "What Our Clients Say",
          subtitle: "Don't just take our word for it",
          testimonials: [
            {
              id: "1",
              name: "John Doe",
              role: "CEO",
              company: "Tech Corp",
              content: "Exceptional service that exceeded our expectations. The team's expertise and dedication made all the difference.",
              rating: 5
            },
            {
              id: "2",
              name: "Jane Smith",
              role: "CTO",
              company: "Innovation Inc",
              content: "Outstanding results and incredible support. Highly recommended for any business looking to scale.",
              rating: 5
            }
          ],
          layout: "carousel",
          columns: 2
        },
        order: 3
      },
      {
        id: "cta_1",
        type: "cta",
        category: "conversion",
        props: {
          title: "Ready to Experience Premium?",
          description: "Join hundreds of satisfied clients who trust us with their most important projects.",
          buttonText: "Get Started Today",
          buttonLink: "#contact",
          background: "primary",
          alignment: "center"
        },
        order: 4
      }
    ],
    tags: ["premium", "testimonials", "stats", "sophisticated"]
  },
  {
    id: "minimal-service",
    name: "Minimal Service",
    description: "Clean and minimal design focusing on essential information",
    category: "minimal",
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "Simple. Effective. Reliable.",
          subtitle: "Your trusted service partner",
          alignment: "center",
          height: "medium"
        },
        order: 0
      },
      {
        id: "text_1",
        type: "text",
        category: "content",
        props: {
          content: "<p>We believe in simplicity and effectiveness. Our service delivers exactly what you need, when you need it, without unnecessary complexity.</p><p>Focus on what matters most while we handle the rest.</p>",
          alignment: "center",
          fontSize: "large"
        },
        order: 1
      },
      {
        id: "features_1",
        type: "features",
        category: "content",
        props: {
          features: [
            {
              id: "1",
              title: "Simple Setup",
              description: "Get started in minutes, not hours"
            },
            {
              id: "2",
              title: "Reliable Service",
              description: "Consistent performance you can count on"
            },
            {
              id: "3",
              title: "Easy Management",
              description: "Intuitive tools for effortless control"
            }
          ],
          columns: 3,
          layout: "list"
        },
        order: 2
      },
      {
        id: "cta_1",
        type: "cta",
        category: "conversion",
        props: {
          title: "Start Simple",
          buttonText: "Get Started",
          buttonLink: "#contact",
          background: "secondary",
          alignment: "center"
        },
        order: 3
      }
    ],
    tags: ["minimal", "simple", "clean", "focused"]
  }
];

// Template categories
export const templateCategories: TemplateCategory[] = [
  {
    id: "business",
    name: "Business",
    description: "Professional business templates",
    templates: servicePageTemplates.filter(t => t.category === "business")
  },
  {
    id: "premium",
    name: "Premium",
    description: "High-end service templates",
    templates: servicePageTemplates.filter(t => t.category === "premium")
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and minimal designs",
    templates: servicePageTemplates.filter(t => t.category === "minimal")
  }
];

// Helper functions
export const getTemplateById = (id: string): ComponentTemplate | undefined => {
  return servicePageTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ComponentTemplate[] => {
  return servicePageTemplates.filter(template => template.category === category);
};

export const searchTemplates = (query: string): ComponentTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return servicePageTemplates.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const createEmptyPageContent = (): PageContent => {
  return {
    blocks: [],
    metadata: {
      lastEditedAt: new Date(),
      version: 1
    }
  };
};

export const applyTemplateToPageContent = (template: ComponentTemplate): PageContent => {
  return {
    blocks: template.blocks.map((block, index) => ({
      ...block,
      id: `block_${Date.now()}_${index}`,
      order: index
    })),
    metadata: {
      lastEditedAt: new Date(),
      version: 1
    }
  };
};
