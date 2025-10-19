// Blog Comments Data
export interface BlogComment {
  id: number;
  author: string;
  email: string;
  content: string;
  postTitle: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  isSpam: boolean;
}

export const blogComments: BlogComment[] = [
  {
    id: 1,
    author: "John Doe",
    email: "john@example.com",
    content:
      "Great article! This really helped me understand the concept better.",
    postTitle: "Understanding React Hooks",
    status: "approved",
    createdAt: "2024-01-15T10:30:00Z",
    isSpam: false,
  },
  {
    id: 2,
    author: "Jane Smith",
    email: "jane@example.com",
    content:
      "I have a question about the implementation. Can you provide more details?",
    postTitle: "Next.js Best Practices",
    status: "pending",
    createdAt: "2024-01-14T15:45:00Z",
    isSpam: false,
  },
  {
    id: 3,
    author: "Spam User",
    email: "spam@fake.com",
    content: "Check out my website! Buy now!",
    postTitle: "CSS Grid Layout Guide",
    status: "pending",
    createdAt: "2024-01-13T08:20:00Z",
    isSpam: true,
  },
  {
    id: 4,
    author: "Mike Johnson",
    email: "mike@example.com",
    content: "Thanks for sharing this. Very informative content.",
    postTitle: "TypeScript Tips and Tricks",
    status: "approved",
    createdAt: "2024-01-12T14:15:00Z",
    isSpam: false,
  },
];

// Utility functions for comments
export const searchComments = (comments: BlogComment[], searchTerm: string) => {
  return comments.filter((comment) => {
    return (
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
};

export const filterCommentsByStatus = (
  comments: BlogComment[],
  status: string
) => {
  if (status === "all") return comments;
  return comments.filter((comment) => comment.status === status);
};

export const getCommentById = (comments: BlogComment[], id: number) => {
  return comments.find((comment) => comment.id === id);
};

export const formatCommentDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCommentsStats = (comments: BlogComment[]) => {
  const total = comments.length;
  const approved = comments.filter((c) => c.status === "approved").length;
  const pending = comments.filter((c) => c.status === "pending").length;
  const rejected = comments.filter((c) => c.status === "rejected").length;
  const spam = comments.filter((c) => c.isSpam).length;

  return {
    total,
    approved,
    pending,
    rejected,
    spam,
  };
};
