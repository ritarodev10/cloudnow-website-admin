"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

import { BlogSearch } from "@/components/blog/blog-search";
import { BlogTable } from "@/components/blog/blog-table";
import { BlogStatsCard } from "@/components/blog/blog-stats-card";
import { BlogTableFooter } from "@/components/blog/blog-table-footer";

import { blogPosts, calculateBlogStats } from "@/data/blog-posts";
import { BlogPost } from "@/types/blog";

export default function BlogPostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const stats = calculateBlogStats(blogPosts);

  const handleEdit = (post: BlogPost) => {
    console.log("Edit post:", post);
    // TODO: Implement edit functionality
  };

  const handleDelete = (post: BlogPost) => {
    console.log("Delete post:", post);
    // TODO: Implement delete functionality
  };

  const handleFilter = () => {
    console.log("Open filter modal");
    // TODO: Implement filter functionality
  };

  return (
    <PageTitle
      title="Blog Posts"
      description="Manage your blog content, create new posts, and track performance."
      actions={
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          <span>New Post</span>
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={handleFilter}
          />

          <BlogTable
            posts={filteredPosts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <BlogTableFooter
            filteredCount={filteredPosts.length}
            totalCount={blogPosts.length}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Blog Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogStatsCard stats={stats} />
        </CardContent>
      </Card>
    </PageTitle>
  );
}
