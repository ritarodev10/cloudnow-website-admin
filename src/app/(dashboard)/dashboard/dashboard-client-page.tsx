"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostStats } from "@/types/posts";
import { Activity } from "@/types/activity";
import { AnalyticsOverview, Visitor } from "@/types/analytics";
import { OverviewMetrics } from "../(insight-and-operation)/analytics/_components/overview-metrics";
import { TimeSeriesChart } from "../(insight-and-operation)/analytics/_components/time-series-chart";
import { VisitorsList } from "./_components/visitors-list";

// Dummy data generators
function generateDummyPostStats(): PostStats {
  return {
    total: 124,
    published: 89,
    drafts: 23,
    scheduled: 8,
    archived: 4,
    totalViews: 45230,
    averageViews: 508,
  };
}

function generateDummyActivities(): Activity[] {
  const activities: Activity[] = [
    {
      id: "1",
      type: "post_created",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      description:
        "Created a new post: 'Getting Started with Cloud Infrastructure'",
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: "2",
      type: "post_published",
      userId: "user-2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      description: "Published post: 'Best Practices for DevOps'",
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: "3",
      type: "testimonial_created",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      description: "Added a new testimonial from Acme Corp",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: "4",
      type: "post_updated",
      userId: "user-3",
      userName: "Bob Johnson",
      userEmail: "bob@example.com",
      description: "Updated post: 'Cloud Migration Guide'",
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
    {
      id: "5",
      type: "faq_created",
      userId: "user-2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      description: "Created a new FAQ: 'How do I get started?'",
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "6",
      type: "post_published",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      description: "Published post: 'Understanding Microservices Architecture'",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "7",
      type: "user_logged_in",
      userId: "user-4",
      userName: "Alice Williams",
      userEmail: "alice@example.com",
      description: "Logged in to the admin dashboard",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: "8",
      type: "settings_updated",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      description: "Updated website settings",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  ];

  return activities;
}

function generateDummyAnalytics(): AnalyticsOverview {
  const now = Date.now();
  const timeSeries: Array<{
    timestamp: string;
    visitors: number;
    views: number;
  }> = [];

  // Generate last 7 days of data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    timeSeries.push({
      timestamp: date.toISOString(),
      visitors: Math.floor(Math.random() * 500) + 200,
      views: Math.floor(Math.random() * 2000) + 800,
    });
  }

  return {
    visitors: {
      value: 3420,
      change: 12.5,
    },
    visits: {
      value: 4850,
      change: 8.3,
    },
    views: {
      value: 12450,
      change: 15.2,
    },
    bounceRate: {
      value: 32.5,
      change: -5.2,
    },
    visitDuration: {
      value: 245, // seconds
      change: 8.7,
    },
    timeSeries,
  };
}

function generateDummyVisitors(): Visitor[] {
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Brazil",
    "India",
    "Mexico",
  ];
  const cities = {
    "United States": [
      "New York",
      "Los Angeles",
      "Chicago",
      "San Francisco",
      "Seattle",
    ],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Edinburgh",
      "Liverpool",
    ],
    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    France: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo"],
    Brazil: [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador",
      "Fortaleza",
    ],
    India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
    Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
  };
  const operatingSystems = ["Windows", "macOS", "Linux", "iOS", "Android"];
  const pages = ["/", "/about", "/services", "/blog", "/contact", "/careers"];

  const visitors: Visitor[] = [];
  const now = Date.now();

  for (let i = 0; i < 10; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const countryCities = cities[country as keyof typeof cities] || ["Unknown"];
    const city =
      countryCities[Math.floor(Math.random() * countryCities.length)];
    const os =
      operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];

    visitors.push({
      id: `visitor-${i + 1}`,
      timestamp: new Date(now - i * 3 * 60 * 1000 - Math.random() * 60 * 1000), // Last 30 minutes, spaced out
      country,
      city,
      os,
      page,
    });
  }

  return visitors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function getActivityIcon(type: Activity["type"]): string {
  const iconMap: Record<Activity["type"], string> = {
    post_created: "ri-file-add-line",
    post_updated: "ri-file-edit-line",
    post_published: "ri-send-plane-line",
    post_deleted: "ri-delete-bin-line",
    user_logged_in: "ri-login-box-line",
    user_logged_out: "ri-logout-box-line",
    testimonial_created: "ri-star-line",
    testimonial_updated: "ri-star-fill",
    faq_created: "ri-question-line",
    faq_updated: "ri-question-answer-line",
    settings_updated: "ri-settings-3-line",
  };
  return iconMap[type] || "ri-notification-line";
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}

interface DashboardClientPageProps {
  initialPostStats?: PostStats;
  initialActivities?: Activity[];
  initialAnalytics?: AnalyticsOverview;
  initialVisitors?: Visitor[];
}

export function DashboardClientPage({
  initialPostStats,
  initialActivities,
  initialAnalytics,
  initialVisitors,
}: DashboardClientPageProps) {
  const postStats = initialPostStats || generateDummyPostStats();
  const activities = initialActivities || generateDummyActivities();
  const analytics = initialAnalytics || generateDummyAnalytics();
  const visitors = initialVisitors || generateDummyVisitors();

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

      {/* Web Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Web Analytics
        </h2>
        <div className="space-y-4">
          <OverviewMetrics overview={analytics} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            <div className="lg:col-span-3">
              <TimeSeriesChart data={analytics.timeSeries} timeRange="7d" />
            </div>
            <div className="lg:col-span-2">
              <VisitorsList visitors={visitors} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-2 pb-2 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {[
                    { path: "/", views: 12450, change: 15.2 },
                    { path: "/services", views: 8920, change: 8.5 },
                    { path: "/about", views: 6540, change: -3.2 },
                    { path: "/blog", views: 5230, change: 22.1 },
                    { path: "/contact", views: 4120, change: 5.8 },
                  ].map((page, index) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between gap-2 pb-2 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900 truncate">
                            {page.path}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-600">
                            {page.views.toLocaleString()} views
                          </span>
                          <span
                            className={`text-xs ${
                              page.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {page.change > 0 ? "↑" : "↓"}{" "}
                            {Math.abs(page.change)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
