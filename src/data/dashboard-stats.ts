import { FileText, Users, Activity } from "lucide-react";
import { DashboardStat } from "@/types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Blog Posts",
    value: "24",
    description: "+2 added this month",
    icon: FileText,
  },
  {
    title: "Form Submissions",
    value: "18",
    description: "5 new unread",
    icon: FileText,
  },
  {
    title: "Job Applications",
    value: "7",
    description: "3 new this week",
    icon: Users,
  },
  {
    title: "Visitors Today",
    value: "342",
    description: "+18% from yesterday",
    icon: Activity,
  },
];
