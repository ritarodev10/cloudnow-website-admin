import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TestimonialFormData } from "@/types/testimonials";

/**
 * GET /api/testimonials/[id]
 * Fetch a single testimonial by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
      console.error("[TESTIMONIALS] Error fetching testimonial:", error);
      return NextResponse.json(
        { error: `Failed to fetch testimonial: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonial: data }, { status: 200 });
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/testimonials/[id]
 * Update an existing testimonial
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: TestimonialFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.title || !body.company || !body.testimony) {
      return NextResponse.json(
        { error: "Name, title, company, and testimony are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate categories
    if (!body.categories || body.categories.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Validate that all categories exist in testimonial_groups
    const { data: validCategories, error: categoryCheckError } = await supabase
      .from("testimonial_groups")
      .select("name")
      .eq("is_active", true)
      .in("name", body.categories);

    if (categoryCheckError) {
      console.error(
        "[TESTIMONIALS] Error checking categories:",
        categoryCheckError
      );
      return NextResponse.json(
        { error: "Failed to validate categories" },
        { status: 500 }
      );
    }

    const validCategoryNames = (validCategories || []).map((g) => g.name);
    const invalidCategories = body.categories.filter(
      (cat) => !validCategoryNames.includes(cat)
    );

    if (invalidCategories.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid category: "${invalidCategories[0]}". Category does not exist.`,
        },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const { data: existing, error: checkError } = await supabase
      .from("testimonials")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Update testimonial
    const { data, error } = await supabase
      .from("testimonials")
      .update({
        name: body.name,
        title: body.title,
        company: body.company,
        testimony: body.testimony,
        image: body.image || null,
        rating: body.rating,
        categories: body.categories,
        is_visible: body.isVisible ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[TESTIMONIALS] Error updating testimonial:", error);
      return NextResponse.json(
        { error: `Failed to update testimonial: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial updated successfully",
        testimonial: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Delete a testimonial
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const supabase = await createClient();

    // Check if testimonial exists
    const { data: existing, error: checkError } = await supabase
      .from("testimonials")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Delete testimonial
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("[TESTIMONIALS] Error deleting testimonial:", error);
      return NextResponse.json(
        { error: `Failed to delete testimonial: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
