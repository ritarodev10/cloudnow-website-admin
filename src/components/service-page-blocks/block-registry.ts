import { BlockType, BlockDefinition } from "@/types/service-page-builder";

// Registry mapping block types to their definitions
export const blockRegistry: Record<BlockType, BlockDefinition> = {
  hero: {
    type: "hero",
    name: "Hero Section",
    description: "Eye-catching header with title, subtitle, and call-to-action",
    category: "header",
    icon: "🎯",
    defaultProps: {
      title: "Your Service Title",
      subtitle: "Compelling subtitle that describes your service",
      description: "Brief description of what makes your service unique",
      ctaText: "Get Started",
      ctaLink: "#",
      alignment: "center",
      height: "large"
    },
    requiredProps: ["title"],
    optionalProps: ["subtitle", "description", "ctaText", "ctaLink", "backgroundImage", "alignment", "height"]
  },
  features: {
    type: "features",
    name: "Features Grid",
    description: "Display key features or benefits in a grid layout",
    category: "content",
    icon: "✨",
    defaultProps: {
      title: "Key Features",
      features: [
        { id: "1", title: "Feature 1", description: "Description of feature 1" },
        { id: "2", title: "Feature 2", description: "Description of feature 2" },
        { id: "3", title: "Feature 3", description: "Description of feature 3" }
      ],
      columns: 3,
      layout: "grid"
    },
    requiredProps: ["features"],
    optionalProps: ["title", "subtitle", "columns", "layout"]
  },
  cta: {
    type: "cta",
    name: "Call to Action",
    description: "Prominent call-to-action section to drive conversions",
    category: "conversion",
    icon: "📢",
    defaultProps: {
      title: "Ready to Get Started?",
      description: "Take the next step and experience the difference",
      buttonText: "Contact Us",
      buttonLink: "#",
      background: "primary",
      alignment: "center"
    },
    requiredProps: ["title", "buttonText", "buttonLink"],
    optionalProps: ["description", "buttonSecondaryText", "buttonSecondaryLink", "background", "backgroundImage", "alignment"]
  },
  faq: {
    type: "faq",
    name: "FAQ Section",
    description: "Frequently asked questions in accordion or grid format",
    category: "content",
    icon: "❓",
    defaultProps: {
      title: "Frequently Asked Questions",
      faqs: [
        { id: "1", question: "What is this service?", answer: "This service provides..." },
        { id: "2", question: "How does it work?", answer: "The process involves..." }
      ],
      layout: "accordion"
    },
    requiredProps: ["faqs"],
    optionalProps: ["title", "subtitle", "layout"]
  },
  testimonials: {
    type: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials and reviews from groups",
    category: "social-proof",
    icon: "💬",
    defaultProps: {
      groupId: "",
      displayStyle: "grid",
      showGroupName: true,
      maxItems: undefined,
      title: "What Our Clients Say",
      subtitle: "Hear from our satisfied customers"
    },
    requiredProps: ["groupId"],
    optionalProps: ["displayStyle", "showGroupName", "maxItems", "title", "subtitle"]
  },
  stats: {
    type: "stats",
    name: "Statistics",
    description: "Display key statistics and metrics",
    category: "content",
    icon: "📊",
    defaultProps: {
      title: "Our Impact",
      stats: [
        { id: "1", value: "100+", label: "Happy Clients" },
        { id: "2", value: "50+", label: "Projects Completed" },
        { id: "3", value: "99%", label: "Success Rate" }
      ],
      layout: "horizontal",
      columns: 3
    },
    requiredProps: ["stats"],
    optionalProps: ["title", "subtitle", "layout", "columns"]
  },
  pricing: {
    type: "pricing",
    name: "Pricing Plans",
    description: "Service pricing tiers and packages",
    category: "conversion",
    icon: "💰",
    defaultProps: {
      title: "Choose Your Plan",
      plans: [
        {
          id: "1",
          name: "Basic",
          price: "$99",
          period: "/month",
          description: "Perfect for small businesses",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          ctaText: "Get Started",
          ctaLink: "#"
        }
      ],
      columns: 3
    },
    requiredProps: ["plans"],
    optionalProps: ["title", "subtitle", "columns"]
  },
  text: {
    type: "text",
    name: "Text Content",
    description: "Rich text content with formatting options",
    category: "content",
    icon: "📝",
    defaultProps: {
      content: "Add your text content here...",
      alignment: "left",
      fontSize: "medium"
    },
    requiredProps: ["content"],
    optionalProps: ["alignment", "fontSize", "backgroundColor"]
  },
  image: {
    type: "image",
    name: "Image",
    description: "Single image with caption and optional link",
    category: "media",
    icon: "🖼️",
    defaultProps: {
      src: "",
      alt: "Image description",
      alignment: "center",
      size: "medium"
    },
    requiredProps: ["src", "alt"],
    optionalProps: ["caption", "alignment", "size", "link"]
  },
  "contact-form": {
    type: "contact-form",
    name: "Contact Form",
    description: "Contact form for lead generation",
    category: "forms",
    icon: "📧",
    defaultProps: {
      title: "Get In Touch",
      description: "Send us a message and we'll get back to you",
      fields: ["name", "email", "message"],
      submitText: "Send Message"
    },
    requiredProps: ["title", "submitText"],
    optionalProps: ["description", "fields"]
  },
  gallery: {
    type: "gallery",
    name: "Image Gallery",
    description: "Multiple images in a grid or carousel layout",
    category: "media",
    icon: "🖼️",
    defaultProps: {
      title: "Gallery",
      images: [],
      layout: "grid",
      columns: 3
    },
    requiredProps: ["images"],
    optionalProps: ["title", "layout", "columns"]
  },
  video: {
    type: "video",
    name: "Video",
    description: "Embedded video content",
    category: "media",
    icon: "🎥",
    defaultProps: {
      src: "",
      title: "Video Title",
      autoplay: false,
      controls: true
    },
    requiredProps: ["src"],
    optionalProps: ["title", "autoplay", "controls", "poster"]
  }
};

// Helper function to get block definition by type
export const getBlockDefinition = (type: BlockType): BlockDefinition => {
  return blockRegistry[type];
};

// Helper function to get all blocks by category
export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return Object.values(blockRegistry).filter(block => block.category === category);
};

// Helper function to get all available block types
export const getAllBlockTypes = (): BlockType[] => {
  return Object.keys(blockRegistry) as BlockType[];
};
