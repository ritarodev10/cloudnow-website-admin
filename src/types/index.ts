// Re-export all types from module files
export * from "./dashboard";
export * from "./blog";
export * from "./sidebar";
export * from "./services";
export * from "./service-page-builder";
export * from "./testimonials";
export * from "./faqs";

// Re-export Strapi blog types with explicit naming to avoid conflicts
export type {
  BlogPost as StrapiBlogPost,
  BlogPostFormData,
  BlogPostFilters,
  BlogPostSortOptions,
  BlogCategory,
  BlogTag,
  BlogAuthor,
  EditorState,
  StrapiResponse,
  StrapiEntity,
  StrapiMedia,
  StrapiMediaFormat,
  BlogPostValidationErrors,
  EditorToolbarItem,
  STRAPI_ENDPOINTS,
} from "./blog-strapi";
