"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CategoryStats } from "@/types/categories";

interface CategoriesStatsProps {
  stats: CategoryStats;
}

export function CategoriesStats({ stats }: CategoriesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Categories
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <i className="ri-folder-line text-2xl text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
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
                Inactive
              </p>
              <p className="text-2xl font-bold text-muted-foreground">
                {stats.inactive}
              </p>
            </div>
            <div className="rounded-full bg-muted p-3">
              <i className="ri-close-circle-line text-2xl text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <i className="ri-article-line text-2xl text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



