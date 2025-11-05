"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentStats } from "@/types/comments";

interface CommentsStatsProps {
  stats: CommentStats;
}

export function CommentsStats({ stats }: CommentsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <i className="ri-chat-3-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All comments</p>
        </CardContent>
      </Card>

      {/* Pending Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <i className="ri-time-line text-sm text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700 dark:text-yellow-400">
              Needs review
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Approved Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <i className="ri-checkbox-circle-line text-sm text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approved}</div>
          <p className="text-xs text-muted-foreground">Published</p>
        </CardContent>
      </Card>

      {/* Spam Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spam</CardTitle>
          <i className="ri-spam-line text-sm text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.spam}</div>
          <p className="text-xs text-muted-foreground">Flagged as spam</p>
        </CardContent>
      </Card>

      {/* Trash Comments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trash</CardTitle>
          <i className="ri-delete-bin-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.trash}</div>
          <p className="text-xs text-muted-foreground">Deleted</p>
        </CardContent>
      </Card>
    </div>
  );
}

