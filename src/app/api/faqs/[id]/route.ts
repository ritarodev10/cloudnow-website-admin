import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FAQFormData } from "@/types/faqs";

/**
 * GET /api/faqs/[id]
 * Fetch a single FAQ by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "FAQ not found" },
          { status: 404 }
        );
      }
      console.error("[FAQS] Error fetching FAQ:", error);
      return NextResponse.json(
        { error: `Failed to fetch FAQ: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ faq: data }, { status: 200 });
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/faqs/[id]
 * Update an existing FAQ
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: FAQFormData = await request.json();

    // Validate required fields
    if (!body.groupId || !body.question || !body.answer) {
      return NextResponse.json(
        { error: "Group ID, question, and answer are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Validate that the group exists
    const { data: groupExists, error: groupCheckError } = await supabase
      .from("faq_groups")
      .select("id")
      .eq("id", body.groupId)
      .single();

    if (groupCheckError || !groupExists) {
      return NextResponse.json(
        { error: "FAQ group not found" },
        { status: 400 }
      );
    }

    // Check if FAQ exists
    const { data: existing, error: checkError } = await supabase
      .from("faqs")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404 }
      );
    }

    // Update FAQ
    const { data, error } = await supabase
      .from("faqs")
      .update({
        group_id: body.groupId,
        question: body.question,
        answer: body.answer,
        order: body.order ?? 0,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[FAQS] Error updating FAQ:", error);
      return NextResponse.json(
        { error: `Failed to update FAQ: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "FAQ updated successfully",
        faq: data,
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
 * DELETE /api/faqs/[id]
 * Delete a FAQ
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const supabase = await createClient();

    // Check if FAQ exists
    const { data: existing, error: checkError } = await supabase
      .from("faqs")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404 }
      );
    }

    // Delete FAQ
    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      console.error("[FAQS] Error deleting FAQ:", error);
      return NextResponse.json(
        { error: `Failed to delete FAQ: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "FAQ deleted successfully" },
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





