// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  status: "Published" | "Draft";
  category: string;
  author: string;
  date: string;
  views: number;
  tags: string[];
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}
