import { CommentsClientPage } from "./comments-client-page";
import { Comment, CommentStats } from "@/types/comments";
import { Post } from "@/types/posts";
import { getPosts } from "@/lib/posts/queries";

// Force dynamic rendering to avoid build-time static generation
export const dynamic = "force-dynamic";

// Mock data - will be replaced with actual API calls when database table is ready
async function getComments(): Promise<Comment[]> {
  return [
    {
      id: "1",
      postId: "post-1",
      postTitle: "Getting Started with Cloud Infrastructure",
      authorName: "John Doe",
      authorEmail: "john@example.com",
      authorUrl: "https://example.com",
      content: "Great article! Very informative and well-written.",
      status: "pending",
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      postId: "post-1",
      postTitle: "Getting Started with Cloud Infrastructure",
      authorName: "Jane Smith",
      authorEmail: "jane@example.com",
      content: "Thanks for sharing this. I found it very helpful.",
      status: "approved",
      createdAt: new Date("2024-01-14T14:20:00"),
      updatedAt: new Date("2024-01-14T14:20:00"),
    },
    {
      id: "3",
      postId: "post-2",
      postTitle: "Introduction to Kubernetes",
      authorName: "Spam Bot",
      authorEmail: "spam@spam.com",
      content: "Check out this amazing deal! Click here now!",
      status: "spam",
      createdAt: new Date("2024-01-13T08:15:00"),
      updatedAt: new Date("2024-01-13T08:15:00"),
    },
  ];
}

async function getCommentStats(): Promise<CommentStats> {
  const comments = await getComments();
  return {
    total: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    spam: comments.filter((c) => c.status === "spam").length,
    trash: comments.filter((c) => c.status === "trash").length,
  };
}

export default async function CommentsPage() {
  // Fetch data - using mock data until database table is ready
  const [comments, posts, stats] = await Promise.all([
    getComments(),
    getPosts(),
    getCommentStats(),
  ]);

  return (
    <CommentsClientPage
      initialComments={comments}
      initialPosts={posts}
      initialStats={stats}
    />
  );
}
