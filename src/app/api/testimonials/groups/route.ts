import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TestimonialGroupFormData } from "@/types/testimonials";

/**
 * GET /api/testimonials/groups
 * Fetch all testimonial groups
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonial_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[TESTIMONIALS] Error fetching testimonial groups:", error);
      return NextResponse.json(
        { error: `Failed to fetch groups: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ groups: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[TESTIMONIALS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials/groups
 * Create a new testimonial group
 */
export async function POST(request: Request) {
  try {
    const body: TestimonialGroupFormData = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert testimonial group
    // isActive defaults to false for new groups (only becomes active when used in a page)
    const { data, error } = await supabase
      .from("testimonial_groups")
      .insert({
        name: body.name,
        description: body.description || null,
        testimonial_ids: body.testimonialIds || [],
        order_array: body.order || body.testimonialIds || [],
        is_active: body.isActive ?? false, // Inactive by default
        usage_paths: [],
      })
      .select()
      .single();

    if (error) {
      console.error("[TESTIMONIALS] Error creating testimonial group:", error);
      return NextResponse.json(
        { error: `Failed to create group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial group created successfully",
        group: data,
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
