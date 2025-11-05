import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PostFormData } from "@/types/posts";

/**
 * GET /api/blog/posts/[id]
 * Fetch a single post by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        blog_categories!posts_category_id_fkey (
          id,
          name,
          slug
        ),
        post_tags (
          blog_tags (
            id,
            name,
            slug
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
      console.error("[BLOG_POSTS] Error fetching post:", error);
      return NextResponse.json(
        { error: `Failed to fetch post: ${error.message}` },
        { status: 500 }
      );
    }

    // Transform the data to include category name and tags array
    const post: any = { ...data };
    
    // Extract category name from joined data
    if (data.blog_categories) {
      post.category = data.blog_categories.name;
    } else {
      post.category = null;
    }
    
    // Extract tags array from joined post_tags data
    // Handle different possible structures from Supabase
    post.tags = [];
    if (data.post_tags) {
      if (Array.isArray(data.post_tags)) {
        // Map through post_tags array and extract blog_tags.name
        post.tags = data.post_tags
          .map((pt: any) => {
            // Handle nested blog_tags object
            if (pt.blog_tags && pt.blog_tags.name) {
              return pt.blog_tags.name;
            }
            // Fallback: if blog_tags is directly the tag object
            if (pt.name) {
              return pt.name;
            }
            return null;
          })
          .filter((tag: string | null): tag is string => Boolean(tag));
      } else if (data.post_tags.blog_tags) {
        // Handle single object case
        post.tags = [data.post_tags.blog_tags.name].filter(Boolean);
      }
    }
    
    // Remove the nested objects to keep response clean
    delete post.blog_categories;
    delete post.post_tags;

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/posts/[id]
 * Update an existing post
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body: PostFormData = await request.json();

    const supabase = await createClient();

    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it conflicts
    if (body.slug) {
      const { data: slugConflict, error: slugCheckError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .single();

      if (slugConflict && !slugCheckError) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Convert category name to category_id if provided
    let categoryId: string | null = null;
    if (body.category) {
      const { data: categoryData } = await supabase
        .from("blog_categories")
        .select("id")
        .eq("name", body.category)
        .single();
      
      if (categoryData) {
        categoryId = categoryData.id;
      }
    }

    // Prepare update data
    const updateData: any = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      status: body.status,
      category_id: categoryId,
      featured_image: body.featuredImage || null,
      featured: body.featured ?? false,
      pinned: body.pinned ?? false,
      allow_comments: body.allowComments ?? true,
    };

    // Update published_at if status is published and not already set
    if (body.status === "published") {
      const { data: currentPost } = await supabase
        .from("posts")
        .select("published_at")
        .eq("id", id)
        .single();

      if (!currentPost?.published_at) {
        updateData.published_at = body.publishedAt
          ? new Date(body.publishedAt).toISOString()
          : new Date().toISOString();
      }
    }

    // Update scheduled_at if status is scheduled
    if (body.status === "scheduled") {
      updateData.scheduled_at = body.scheduledAt
        ? new Date(body.scheduledAt).toISOString()
        : null;
    } else {
      updateData.scheduled_at = null;
    }

    // Update post
    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[BLOG_POSTS] Error updating post:", error);
      return NextResponse.json(
        { error: `Failed to update post: ${error.message}` },
        { status: 500 }
      );
    }

    // Update tags via junction table
    // Delete existing tags first, then insert new ones
    if (body.tags !== undefined) {
      // Delete existing post_tags
      await supabase
        .from("post_tags")
        .delete()
        .eq("post_id", id);

      // Insert new tags if provided
      if (body.tags.length > 0) {
        const { data: tagData } = await supabase
          .from("blog_tags")
          .select("id, name")
          .in("name", body.tags);

        if (tagData && tagData.length > 0) {
          const postTagInserts = tagData.map((tag) => ({
            post_id: id,
            tag_id: tag.id,
          }));

          const { error: tagError } = await supabase
            .from("post_tags")
            .insert(postTagInserts);

          if (tagError) {
            console.error("[BLOG_POSTS] Error updating post tags:", tagError);
            // Don't fail the request, just log the error
          }
        }
      }
    }

    return NextResponse.json(
      {
        message: "Post updated successfully",
        post: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/posts/[id]
 * Delete a post
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const supabase = await createClient();

    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Delete post
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("[BLOG_POSTS] Error deleting post:", error);
      return NextResponse.json(
        { error: `Failed to delete post: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

