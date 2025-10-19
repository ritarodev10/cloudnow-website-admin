"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { StatCard } from "@/components/dashboard/stat-card";
import { VisitorTable } from "@/components/dashboard/visitor-table";
import { TrafficSources } from "@/components/dashboard/traffic-sources";
import { AdminWorkHours } from "@/components/dashboard/admin-work-hours";
import { VisitorChart } from "@/components/dashboard/visitor-chart";

import {
  dashboardStats,
  recentActivities,
  latestVisitors,
  trafficSources,
} from "@/data/dashboard-data";

export default function DashboardPage() {
  return (
    <PageTitle
      title="Dashboard Overview"
      description="Welcome to your CloudNow admin dashboard. Here's what's happening with your website."
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="lg:col-span-1">
              <StatCard
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                iconColor={stat.iconColor}
                change={stat.change}
              />
            </div>
          ))}
          <div className="md:col-span-2 lg:col-span-2">
            <AdminWorkHours />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2 lg:col-span-4">
            <VisitorChart />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <Card className="h-full">
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
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </PageTitle>
  );
}
