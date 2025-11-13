import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TagFormData } from "@/types/tags";

/**
 * GET /api/blog/tags/[id]
 * Fetch a single tag by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      }
      console.error("[TAGS] Error fetching tag:", error);
      return NextResponse.json(
        { error: `Failed to fetch tag: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag: data }, { status: 200 });
  } catch (error) {
    console.error("[TAGS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/tags/[id]
 * Update a tag
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: TagFormData = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate slug from name if not provided
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check if another tag with same name or slug already exists
    const { data: existingTag, error: checkError } = await supabase
      .from("blog_tags")
      .select("id, name, slug")
      .or(`name.eq.${body.name},slug.eq.${slug}`)
      .neq("id", id)
      .single();

    if (existingTag && !checkError) {
      return NextResponse.json(
        {
          error: existingTag.name === body.name
            ? "A tag with this name already exists"
            : "A tag with this slug already exists",
        },
        { status: 400 }
      );
    }

    // Update tag
    const { data, error } = await supabase
      .from("blog_tags")
      .update({
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[TAGS] Error updating tag:", error);
      return NextResponse.json(
        { error: `Failed to update tag: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Tag updated successfully",
        tag: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TAGS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/tags/[id]
 * Delete a tag
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    // Check if tag is in use
    const { data: tagData, error: tagError } = await supabase
      .from("blog_tags")
      .select("usage_count")
      .eq("id", id)
      .single();

    if (tagError) {
      if (tagError.code === "PGRST116") {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      }
      console.error("[TAGS] Error fetching tag:", tagError);
      return NextResponse.json(
        { error: `Failed to fetch tag: ${tagError.message}` },
        { status: 500 }
      );
    }

    if (tagData && tagData.usage_count > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete tag that is in use. Remove it from all posts first.",
        },
        { status: 400 }
      );
    }

    // Delete tag
    const { error } = await supabase.from("blog_tags").delete().eq("id", id);

    if (error) {
      console.error("[TAGS] Error deleting tag:", error);
      return NextResponse.json(
        { error: `Failed to delete tag: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TAGS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}




