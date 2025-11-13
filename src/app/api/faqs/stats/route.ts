import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/faqs/stats
 * Fetch FAQ statistics
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch FAQs and groups
    const [faqsResult, groupsResult] = await Promise.all([
      supabase.from("faqs").select("*"),
      supabase.from("faq_groups").select("*"),
    ]);

    if (faqsResult.error) {
      console.error("[FAQS] Error fetching FAQs for stats:", faqsResult.error);
      return NextResponse.json(
        { error: "Failed to fetch FAQs" },
        { status: 500 }
      );
    }

    if (groupsResult.error) {
      console.error(
        "[FAQS] Error fetching groups for stats:",
        groupsResult.error
      );
      return NextResponse.json(
        { error: "Failed to fetch groups" },
        { status: 500 }
      );
    }

    const faqs = faqsResult.data || [];
    const groups = groupsResult.data || [];

    const total = faqs.length;
    const totalGroups = groups.length;
    const activeGroups = groups.filter((g) => g.is_active).length;
    const usedGroups = groups.filter((g) => g.usage_paths.length > 0).length;
    const unusedGroups = totalGroups - usedGroups;

    return NextResponse.json(
      {
        stats: {
          total,
          totalGroups,
          activeGroups,
          usedGroups,
          unusedGroups,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}




