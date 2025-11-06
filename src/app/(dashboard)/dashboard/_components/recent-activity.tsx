"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/activity";
import { formatTimeAgo, getActivityIcon } from "./utils";

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Activity
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 pb-2 border-b last:border-0 last:pb-0"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <i
                    className={`${getActivityIcon(
                      activity.type
                    )} text-gray-600 text-sm`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-medium text-gray-900">
                      {activity.userName}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

