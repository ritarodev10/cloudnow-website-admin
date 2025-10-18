import { CalendarIcon, EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BlogPostRowProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
}

export function BlogPostRow({ post, onEdit, onDelete }: BlogPostRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{post.title}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            post.status === "Published"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
          }`}
        >
          {post.status}
        </span>
      </TableCell>
      <TableCell>{post.category}</TableCell>
      <TableCell className="hidden md:table-cell">{post.author}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="size-3" />
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {post.status === "Published" ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <EyeIcon className="size-3" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit?.(post)}
          >
            <EditIcon className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:text-red-600"
            onClick={() => onDelete?.(post)}
          >
            <TrashIcon className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
