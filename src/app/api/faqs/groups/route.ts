import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FAQGroupFormData } from "@/types/faqs";

/**
 * GET /api/faqs/groups
 * Fetch all FAQ groups
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("faq_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[FAQS] Error fetching FAQ groups:", error);
      return NextResponse.json(
        { error: `Failed to fetch groups: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ groups: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/faqs/groups
 * Create a new FAQ group
 */
export async function POST(request: Request) {
  try {
    const body: FAQGroupFormData = await request.json();

    // Validate required fields
    if (!body.groupName) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert FAQ group
    const { data, error } = await supabase
      .from("faq_groups")
      .insert({
        group_name: body.groupName,
        description: body.description || null,
        usage_paths: body.usagePaths || [],
        is_active: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[FAQS] Error creating FAQ group:", error);
      return NextResponse.json(
        { error: `Failed to create group: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "FAQ group created successfully",
        group: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}




