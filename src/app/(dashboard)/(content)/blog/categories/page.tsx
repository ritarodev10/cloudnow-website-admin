import {
  getCategories,
  getCategoryStats,
} from "@/lib/categories/queries";
import { CategoriesClientPage } from "./categories-client-page";

// Force dynamic rendering to avoid build-time static generation
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch data from Supabase
  const [categories, stats] = await Promise.all([
    getCategories(),
    getCategoryStats(),
  ]);

  return (
    <CategoriesClientPage
      initialCategories={categories}
      initialStats={stats}
    />
  );
}




