// Service Page Builder Types

export type BlockType = 
  | "hero"
  | "features"
  | "cta"
  | "faq"
  | "testimonials"
  | "stats"
  | "pricing"
  | "text"
  | "image"
  | "contact-form"
  | "gallery"
  | "video";

export type BlockCategory = 
  | "header"
  | "content"
  | "conversion"
  | "social-proof"
  | "media"
  | "forms";

export interface PageBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  props: Record<string, unknown>;
  order: number;
}

export interface PageContent {
  blocks: PageBlock[];
  metadata: {
    lastEditedAt: Date;
    version: number;
  };
}

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  blocks: PageBlock[];
  tags: string[];
}

export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  icon: string;
  defaultProps: Record<string, unknown>;
  requiredProps: string[];
  optionalProps: string[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: ComponentTemplate[];
}

export interface EditorState {
  selectedBlockId?: string;
  isPreviewMode: boolean;
  previewDevice: "desktop" | "tablet" | "mobile";
  isSaving: boolean;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
}

export interface ServicePageEditorProps {
  serviceId?: string;
  initialContent?: PageContent;
  onSave: (content: PageContent) => Promise<void>;
  onPublish: (content: PageContent) => Promise<void>;
}

// Block-specific prop interfaces
export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  alignment?: "left" | "center" | "right";
  height?: "small" | "medium" | "large" | "full";
}

export interface FeaturesBlockProps {
  title?: string;
  subtitle?: string;
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  layout?: "grid" | "list" | "cards";
}

export interface CtaBlockProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  buttonSecondaryText?: string;
  buttonSecondaryLink?: string;
  background?: "primary" | "secondary" | "accent" | "image";
  backgroundImage?: string;
  alignment?: "left" | "center" | "right";
}

export interface FaqBlockProps {
  title?: string;
  subtitle?: string;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  layout?: "accordion" | "grid";
}

export interface ServiceTestimonialsBlockProps {
  groupId?: string;
  displayStyle: "grid" | "carousel" | "list";
  showGroupName?: boolean;
  maxItems?: number;
  title?: string;
  subtitle?: string;
}

export interface StatsBlockProps {
  title?: string;
  subtitle?: string;
  stats: Array<{
    id: string;
    value: string;
    label: string;
    icon?: string;
  }>;
  layout?: "horizontal" | "grid";
  columns?: 2 | 3 | 4;
}

export interface PricingBlockProps {
  title?: string;
  subtitle?: string;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    popular?: boolean;
  }>;
  columns?: 1 | 2 | 3 | 4;
}

export interface TextBlockProps {
  content: string;
  alignment?: "left" | "center" | "right";
  fontSize?: "small" | "medium" | "large";
  backgroundColor?: string;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  alignment?: "left" | "center" | "right";
  size?: "small" | "medium" | "large" | "full";
  link?: string;
}

// Union type for all block props
export type BlockProps = 
  | HeroBlockProps
  | FeaturesBlockProps
  | CtaBlockProps
  | FaqBlockProps
  | ServiceTestimonialsBlockProps
  | StatsBlockProps
  | PricingBlockProps
  | TextBlockProps
  | ImageBlockProps
  | Record<string, unknown>;
