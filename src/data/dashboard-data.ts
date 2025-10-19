import { FileText, Users, Activity, Mail } from "lucide-react";
import {
  DashboardStat,
  ActivityItem,
  Visitor,
  TrafficSource,
  SubmissionItem,
} from "@/types/dashboard";

/**
 * Dashboard Statistics Cards Data
 * Contains the main KPI cards displayed at the top of the dashboard
 */
export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Blog Posts",
    value: "24",
    description: "+2 added this month",
    icon: FileText,
    iconColor: "orange",
    change: {
      value: "8.3%",
      trend: "up" as const,
    },
  },
  {
    title: "Form Submissions",
    value: "18",
    description: "5 new unread",
    icon: Mail,
    iconColor: "teal",
    change: {
      value: "12.5%",
      trend: "down" as const,
    },
  },
  {
    title: "Job Applications",
    value: "7",
    description: "3 new this week",
    icon: Users,
    iconColor: "blue",
    change: {
      value: "42.9%",
      trend: "up" as const,
    },
  },
  {
    title: "Visitors Today",
    value: "342",
    description: "+18% from yesterday",
    icon: Activity,
    iconColor: "yellow",
    change: {
      value: "18%",
      trend: "up" as const,
    },
  },
];

/**
 * Recent Activities Data
 * Shows the latest activities happening on the website
 */
export const recentActivities: ActivityItem[] = [
  {
    icon: FileText,
    title: "New blog post published",
    time: "2 hours ago",
  },
  {
    icon: FileText,
    title: "New contact form submission",
    time: "5 hours ago",
  },
  {
    icon: Users,
    title: "New job application received",
    time: "Yesterday",
  },
  {
    icon: FileText,
    title: "Media library updated",
    time: "2 days ago",
  },
];

/**
 * Latest Visitors Data
 * Shows recent website visitors with their details
 */
export const latestVisitors: Visitor[] = [
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

/**
 * Traffic Sources Data
 * Shows where website traffic is coming from
 */
export const trafficSources: TrafficSource[] = [
  { name: "Direct", percentage: 45, change: "+5%" },
  { name: "Organic Search", percentage: 30, change: "+2%" },
  { name: "Social Media", percentage: 15, change: "+8%" },
  { name: "Referral", percentage: 10, change: "-2%" },
];

/**
 * Latest Submissions Data
 * Shows recent form submissions and job applications
 */
export const latestSubmissions: SubmissionItem[] = [
  {
    name: "John Smith",
    type: "Contact Form - Service Inquiry",
    time: "Today, 10:30 AM",
  },
  {
    name: "Sarah Johnson",
    type: "Contact Form - Quote Request",
    time: "Today, 9:15 AM",
  },
  {
    name: "Michael Brown",
    type: "Job Application - Developer",
    time: "Yesterday, 4:45 PM",
  },
  {
    name: "Emily Davis",
    type: "Contact Form - Support",
    time: "Yesterday, 2:20 PM",
  },
  {
    name: "Robert Wilson",
    type: "Job Application - Designer",
    time: "2 days ago",
  },
];

/**
 * Visitor Chart Data
 * Contains visitor data separated by device type (desktop/mobile) for different time ranges
 */
export const visitorChartData = {
  "3months": {
    title: "Total Visitors",
    subtitle: "Total for the last 3 months",
    data: [
      { date: "Apr 3", desktop: 85, mobile: 35 },
      { date: "Apr 10", desktop: 92, mobile: 28 },
      { date: "Apr 17", desktop: 105, mobile: 42 },
      { date: "Apr 24", desktop: 88, mobile: 31 },
      { date: "May 1", desktop: 115, mobile: 38 },
      { date: "May 8", desktop: 128, mobile: 45 },
      { date: "May 15", desktop: 142, mobile: 52 },
      { date: "May 23", desktop: 135, mobile: 48 },
      { date: "May 31", desktop: 158, mobile: 55 },
      { date: "Jun 7", desktop: 165, mobile: 62 },
      { date: "Jun 14", desktop: 178, mobile: 68 },
      { date: "Jun 21", desktop: 172, mobile: 65 },
      { date: "Jun 30", desktop: 185, mobile: 72 },
    ],
  },
  "30days": {
    title: "Total Visitors",
    subtitle: "Total for the last 30 days",
    data: [
      { date: "Jun 1", desktop: 145, mobile: 58 },
      { date: "Jun 5", desktop: 152, mobile: 61 },
      { date: "Jun 10", desktop: 168, mobile: 67 },
      { date: "Jun 15", desktop: 175, mobile: 72 },
      { date: "Jun 20", desktop: 162, mobile: 69 },
      { date: "Jun 25", desktop: 178, mobile: 75 },
      { date: "Jun 30", desktop: 185, mobile: 72 },
    ],
  },
  "7days": {
    title: "Total Visitors",
    subtitle: "Total for the last 7 days",
    data: [
      { date: "Jun 24", desktop: 168, mobile: 68 },
      { date: "Jun 25", desktop: 175, mobile: 72 },
      { date: "Jun 26", desktop: 182, mobile: 75 },
      { date: "Jun 27", desktop: 178, mobile: 73 },
      { date: "Jun 28", desktop: 185, mobile: 78 },
      { date: "Jun 29", desktop: 172, mobile: 71 },
      { date: "Jun 30", desktop: 185, mobile: 72 },
    ],
  },
};

/**
 * Admin Work Hours Data
 * Contains work hours data for different time periods
 */
export const adminWorkHoursData = {
  week: {
    value: "42.4h",
    change: "+9.2%",
    period: "Weekly hours",
  },
  month: {
    value: "168.2h",
    change: "+12.1%",
    period: "Monthly hours",
  },
};
