import { BlogPost, BlogStats } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with CloudNow: A Comprehensive Guide",
    status: "Published",
    category: "Tutorials",
    author: "Admin User",
    date: "2025-10-15",
    views: 1245,
    tags: ["getting-started", "tutorial", "guide"],
  },
  {
    id: 2,
    title: "10 Best Practices for Cloud Security in 2025",
    status: "Published",
    category: "Security",
    author: "Admin User",
    date: "2025-10-10",
    views: 982,
    tags: ["security", "best-practices", "cloud"],
  },
  {
    id: 3,
    title: "How to Optimize Your Website Performance",
    status: "Published",
    category: "Performance",
    author: "Admin User",
    date: "2025-10-05",
    views: 756,
    tags: ["performance", "optimization", "web"],
  },
  {
    id: 4,
    title: "Understanding Serverless Architecture",
    status: "Draft",
    category: "Technology",
    author: "Admin User",
    date: "2025-10-01",
    views: 0,
    tags: ["serverless", "architecture", "cloud"],
  },
  {
    id: 5,
    title: "The Future of Web Development in 2026",
    status: "Draft",
    category: "Trends",
    author: "Admin User",
    date: "2025-09-28",
    views: 0,
    tags: ["future", "trends", "web-development"],
  },
];

export const calculateBlogStats = (posts: BlogPost[]): BlogStats => {
  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "Published").length,
    draftPosts: posts.filter((p) => p.status === "Draft").length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
  };
};
