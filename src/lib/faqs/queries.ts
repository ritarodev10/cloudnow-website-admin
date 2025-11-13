import "server-only";
import { createClient } from "@/lib/supabase/server";
import { FAQ, FAQGroup, FAQStats, FAQRow, FAQGroupRow } from "@/types/faqs";

/**
 * Transform Supabase FAQ row to FAQ type
 */
function transformFAQ(row: FAQRow): FAQ {
  return {
    id: row.id,
    groupId: row.group_id,
    question: row.question,
    answer: row.answer,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Transform Supabase FAQ group row to FAQGroup type
 */
function transformFAQGroup(row: FAQGroupRow): FAQGroup {
  return {
    id: row.id,
    groupName: row.group_name,
    description: row.description || undefined,
    usagePaths: row.usage_paths,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Fetch all FAQs from Supabase with group information
 */
export async function getFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[FAQS] Error fetching FAQs:", error);
    throw new Error(`Failed to fetch FAQs: ${error.message}`);
  }

  return (data || []).map(transformFAQ);
}

/**
 * Fetch a single FAQ by ID
 */
export async function getFAQById(id: string): Promise<FAQ | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[FAQS] Error fetching FAQ:", error);
    throw new Error(`Failed to fetch FAQ: ${error.message}`);
  }

  return data ? transformFAQ(data) : null;
}

/**
 * Fetch all FAQ groups from Supabase
 */
export async function getFAQGroups(): Promise<FAQGroup[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[FAQS] Error fetching FAQ groups:", error);
    throw new Error(`Failed to fetch FAQ groups: ${error.message}`);
  }

  return (data || []).map(transformFAQGroup);
}

/**
 * Fetch a single FAQ group by ID
 */
export async function getFAQGroupById(id: string): Promise<FAQGroup | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[FAQS] Error fetching FAQ group:", error);
    throw new Error(`Failed to fetch FAQ group: ${error.message}`);
  }

  return data ? transformFAQGroup(data) : null;
}

/**
 * Calculate FAQ statistics from database
 */
export async function getFAQStats(): Promise<FAQStats> {
  const [faqs, groups] = await Promise.all([getFAQs(), getFAQGroups()]);

  const total = faqs.length;
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;
  const usedGroups = groups.filter((g) => g.usagePaths.length > 0).length;
  const unusedGroups = totalGroups - usedGroups;

  return {
    total,
    totalGroups,
    activeGroups,
    usedGroups,
    unusedGroups,
  };
}

/**
 * Get FAQs by group ID
 */
export async function getFAQsByGroupId(groupId: string): Promise<FAQ[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("group_id", groupId)
    .order("order", { ascending: true });

  if (error) {
    console.error("[FAQS] Error fetching FAQs by group:", error);
    throw new Error(`Failed to fetch FAQs by group: ${error.message}`);
  }

  return (data || []).map(transformFAQ);
}




