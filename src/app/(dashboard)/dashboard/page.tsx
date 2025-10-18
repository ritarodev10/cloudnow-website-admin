"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { StatCard } from "@/components/dashboard/stat-card";
import { SubmissionItem } from "@/components/dashboard/submission-item";
import { VisitorTable } from "@/components/dashboard/visitor-table";
import { TrafficSources } from "@/components/dashboard/traffic-sources";

import { dashboardStats } from "@/data/dashboard-stats";
import { recentActivities } from "@/data/dashboard-activities";
import { latestSubmissions } from "@/data/dashboard-submissions";
import { latestVisitors } from "@/data/dashboard-visitors";
import { trafficSources } from "@/data/dashboard-traffic";

export default function DashboardPage() {
  return (
    <PageTitle
      title="Dashboard Overview"
      description="Welcome to your CloudNow admin dashboard. Here's what's happening with your website."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                title={activity.title}
                time={activity.time}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestSubmissions.map((submission, index) => (
              <SubmissionItem key={index} submission={submission} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorTable visitors={latestVisitors} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSources sources={trafficSources} />
          </CardContent>
        </Card>
      </div>
    </PageTitle>
  );
}
