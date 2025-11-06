import {
  getCategories,
  getCategoryStats,
} from "@/lib/categories/queries";
import { CategoriesClientPage } from "./categories-client-page";

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



