"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostStats } from "@/types/posts";

interface PostStatisticsProps {
  postStats: PostStats;
}

export function PostStatistics({ postStats }: PostStatisticsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Post Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <i className="ri-file-list-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <i className="ri-checkbox-circle-line text-sm text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {postStats.published}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <i className="ri-draft-line text-sm text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {postStats.drafts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <i className="ri-calendar-line text-sm text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {postStats.scheduled}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <i className="ri-eye-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {postStats.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
            <i className="ri-bar-chart-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postStats.averageViews}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

