import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FAQFormData } from "@/types/faqs";

/**
 * GET /api/faqs
 * Fetch all FAQs
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[FAQS] Error fetching FAQs:", error);
      return NextResponse.json(
        { error: `Failed to fetch FAQs: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ faqs: data || [] }, { status: 200 });
  } catch (error) {
    console.error("[FAQS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/faqs
 * Create a new FAQ
 */
export async function POST(request: Request) {
  try {
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

    // Insert FAQ
    const { data, error } = await supabase
      .from("faqs")
      .insert({
        group_id: body.groupId,
        question: body.question,
        answer: body.answer,
        order: body.order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("[FAQS] Error creating FAQ:", error);
      return NextResponse.json(
        { error: `Failed to create FAQ: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "FAQ created successfully",
        faq: data,
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


