// Re-export all types from module files
export * from "./dashboard";
export * from "./blog";
export * from "./sidebar";

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
