import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  Testimonial,
  TestimonialGroup,
  TestimonialStats,
  TestimonialRow,
  TestimonialGroupRow,
} from "@/types/testimonials";

/**
 * Transform Supabase testimonial row to Testimonial type
 */
function transformTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    company: row.company,
    testimony: row.testimony,
    image: row.image || undefined,
    rating: row.rating,
    categories: row.categories as Testimonial["categories"],
    isVisible: row.is_visible,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Transform Supabase testimonial group row to TestimonialGroup type
 */
function transformTestimonialGroup(row: TestimonialGroupRow): TestimonialGroup {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    testimonialIds: row.testimonial_ids,
    order: row.order_array,
    isActive: row.is_active,
    usagePaths: row.usage_paths,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Fetch all testimonials from Supabase
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[TESTIMONIALS] Error fetching testimonials:", error);
    throw new Error(`Failed to fetch testimonials: ${error.message}`);
  }

  return (data || []).map(transformTestimonial);
}

/**
 * Fetch a single testimonial by ID
 */
export async function getTestimonialById(
  id: string
): Promise<Testimonial | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[TESTIMONIALS] Error fetching testimonial:", error);
    throw new Error(`Failed to fetch testimonial: ${error.message}`);
  }

  return data ? transformTestimonial(data) : null;
}

/**
 * Fetch all testimonial groups from Supabase
 */
export async function getTestimonialGroups(): Promise<TestimonialGroup[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonial_groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[TESTIMONIALS] Error fetching testimonial groups:", error);
    throw new Error(`Failed to fetch testimonial groups: ${error.message}`);
  }

  return (data || []).map(transformTestimonialGroup);
}

/**
 * Fetch a single testimonial group by ID
 */
export async function getTestimonialGroupById(
  id: string
): Promise<TestimonialGroup | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonial_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[TESTIMONIALS] Error fetching testimonial group:", error);
    throw new Error(`Failed to fetch testimonial group: ${error.message}`);
  }

  return data ? transformTestimonialGroup(data) : null;
}

/**
 * Calculate testimonial statistics from database
 */
export async function getTestimonialStats(): Promise<TestimonialStats> {
  const [testimonials, groups] = await Promise.all([
    getTestimonials(),
    getTestimonialGroups(),
  ]);

  const total = testimonials.length;
  const visible = testimonials.filter((t) => t.isVisible).length;
  const hidden = total - visible;

  const totalRating = testimonials.reduce(
    (sum, testimonial) => sum + testimonial.rating,
    0
  );
  const averageRating =
    total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0;

  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;
  const usedGroups = groups.filter((g) => g.usagePaths.length > 0).length;
  const unusedGroups = totalGroups - usedGroups;

  return {
    total,
    averageRating,
    visible,
    hidden,
    totalGroups,
    activeGroups,
    usedGroups,
    unusedGroups,
  };
}

/**
 * Get testimonials by group ID
 */
export async function getTestimonialsByGroupId(
  groupId: string
): Promise<Testimonial[]> {
  const group = await getTestimonialGroupById(groupId);
  if (!group || group.testimonialIds.length === 0) {
    return [];
  }

  const testimonials = await getTestimonials();
  const testimonialMap = new Map(testimonials.map((t) => [t.id, t]));

  // Return testimonials in the order specified by the group
  return group.order
    .map((id) => testimonialMap.get(id))
    .filter(
      (testimonial): testimonial is Testimonial => testimonial !== undefined
    );
}

/**
 * Fetch all active testimonial category names from testimonial_groups
 * Categories come from testimonial_groups.name where is_active = true
 */
export async function getTestimonialCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonial_groups")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("[TESTIMONIALS] Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  // Extract category names (group names)
  return (data || []).map((group) => group.name);
}
