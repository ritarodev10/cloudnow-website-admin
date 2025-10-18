import { BlogPost } from "@/types/blog";
import { BlogPostRow } from "./blog-post-row";

interface BlogTableProps {
  posts: BlogPost[];
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete }: BlogTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium">Title</th>
            <th className="pb-2 text-left font-medium">Status</th>
            <th className="pb-2 text-left font-medium">Category</th>
            <th className="pb-2 text-left font-medium hidden md:table-cell">
              Author
            </th>
            <th className="pb-2 text-left font-medium hidden md:table-cell">
              Date
            </th>
            <th className="pb-2 text-left font-medium hidden md:table-cell">
              Views
            </th>
            <th className="pb-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <BlogPostRow
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {posts.length === 0 && (
            <tr>
              <td colSpan={7} className="h-24 text-center">
                No blog posts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
