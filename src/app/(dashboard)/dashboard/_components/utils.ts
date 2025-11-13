import { Activity } from "@/types/activity";
import { Session, Visitor } from "@/types/analytics";

// Country code to name mapping
export const countryCodeToName: Record<string, string> = {
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

export function formatTimeAgo(date: Date): string {
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

export function getActivityIcon(type: Activity["type"]): string {
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

export function getCountryFlag(country: string): string {
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
export function getCountryName(country: string): string {
  if (country.length === 2) {
    return countryCodeToName[country.toUpperCase()] || country;
  }
  return country;
}

// Transform sessions to visitors format
export function transformSessionsToVisitors(sessions: Session[]): Visitor[] {
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

// Dummy activities generator (keeping for now since there's no activity API)
export function generateDummyActivities(): Activity[] {
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

