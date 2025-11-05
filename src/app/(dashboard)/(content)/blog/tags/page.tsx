import { getTags, getTagStats } from "@/lib/tags/queries";
import { TagsClientPage } from "./tags-client-page";

export default async function TagsPage() {
  // Fetch data from Supabase
  const [tags, stats] = await Promise.all([
    getTags(),
    getTagStats(),
  ]);

  return (
    <TagsClientPage
      initialTags={tags}
      initialStats={stats}
    />
  );
}

