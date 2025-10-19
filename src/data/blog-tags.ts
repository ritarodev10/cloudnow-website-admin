// Blog Tags Data
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
  color: string;
}

export const blogTags: BlogTag[] = [
  {
    id: 1,
    name: "React",
    slug: "react",
    postCount: 8,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "JavaScript",
    slug: "javascript",
    postCount: 12,
    color: "bg-yellow-500",
  },
  {
    id: 3,
    name: "CSS",
    slug: "css",
    postCount: 6,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Node.js",
    slug: "nodejs",
    postCount: 5,
    color: "bg-green-500",
  },
  {
    id: 5,
    name: "TypeScript",
    slug: "typescript",
    postCount: 7,
    color: "bg-blue-600",
  },
  {
    id: 6,
    name: "Next.js",
    slug: "nextjs",
    postCount: 4,
    color: "bg-gray-500",
  },
];

// Utility functions for tags
export const searchTags = (tags: BlogTag[], searchTerm: string) => {
  return tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getTagById = (tags: BlogTag[], id: number) => {
  return tags.find((tag) => tag.id === id);
};

export const getTagBySlug = (tags: BlogTag[], slug: string) => {
  return tags.find((tag) => tag.slug === slug);
};

export const getPopularTags = (tags: BlogTag[], limit: number = 10) => {
  return tags.sort((a, b) => b.postCount - a.postCount).slice(0, limit);
};
