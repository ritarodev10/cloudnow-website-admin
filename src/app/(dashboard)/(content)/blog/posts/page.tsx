import { getPosts, getPostStats } from "@/lib/posts/queries";
import { getCategories } from "@/lib/categories/queries";
import { PostsClientPage } from "./posts-client-page";

export default async function PostsPage() {
  // Fetch data from Supabase
  const [posts, stats, categories] = await Promise.all([
    getPosts(),
    getPostStats(),
    getCategories(),
  ]);

  // Extract unique category names
  const categoryNames = Array.from(
    new Set(
      categories
        .map((cat) => cat.name)
        .filter((name): name is string => !!name)
    )
  );

  return (
    <PostsClientPage
      initialPosts={posts}
      initialStats={stats}
      categories={categoryNames}
    />
  );
}



