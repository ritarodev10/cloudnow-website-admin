"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PostStats } from "@/types/posts";

interface PostsStatsProps {
  stats: PostStats;
}

export function PostsStats({ stats }: PostsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <i className="ri-article-line text-2xl text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.published}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <i className="ri-checkbox-circle-line text-2xl text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Drafts
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.drafts}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <i className="ri-draft-line text-2xl text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Scheduled
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.scheduled}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <i className="ri-calendar-line text-2xl text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Archived
              </p>
              <p className="text-2xl font-bold text-muted-foreground">
                {stats.archived}
              </p>
            </div>
            <div className="rounded-full bg-muted p-3">
              <i className="ri-archive-line text-2xl text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <i className="ri-eye-line text-2xl text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Views
              </p>
              <p className="text-2xl font-bold">{stats.averageViews.toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/20">
              <i className="ri-bar-chart-line text-2xl text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

