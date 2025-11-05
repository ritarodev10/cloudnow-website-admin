import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CategoryFormData } from "@/types/categories";

/**
 * GET /api/blog/categories
 * Fetch all blog categories with post counts
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch categories with post counts
    // Note: This assumes a blog_categories table exists
    // If post counts need to be calculated, we'll need a join or separate query
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[BLOG_CATEGORIES] Error fetching categories:", error);
      return NextResponse.json(
        { error: `Failed to fetch categories: ${error.message}` },
        { status: 500 }
      );
    }

    // Calculate post counts using FK relationship
    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (category) => {
        const { count } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("category_id", category.id);

        return {
          ...category,
          post_count: count || 0,
        };
      })
    );

    return NextResponse.json(
      { categories: categoriesWithCounts || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORIES] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/categories
 * Create a new blog category
 */
export async function POST(request: Request) {
  try {
    const body: CategoryFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if slug already exists
    const { data: existingSlug, error: slugCheckError } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", body.slug)
      .single();

    if (existingSlug && !slugCheckError) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    // Insert category
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        is_active: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[BLOG_CATEGORIES] Error creating category:", error);
      return NextResponse.json(
        { error: `Failed to create category: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORIES] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
