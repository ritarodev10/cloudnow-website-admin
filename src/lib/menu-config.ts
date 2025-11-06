export interface Badge {
  text: string | number;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export interface MenuSubItem {
  label: string;
  href: string;
  tabs?: string[];
  badge?: Badge;
  comingSoon?: boolean;
}

export interface MenuItem {
  label: string;
  icon: string; // RemixIcon class name
  href?: string; // If no href, it's a category header
  submenu?: MenuSubItem[];
  tabs?: string[];
  badge?: Badge;
  comingSoon?: boolean;
}

export interface MenuCategory {
  label: string;
  items: MenuItem[];
  comingSoon?: boolean;
}

export const menuConfig: MenuCategory[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: "ri-dashboard-line",
        href: "/dashboard",
        tabs: ["Overview", "Activity", "Shortcuts"],
        badge: { text: "New", variant: "info" },
      },
    ],
  },
  {
    label: "Web Analytics",
    items: [
      {
        label: "Traffic",
        icon: "ri-bar-chart-line",
        href: "/analytics",
        tabs: ["Overview", "Realtime", "Session"],
      },
      {
        label: "Behaviour",
        icon: "ri-user-heart-line",
        href: "/behaviour",
        badge: { text: "Soon", variant: "info" },
        comingSoon: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Pages",
        icon: "ri-file-list-line",
        submenu: [
          {
            label: "All Pages",
            href: "/pages",
            tabs: ["Table", "Builder", "SEO", "Activity"],
            badge: { text: 24, variant: "info" },
          },
          {
            label: "Groups",
            href: "/pages/groups",
            badge: { text: 5, variant: "default" },
          },
          {
            label: "Templates & Blocks",
            href: "/pages/templates",
          },
        ],
      },
      {
        label: "Blog",
        icon: "ri-article-line",
        submenu: [
          {
            label: "New Post",
            href: "/blog/new",
          },
          {
            label: "All Posts",
            href: "/blog/posts",
            tabs: ["Drafts", "Scheduled", "Published", "Archived"],
            badge: { text: 48, variant: "success" },
          },
          {
            label: "Categories",
            href: "/blog/categories",
            badge: { text: 12, variant: "default" },
          },
          {
            label: "Tags",
            href: "/blog/tags",
            badge: { text: 0, variant: "default" },
          },
          {
            label: "Comments",
            href: "/blog/comments",
            badge: { text: 3, variant: "danger" },
          },
        ],
      },
      {
        label: "Testimonials",
        icon: "ri-chat-quote-line",
        href: "/testimonial",
        badge: { text: 3, variant: "warning" },
      },
      {
        label: "FAQs",
        icon: "ri-question-line",
        href: "/faq",
        badge: { text: 12, variant: "success" },
      },
      {
        label: "Media Library",
        icon: "ri-image-line",
        href: "/media",
      },
    ],
  },
  {
    label: "Engagement",
    comingSoon: true,
    items: [
      {
        label: "Forms",
        icon: "ri-news-line",
        submenu: [
          {
            label: "Form Builder",
            href: "/forms/builder",
          },
          {
            label: "Submissions",
            href: "/forms/submissions",
            tabs: ["Inbox", "Spam", "Export", "Webhooks"],
            badge: { text: 18, variant: "warning" },
          },
        ],
      },
      {
        label: "Notifications",
        icon: "ri-notification-line",
        href: "/notifications",
        tabs: ["Banner", "In‑app", "Email Templates"],
        badge: { text: 5, variant: "danger" },
      },
    ],
  },
  {
    label: "People & Hiring",
    comingSoon: true,
    items: [
      {
        label: "Hiring Hub",
        icon: "ri-user-search-line",
        submenu: [
          {
            label: "Job Posts",
            href: "/hiring/jobs",
            badge: { text: 8, variant: "info" },
          },
          {
            label: "Applicants",
            href: "/hiring/applicants",
            badge: { text: 32, variant: "success" },
          },
          {
            label: "Pipeline / Stages",
            href: "/hiring/pipeline",
          },
          {
            label: "Templates",
            href: "/hiring/templates",
          },
          {
            label: "Hiring Analytics",
            href: "/hiring/analytics",
          },
        ],
      },
    ],
  },
  {
    label: "Site Management",
    comingSoon: true,
    items: [
      {
        label: "Redirects",
        icon: "ri-loop-left-line",
        href: "/redirects",
      },
      {
        label: "Sitemap",
        icon: "ri-map-line",
        href: "/sitemap",
      },
      {
        label: "Menus & Navigation",
        icon: "ri-menu-line",
        href: "/menus",
      },
    ],
  },
  {
    label: "Control Panel",
    comingSoon: true,
    items: [
      {
        label: "Users & Access",
        icon: "ri-user-line",
        href: "/users",
        tabs: ["Users", "Access Profiles", "Departments", "Invitations"],
      },
      {
        label: "Audit Log",
        icon: "ri-file-list-3-line",
        href: "/audit",
        badge: { text: "Beta", variant: "default" },
      },
      {
        label: "Integrations",
        icon: "ri-plug-line",
        comingSoon: true,
        submenu: [
          {
            label: "Email",
            href: "/integrations/email",
          },
          {
            label: "Database & Storage",
            href: "/integrations/database-storage",
          },
          {
            label: "AI",
            href: "/integrations/ai",
          },
        ],
      },
      {
        label: "Settings",
        icon: "ri-settings-line",
        href: "/settings",
        tabs: [
          "Branding",
          "Domain & Canonical",
          "Localization",
          "Legal Pages",
          "Content Defaults",
          "Public API Keys",
        ],
      },
    ],
  },
];
