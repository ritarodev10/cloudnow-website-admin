import { Visitor } from "@/types/dashboard";

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
