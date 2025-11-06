"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostStats } from "@/types/posts";
import { Activity } from "@/types/activity";
import {
  AnalyticsOverview,
  TimeRange,
  Visitor,
  Session,
} from "@/types/analytics";
import { OverviewMetrics } from "../(insight-and-operation)/analytics/_components/overview-metrics";
import { TimeSeriesChart } from "../(insight-and-operation)/analytics/_components/time-series-chart";
import { TimeRangeSelector } from "../(insight-and-operation)/analytics/_components/time-range-selector";
import { usePostStats } from "../(content)/blog/posts/_hooks/queries/use-post-stats";
import { useAnalyticsOverview } from "../(insight-and-operation)/analytics/_hooks/queries/use-analytics-overview";
import { useAnalyticsSessions } from "../(insight-and-operation)/analytics/_hooks/queries/use-analytics-sessions";

// Dummy activities generator (keeping for now since there's no activity API)
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

// Country code to name mapping
const countryCodeToName: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  AU: "Australia",
  JP: "Japan",
  BR: "Brazil",
  IN: "India",
  MX: "Mexico",
  CN: "China",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  KR: "South Korea",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  RU: "Russia",
  TR: "Turkey",
  ZA: "South Africa",
  AR: "Argentina",
  CL: "Chile",
  NZ: "New Zealand",
  SG: "Singapore",
  TH: "Thailand",
  PH: "Philippines",
  ID: "Indonesia",
  MY: "Malaysia",
  VN: "Vietnam",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  IL: "Israel",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  PT: "Portugal",
  GR: "Greece",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  IE: "Ireland",
  CZ: "Czech Republic",
  RO: "Romania",
  HU: "Hungary",
  UA: "Ukraine",
  CO: "Colombia",
  PE: "Peru",
  VE: "Venezuela",
  EC: "Ecuador",
};

function getCountryFlag(country: string): string {
  // Handle both country codes (e.g., "US") and full names (e.g., "United States")
  const countryCode =
    country.length === 2
      ? country.toUpperCase()
      : countryCodeToName[country] || country;
  const countryName = countryCodeToName[countryCode] || country;

  const countryFlags: Record<string, string> = {
    "United States": "🇺🇸",
    Canada: "🇨🇦",
    "United Kingdom": "🇬🇧",
    Germany: "🇩🇪",
    France: "🇫🇷",
    Australia: "🇦🇺",
    Japan: "🇯🇵",
    Brazil: "🇧🇷",
    India: "🇮🇳",
    Mexico: "🇲🇽",
    China: "🇨🇳",
    Spain: "🇪🇸",
    Italy: "🇮🇹",
    Netherlands: "🇳🇱",
    "South Korea": "🇰🇷",
    Sweden: "🇸🇪",
    Norway: "🇳🇴",
    Denmark: "🇩🇰",
    Finland: "🇫🇮",
    Poland: "🇵🇱",
    Russia: "🇷🇺",
    Turkey: "🇹🇷",
    "South Africa": "🇿🇦",
    Argentina: "🇦🇷",
    Chile: "🇨🇱",
    "New Zealand": "🇳🇿",
    Singapore: "🇸🇬",
    Thailand: "🇹🇭",
    Philippines: "🇵🇭",
    Indonesia: "🇮🇩",
    Malaysia: "🇲🇾",
    Vietnam: "🇻🇳",
    "Saudi Arabia": "🇸🇦",
    "United Arab Emirates": "🇦🇪",
    Israel: "🇮🇱",
    Egypt: "🇪🇬",
    Nigeria: "🇳🇬",
    Kenya: "🇰🇪",
    Ghana: "🇬🇭",
    Portugal: "🇵🇹",
    Greece: "🇬🇷",
    Belgium: "🇧🇪",
    Switzerland: "🇨🇭",
    Austria: "🇦🇹",
    Ireland: "🇮🇪",
    "Czech Republic": "🇨🇿",
    Romania: "🇷🇴",
    Hungary: "🇭🇺",
    Ukraine: "🇺🇦",
    Colombia: "🇨🇴",
    Peru: "🇵🇪",
    Venezuela: "🇻🇪",
    Ecuador: "🇪🇨",
  };
  return countryFlags[countryName] || "🌍";
}

// Convert country code to full name
function getCountryName(country: string): string {
  if (country.length === 2) {
    return countryCodeToName[country.toUpperCase()] || country;
  }
  return country;
}

// Transform sessions to visitors format
function transformSessionsToVisitors(sessions: Session[]): Visitor[] {
  return sessions
    .map((session) => ({
      id: session.id,
      timestamp: new Date(session.lastAt),
      country: getCountryName(session.country),
      city: session.city || "Unknown",
      os: session.os || "Unknown",
      browser: session.browser || "Unknown",
      device: session.device || "Unknown",
      page: session.hostname?.[0] || "/",
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10); // Limit to 10 most recent
}

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
    data: analytics = initialAnalytics || {
      visitors: { value: 0, change: 0 },
      visits: { value: 0, change: 0 },
      views: { value: 0, change: 0 },
      bounceRate: { value: 0, change: 0 },
      visitDuration: { value: 0, change: 0 },
      timeSeries: [],
    },
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Web Analytics</h2>
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        {analyticsError ? (
          <div className="text-center text-red-600 py-4">
            Error loading analytics data: {analyticsError.message}
          </div>
        ) : isLoadingAnalytics ? (
          <div className="text-center text-muted-foreground py-4">
            Loading analytics...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <OverviewMetrics overview={analytics} />

            {/* Time Series Chart and Recent Visitors - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
              <div className="lg:col-span-3">
                <TimeSeriesChart
                  data={analytics.timeSeries}
                  timeRange={timeRange}
                />
              </div>
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Recent Visitors</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {isLoadingSessions ? (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Loading visitors...
                      </div>
                    ) : visitors.length === 0 ? (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No visitors data available
                      </div>
                    ) : (
                      <div className="space-y-2 flex-1">
                        {visitors.map((visitor) => (
                          <div
                            key={visitor.id}
                            className="flex items-center gap-2 pb-2 border-b last:border-0 last:pb-0"
                          >
                            <div className="shrink-0 text-xl">
                              {getCountryFlag(visitor.country)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap text-sm">
                                <span className="font-medium text-gray-900">
                                  {visitor.city}, {visitor.country}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">
                                  {visitor.os}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">
                                  {formatTimeAgo(visitor.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
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
    </div>
  );
}
