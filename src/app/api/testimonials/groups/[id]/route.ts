import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TestimonialGroupFormData } from "@/types/testimonials";

/**
 * PUT /api/testimonials/groups/[id]
 * Update an existing testimonial group
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: TestimonialGroupFormData = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if group exists and get current is_active value
    const { data: existing, error: checkError } = await supabase
      .from("testimonial_groups")
      .select("id, is_active")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Testimonial group not found" },
        { status: 404 }
      );
    }

    // Update testimonial group
    // Preserve existing is_active value if not provided (status only changes when used in a page)
    const { data, error } = await supabase
      .from("testimonial_groups")
      .update({
        name: body.name,
        description: body.description || null,
        testimonial_ids: body.testimonialIds || [],
        order_array: body.order || body.testimonialIds || [],
        is_active: body.isActive !== undefined ? body.isActive : existing.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[TESTIMONIALS] Error updating testimonial group:", error);
      return NextResponse.json(
        { error: `Failed to update group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial group updated successfully",
        group: data,
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
 * DELETE /api/testimonials/groups/[id]
 * Delete a testimonial group
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const supabase = await createClient();

    // Check if group exists
    const { data: existing, error: checkError } = await supabase
      .from("testimonial_groups")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "Testimonial group not found" },
        { status: 404 }
      );
    }

    // Delete testimonial group
    const { error } = await supabase
      .from("testimonial_groups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[TESTIMONIALS] Error deleting testimonial group:", error);
      return NextResponse.json(
        { error: `Failed to delete group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Testimonial group deleted successfully" },
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

