import { BlogStats } from "@/types/blog";

interface BlogStatsCardProps {
  stats: BlogStats;
}

export function BlogStatsCard({ stats }: BlogStatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">Total Posts</div>
        <div className="text-2xl font-bold">{stats.totalPosts}</div>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">Published</div>
        <div className="text-2xl font-bold">{stats.publishedPosts}</div>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">Drafts</div>
        <div className="text-2xl font-bold">{stats.draftPosts}</div>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">Total Views</div>
        <div className="text-2xl font-bold">
          {stats.totalViews.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
