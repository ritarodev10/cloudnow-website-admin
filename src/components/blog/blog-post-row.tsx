import { CalendarIcon, EyeIcon } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostRowProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
}

export function BlogPostRow({ post, onEdit, onDelete }: BlogPostRowProps) {
  return (
    <tr>
      <td className="font-medium">{post.title}</td>
      <td>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            post.status === "Published"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          }`}
        >
          {post.status}
        </span>
      </td>
      <td>{post.category}</td>
      <td className="hidden md:table-cell">{post.author}</td>
      <td className="hidden md:table-cell">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="size-3" />
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {post.status === "Published" ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <EyeIcon className="size-3" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit?.(post)}
            className="inline-flex items-center justify-center size-8 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="sr-only">Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(post)}
            className="inline-flex items-center justify-center size-8 rounded-md hover:bg-accent hover:text-accent-foreground text-red-500 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
