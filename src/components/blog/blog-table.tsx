import { BlogPost } from "@/types/blog";
import { BlogPostRow } from "./blog-post-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlogTableProps {
  posts: BlogPost[];
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete }: BlogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="hidden md:table-cell">Author</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden md:table-cell">Views</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <BlogPostRow
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {posts.length === 0 && (
          <TableRow>
            <td colSpan={7} className="h-24 text-center">
              No blog posts found.
            </td>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
