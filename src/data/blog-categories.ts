// Blog Categories Data
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
}

export const blogCategories: BlogCategory[] = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    description: "Posts about technology and innovation",
    postCount: 15,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    description: "Business insights and strategies",
    postCount: 8,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Design",
    slug: "design",
    description: "Design trends and tutorials",
    postCount: 12,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Marketing",
    slug: "marketing",
    description: "Marketing tips and strategies",
    postCount: 6,
    color: "bg-orange-500",
  },
];

// Utility functions for categories
export const searchCategories = (
  categories: BlogCategory[],
  searchTerm: string
) => {
  return categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getCategoryById = (categories: BlogCategory[], id: number) => {
  return categories.find((category) => category.id === id);
};

export const getCategoryBySlug = (categories: BlogCategory[], slug: string) => {
  return categories.find((category) => category.slug === slug);
};
