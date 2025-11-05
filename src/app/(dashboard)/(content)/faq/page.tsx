import {
  getFAQs,
  getFAQGroups,
  getFAQStats,
} from "@/lib/faqs/queries";
import { FAQClientPage } from "./faq-client-page";

export default async function FAQPage() {
  // Fetch data from Supabase
  const [faqs, groups, stats] = await Promise.all([
    getFAQs(),
    getFAQGroups(),
    getFAQStats(),
  ]);

  return (
    <FAQClientPage
      initialFAQs={faqs}
      initialGroups={groups}
      initialStats={stats}
    />
  );
}


