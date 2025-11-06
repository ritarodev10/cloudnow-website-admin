import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FAQGroupFormData } from "@/types/faqs";

/**
 * GET /api/faqs/groups/[id]
 * Fetch a single FAQ group by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("faq_groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "FAQ group not found" },
          { status: 404 }
        );
      }
      console.error("[FAQS] Error fetching FAQ group:", error);
      return NextResponse.json(
        { error: `Failed to fetch FAQ group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ group: data }, { status: 200 });
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/faqs/groups/[id]
 * Update an existing FAQ group
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: FAQGroupFormData = await request.json();

    // Validate required fields
    if (!body.groupName) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if group exists
    const { data: existing, error: checkError } = await supabase
      .from("faq_groups")
      .select("id, is_active")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "FAQ group not found" },
        { status: 404 }
      );
    }

    // Update FAQ group
    const { data, error } = await supabase
      .from("faq_groups")
      .update({
        group_name: body.groupName,
        description: body.description || null,
        usage_paths: body.usagePaths || [],
        is_active: body.isActive !== undefined ? body.isActive : existing.is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[FAQS] Error updating FAQ group:", error);
      return NextResponse.json(
        { error: `Failed to update group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "FAQ group updated successfully",
        group: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/faqs/groups/[id]
 * Delete a FAQ group
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
      .from("faq_groups")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "FAQ group not found" },
        { status: 404 }
      );
    }

    // Delete FAQ group (will cascade delete FAQs due to foreign key)
    const { error } = await supabase
      .from("faq_groups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[FAQS] Error deleting FAQ group:", error);
      return NextResponse.json(
        { error: `Failed to delete group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "FAQ group deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}




