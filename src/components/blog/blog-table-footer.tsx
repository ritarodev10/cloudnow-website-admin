import { TagIcon } from "lucide-react";

interface BlogTableFooterProps {
  filteredCount: number;
  totalCount: number;
}

export function BlogTableFooter({
  filteredCount,
  totalCount,
}: BlogTableFooterProps) {
  return (
    <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
      <div>
        Showing {filteredCount} of {totalCount} posts
      </div>
      <div className="flex items-center gap-1">
        <TagIcon className="size-3" />
        <span>Categories: All</span>
      </div>
    </div>
  );
}
