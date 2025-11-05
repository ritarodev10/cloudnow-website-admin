import "server-only";
import { createClient } from "@/lib/supabase/server";
import { BlogCategory, CategoryStats, CategoryRow } from "@/types/categories";

/**
 * Transform Supabase category row to BlogCategory type
 */
function transformCategory(row: CategoryRow): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    postCount: row.post_count || 0,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Fetch all blog categories from Supabase with post counts
 */
export async function getCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[CATEGORIES] Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  // Calculate post counts for each category using FK relationship
  const categoriesWithCounts = await Promise.all(
    (data || []).map(async (row) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", row.id);

      return transformCategory({
        ...row,
        post_count: count || 0,
      });
    })
  );

  return categoriesWithCounts;
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(
  id: string
): Promise<BlogCategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[CATEGORIES] Error fetching category:", error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Get post count using FK relationship
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("category_id", data.id);

  return transformCategory({
    ...data,
    post_count: count || 0,
  });
}

/**
 * Calculate category statistics from database
 */
export async function getCategoryStats(): Promise<CategoryStats> {
  const supabase = await createClient();

  // Get all categories
  const { data: categories, error: categoriesError } = await supabase
    .from("blog_categories")
    .select("id, is_active");

  if (categoriesError) {
    console.error(
      "[CATEGORIES] Error fetching categories for stats:",
      categoriesError
    );
    throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
  }

  const total = categories?.length || 0;
  const active =
    categories?.filter((cat) => cat.is_active === true).length || 0;
  const inactive = total - active;

  // Get total posts count
  const { count: totalPosts, error: postsError } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (postsError) {
    console.error("[CATEGORIES] Error fetching posts count:", postsError);
    // Don't fail, just set to 0
  }

  return {
    total,
    active,
    inactive,
    totalPosts: totalPosts || 0,
  };
}
