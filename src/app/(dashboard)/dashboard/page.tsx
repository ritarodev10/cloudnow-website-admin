import { DashboardClientPage } from "./dashboard-client-page";
import { getPostStats } from "@/lib/posts/queries";
import { getAnalyticsOverview } from "@/lib/analytics/queries";

// Force dynamic rendering to avoid build-time static generation
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    // Fetch initial data server-side for better performance
    const [initialPostStats, initialAnalytics] = await Promise.all([
      getPostStats(),
      getAnalyticsOverview("7d").catch((error) => {
        console.error("[DashboardPage] Error fetching analytics:", error);
        return null; // Return null on error, client will handle fetching
      }),
    ]);

    return (
      <DashboardClientPage
        initialPostStats={initialPostStats}
        initialAnalytics={initialAnalytics || undefined}
      />
    );
  } catch (error) {
    console.error("[DashboardPage] Error:", error);
    // Return page without initial data - client will handle fetching
    return <DashboardClientPage />;
  }
}
