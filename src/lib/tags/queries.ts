import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Tag, TagStats, TagRow } from "@/types/tags";

/**
 * Transform Supabase tag row to Tag type
 */
function transformTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    usageCount: row.usage_count || 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Fetch all tags from Supabase
 */
export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[TAGS] Error fetching tags:", error);
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return (data || []).map(transformTag);
}

/**
 * Fetch a single tag by ID
 */
export async function getTagById(id: string): Promise<Tag | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[TAGS] Error fetching tag:", error);
    throw new Error(`Failed to fetch tag: ${error.message}`);
  }

  return data ? transformTag(data) : null;
}

/**
 * Fetch a single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[TAGS] Error fetching tag by slug:", error);
    throw new Error(`Failed to fetch tag by slug: ${error.message}`);
  }

  return data ? transformTag(data) : null;
}

/**
 * Calculate tag statistics from database
 */
export async function getTagStats(): Promise<TagStats> {
  const tags = await getTags();

  const total = tags.length;
  const totalUsage = tags.reduce((sum, tag) => sum + tag.usageCount, 0);
  const unused = tags.filter((tag) => tag.usageCount === 0).length;

  return {
    total,
    totalUsage,
    unused,
  };
}



