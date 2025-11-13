import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TagFormData } from "@/types/tags";

/**
 * GET /api/blog/tags
 * Fetch all blog tags
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[TAGS] Error fetching tags:", error);
      return NextResponse.json(
        { error: `Failed to fetch tags: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ tags: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[TAGS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/tags
 * Create a new blog tag
 */
export async function POST(request: Request) {
  try {
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

    // Check if tag with same name or slug already exists
    const { data: existingTag, error: checkError } = await supabase
      .from("blog_tags")
      .select("id, name, slug")
      .or(`name.eq.${body.name},slug.eq.${slug}`)
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

    // Insert tag
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || null,
        usage_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("[TAGS] Error creating tag:", error);
      return NextResponse.json(
        { error: `Failed to create tag: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Tag created successfully",
        tag: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TAGS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}




