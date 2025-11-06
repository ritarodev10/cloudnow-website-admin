"use client";

import { useState } from "react";
import { PostStats } from "@/types/posts";
import { Activity } from "@/types/activity";
import { AnalyticsOverview, TimeRange } from "@/types/analytics";
import { usePostStats } from "../(content)/blog/posts/_hooks/queries/use-post-stats";
import { useAnalyticsOverview } from "../(insight-and-operation)/analytics/_hooks/queries/use-analytics-overview";
import { useAnalyticsSessions } from "../(insight-and-operation)/analytics/_hooks/queries/use-analytics-sessions";
import { PostStatistics } from "./_components/post-statistics";
import { WebAnalytics } from "./_components/web-analytics";
import { RecentActivity } from "./_components/recent-activity";
import {
  generateDummyActivities,
  transformSessionsToVisitors,
} from "./_components/utils";

interface DashboardClientPageProps {
  initialPostStats?: PostStats;
  initialActivities?: Activity[];
  initialAnalytics?: AnalyticsOverview;
}

export function DashboardClientPage({
  initialPostStats,
  initialActivities,
  initialAnalytics,
}: DashboardClientPageProps) {
  // State for time range selection
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  // Fetch post stats from API
  const {
    data: postStats = initialPostStats || {
      total: 0,
      published: 0,
      drafts: 0,
      scheduled: 0,
      archived: 0,
      totalViews: 0,
      averageViews: 0,
    },
    isLoading: isLoadingPostStats,
  } = usePostStats({ initialData: initialPostStats });

  // Fetch analytics overview with dynamic time range
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
  } = useAnalyticsOverview(
    { range: timeRange },
    { initialData: initialAnalytics }
  );

  // Fetch sessions data for recent visitors
  const { data: sessionsData, isLoading: isLoadingSessions } =
    useAnalyticsSessions({
      range: timeRange,
      page: 1,
      pageSize: 10,
    });

  // Keep activities as dummy for now (no activity API available)
  const activities = initialActivities || generateDummyActivities();

  // Transform sessions to visitors format
  const visitors = sessionsData?.data
    ? transformSessionsToVisitors(sessionsData.data)
    : [];

  const handlePrevious = () => {
    // TODO: Implement previous period navigation
    console.log("Previous period");
  };

  const handleNext = () => {
    // TODO: Implement next period navigation
    console.log("Next period");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your content, analytics, and recent activity
        </p>
      </div>

      {/* Post Statistics */}
      <PostStatistics postStats={postStats} />

      {/* Web Analytics */}
      <WebAnalytics
        analytics={analytics}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        visitors={visitors}
        isLoadingSessions={isLoadingSessions}
        isLoadingAnalytics={isLoadingAnalytics}
        error={analyticsError}
      />

      {/* Recent Activity */}
      <RecentActivity activities={activities} />
    </div>
  );
}
