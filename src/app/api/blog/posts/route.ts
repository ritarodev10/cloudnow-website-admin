import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PostFormData } from "@/types/posts";

/**
 * GET /api/blog/posts
 * Fetch all blog posts with optional filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const supabase = await createClient();

    // Select posts with category and tags via JOINs
    let query = supabase.from("posts").select(`
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
      `);

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      // Filter by category name via JOIN
      query = query.eq("blog_categories.name", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`
      );
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit, 10) : 10;
    if (limit) {
      query = query.limit(limitNum);
    }

    if (offset) {
      const offsetNum = parseInt(offset, 10);
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    // Default ordering
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("[BLOG_POSTS] Error fetching posts:", error);
      return NextResponse.json(
        { error: `Failed to fetch posts: ${error.message}` },
        { status: 500 }
      );
    }

    // Transform the data to include category name and tags array
    const transformedPosts = (data || []).map((row: any) => {
      const post: any = { ...row };

      // Extract category name from joined data
      if (row.blog_categories) {
        post.category = row.blog_categories.name;
      } else {
        post.category = null;
      }

      // Extract tags array from joined post_tags data
      // Handle different possible structures from Supabase
      post.tags = [];
      if (row.post_tags) {
        if (Array.isArray(row.post_tags)) {
          // Map through post_tags array and extract blog_tags.name
          post.tags = row.post_tags
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
        } else if (row.post_tags.blog_tags) {
          // Handle single object case
          post.tags = [row.post_tags.blog_tags.name].filter(Boolean);
        }
      }

      // Remove the nested objects to keep response clean
      delete post.blog_categories;
      delete post.post_tags;

      return post;
    });

    return NextResponse.json({ posts: transformedPosts }, { status: 200 });
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/posts
 * Create a new blog post
 */
export async function POST(request: Request) {
  try {
    const body: PostFormData = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if slug already exists
    const { data: existingSlug, error: slugCheckError } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", body.slug)
      .single();

    if (existingSlug && !slugCheckError) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
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

    // Prepare data for insertion
    const postData: any = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      author_id: body.authorId,
      author_name: body.authorName,
      author_email: body.authorEmail,
      status: body.status,
      category_id: categoryId,
      featured_image: body.featuredImage || null,
      featured: body.featured ?? false,
      pinned: body.pinned ?? false,
      allow_comments: body.allowComments ?? true,
      views: 0,
    };

    // Set published_at if status is published
    if (body.status === "published") {
      postData.published_at = body.publishedAt
        ? new Date(body.publishedAt).toISOString()
        : new Date().toISOString();
    }

    // Set scheduled_at if status is scheduled
    if (body.status === "scheduled" && body.scheduledAt) {
      postData.scheduled_at = new Date(body.scheduledAt).toISOString();
    }

    // Insert post
    const { data, error } = await supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error("[BLOG_POSTS] Error creating post:", error);
      return NextResponse.json(
        { error: `Failed to create post: ${error.message}` },
        { status: 500 }
      );
    }

    // Handle tags via junction table
    // Convert tag names to tag IDs and insert into post_tags
    if (body.tags && body.tags.length > 0 && data) {
      const { data: tagData } = await supabase
        .from("blog_tags")
        .select("id, name")
        .in("name", body.tags);

      if (tagData && tagData.length > 0) {
        const postTagInserts = tagData.map((tag) => ({
          post_id: data.id,
          tag_id: tag.id,
        }));

        const { error: tagError } = await supabase
          .from("post_tags")
          .insert(postTagInserts);

        if (tagError) {
          console.error("[BLOG_POSTS] Error creating post tags:", tagError);
          // Don't fail the request, just log the error
        }
      }
    }

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BLOG_POSTS] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
