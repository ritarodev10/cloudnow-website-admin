"use client";

import { FileText, Users, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Blog Posts"
          value="24"
          description="+2 added this month"
          icon={FileText}
        />
        <StatCard
          title="Form Submissions"
          value="18"
          description="5 new unread"
          icon={FileText}
        />
        <StatCard
          title="Job Applications"
          value="7"
          description="3 new this week"
          icon={Users}
        />
        <StatCard
          title="Visitors Today"
          value="342"
          description="+18% from yesterday"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityItem
              icon={FileText}
              title="New blog post published"
              time="2 hours ago"
            />
            <ActivityItem
              icon={FileText}
              title="New contact form submission"
              time="5 hours ago"
            />
            <ActivityItem
              icon={Users}
              title="New job application received"
              time="Yesterday"
            />
            <ActivityItem
              icon={FileText}
              title="Media library updated"
              time="2 days ago"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SubmissionItem
              name="John Smith"
              type="Contact Form - Service Inquiry"
              time="Today, 10:30 AM"
            />
            <SubmissionItem
              name="Sarah Johnson"
              type="Contact Form - Quote Request"
              time="Today, 9:15 AM"
            />
            <SubmissionItem
              name="Michael Brown"
              type="Job Application - Developer"
              time="Yesterday, 4:45 PM"
            />
            <SubmissionItem
              name="Emily Davis"
              type="Contact Form - Support"
              time="Yesterday, 2:20 PM"
            />
            <SubmissionItem
              name="Robert Wilson"
              type="Job Application - Designer"
              time="2 days ago"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSources />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard Components

function SubmissionItem({
  name,
  type,
  time,
}: {
  name: string;
  type: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{type}</p>
      </div>
      <div className="text-sm text-muted-foreground">{time}</div>
    </div>
  );
}

function VisitorTable() {
  const visitors = [
    {
      ip: "192.168.1.1",
      location: "New York, USA",
      page: "/services/web-development",
      duration: "1:24",
      device: "Chrome",
      time: "2 minutes ago",
    },
    {
      ip: "192.168.1.2",
      location: "London, UK",
      page: "/blog/top-10-web-design-trends",
      duration: "3:42",
      device: "Safari",
      time: "5 minutes ago",
    },
    {
      ip: "192.168.1.3",
      location: "Toronto, Canada",
      page: "/contact",
      duration: "0:56",
      device: "Firefox",
      time: "12 minutes ago",
    },
    {
      ip: "192.168.1.4",
      location: "Sydney, Australia",
      page: "/about",
      duration: "2:15",
      device: "Chrome",
      time: "18 minutes ago",
    },
    {
      ip: "192.168.1.5",
      location: "Berlin, Germany",
      page: "/services/seo",
      duration: "4:10",
      device: "Edge",
      time: "24 minutes ago",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium">Visitor</th>
            <th className="pb-2 text-left font-medium">Page</th>
            <th className="pb-2 text-right font-medium">Device</th>
            <th className="pb-2 text-right font-medium">Duration</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{visitor.ip}</div>
                    <div className="text-xs text-muted-foreground">
                      {visitor.location}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3">{visitor.page}</td>
              <td className="py-3 text-right">{visitor.device}</td>
              <td className="py-3 text-right">{visitor.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrafficSources() {
  const sources = [
    { name: "Direct", percentage: 45, change: "+5%" },
    { name: "Organic Search", percentage: 30, change: "+2%" },
    { name: "Social Media", percentage: 15, change: "+8%" },
    { name: "Referral", percentage: 10, change: "-2%" },
  ];

  return (
    <div className="space-y-4">
      {sources.map((source, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium">{source.name}</div>
            <div className="flex items-center gap-2">
              <span>{source.percentage}%</span>
              <span
                className={
                  source.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {source.change}
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${source.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
