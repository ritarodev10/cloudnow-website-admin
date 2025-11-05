import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CategoryFormData } from "@/types/categories";

/**
 * GET /api/blog/categories/[id]
 * Fetch a single category by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      console.error("[BLOG_CATEGORIES] Error fetching category:", error);
      return NextResponse.json(
        { error: `Failed to fetch category: ${error.message}` },
        { status: 500 }
      );
    }

    // Get post count using FK relationship
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("category_id", data.id);

    return NextResponse.json(
      { category: { ...data, post_count: count || 0 } },
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
 * PUT /api/blog/categories/[id]
 * Update an existing category
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: CategoryFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if category exists
    const { data: existing, error: checkError } = await supabase
      .from("blog_categories")
      .select("id, slug")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (existing.slug !== body.slug) {
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
    }

    // Update category
    const { data, error } = await supabase
      .from("blog_categories")
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        is_active: body.isActive ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[BLOG_CATEGORIES] Error updating category:", error);
      return NextResponse.json(
        { error: `Failed to update category: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Category updated successfully",
        category: data,
      },
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
 * DELETE /api/blog/categories/[id]
 * Delete a category
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const supabase = await createClient();

    // Check if category exists
    const { data: existing, error: checkError } = await supabase
      .from("blog_categories")
      .select("id, name")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used by any posts using FK relationship
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("category_id", existing.id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It is being used by ${count} post(s). Please update or remove those posts first.`,
        },
        { status: 400 }
      );
    }

    // Delete category
    const { error } = await supabase
      .from("blog_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[BLOG_CATEGORIES] Error deleting category:", error);
      return NextResponse.json(
        { error: `Failed to delete category: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
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

