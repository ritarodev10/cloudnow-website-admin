import { FileText, Users } from "lucide-react";
import { ActivityItem } from "@/types/dashboard";

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
