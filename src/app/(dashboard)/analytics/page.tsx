import { AnalyticsClientPage } from "./analytics-client-page";
import { getAnalyticsOverview } from "@/lib/analytics/queries";

export default async function AnalyticsPage() {
  try {
    // Fetch initial data server-side for better performance
    const initialOverview = await getAnalyticsOverview("24h");
    
    return <AnalyticsClientPage initialOverview={initialOverview} />;
  } catch (error) {
    console.error("[AnalyticsPage] Error:", error);
    // Return page with null data on error - client will handle fetching
    return <AnalyticsClientPage initialOverview={null} />;
  }
}

