import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Post, PostStats, PostRow, PostFilters } from "@/types/posts";

/**
 * Transform Supabase post row to Post type
 */
function transformPost(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || undefined,
    content: row.content,
    authorId: row.author_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    status: row.status as Post["status"],
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    views: row.views || 0,
    category: undefined, // Will be set from joined data
    tags: [], // Will be set from joined data
    featuredImage: row.featured_image || undefined,
  };
}

/**
 * Fetch all posts from Supabase with optional filters
 * Includes category and tags via JOINs
 */
export async function getPosts(filters?: PostFilters): Promise<Post[]> {
  const supabase = await createClient();

  // Select posts with category and tags
  let query = supabase
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
    `);

  // Apply filters
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.category) {
    // Filter by category name (we need to join first)
    query = query.eq("blog_categories.name", filters.category);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  const sortBy = filters?.sortBy || "date";
  const sortOrder = filters?.sortOrder || "desc";

  switch (sortBy) {
    case "date":
      query = query.order("created_at", { ascending: sortOrder === "asc" });
      break;
    case "title":
      query = query.order("title", { ascending: sortOrder === "asc" });
      break;
    case "views":
      query = query.order("views", { ascending: sortOrder === "asc" });
      break;
    case "status":
      query = query.order("status", { ascending: sortOrder === "asc" });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("[POSTS] Error fetching posts:", error);
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  // Transform the data to include category name and tags array
  return (data || []).map((row: any) => {
    const post = transformPost(row);
    // Add category name from joined data
    if (row.blog_categories) {
      post.category = row.blog_categories.name;
    }
    // Add tags array from joined data
    if (row.post_tags && Array.isArray(row.post_tags)) {
      post.tags = row.post_tags.map((pt: any) => pt.blog_tags?.name || "").filter(Boolean);
    }
    return post;
  });
}

/**
 * Fetch a single post by ID with category and tags
 */
export async function getPostById(id: string): Promise<Post | null> {
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
      // Not found
      return null;
    }
    console.error("[POSTS] Error fetching post:", error);
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  if (!data) return null;

  const post = transformPost(data);
  if (data.blog_categories) {
    post.category = data.blog_categories.name;
  }
  if (data.post_tags && Array.isArray(data.post_tags)) {
    post.tags = data.post_tags.map((pt: any) => pt.blog_tags?.name || "").filter(Boolean);
  }
  return post;
}

/**
 * Fetch a single post by slug with category and tags
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
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
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[POSTS] Error fetching post by slug:", error);
    throw new Error(`Failed to fetch post by slug: ${error.message}`);
  }

  if (!data) return null;

  const post = transformPost(data);
  if (data.blog_categories) {
    post.category = data.blog_categories.name;
  }
  if (data.post_tags && Array.isArray(data.post_tags)) {
    post.tags = data.post_tags.map((pt: any) => pt.blog_tags?.name || "").filter(Boolean);
  }
  return post;
}

/**
 * Calculate post statistics from database
 */
export async function getPostStats(): Promise<PostStats> {
  const supabase = await createClient();

  // Get all posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("status, views");

  if (postsError) {
    console.error("[POSTS] Error fetching posts for stats:", postsError);
    throw new Error(`Failed to fetch posts: ${postsError.message}`);
  }

  // Calculate statistics
  const total = posts?.length || 0;
  const published =
    posts?.filter((post) => post.status === "published").length || 0;
  const drafts =
    posts?.filter((post) => post.status === "draft").length || 0;
  const scheduled =
    posts?.filter((post) => post.status === "scheduled").length || 0;
  const archived =
    posts?.filter((post) => post.status === "archived").length || 0;

  const totalViews =
    posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const averageViews = published > 0 ? Math.round(totalViews / published) : 0;

  return {
    total,
    published,
    drafts,
    scheduled,
    archived,
    totalViews,
    averageViews,
  };
}

