import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TestimonialFormData, TestimonialRow } from "@/types/testimonials";

/**
 * GET /api/testimonials
 * Fetch all testimonials
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[TESTIMONIALS] Error fetching testimonials:", error);
      return NextResponse.json(
        { error: `Failed to fetch testimonials: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonials: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Create a new testimonial
 */
export async function POST(request: Request) {
  try {
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

    // Insert testimonial
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: body.name,
        title: body.title,
        company: body.company,
        testimony: body.testimony,
        image: body.image || null,
        rating: body.rating,
        categories: body.categories,
        is_visible: body.isVisible ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[TESTIMONIALS] Error creating testimonial:", error);
      return NextResponse.json(
        { error: `Failed to create testimonial: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial created successfully",
        testimonial: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
