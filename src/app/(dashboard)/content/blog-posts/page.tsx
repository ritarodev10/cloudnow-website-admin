"use client";

import { useState } from "react";
import {
  CalendarIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with CloudNow: A Comprehensive Guide",
    status: "Published",
    category: "Tutorials",
    author: "Admin User",
    date: "2025-10-15",
    views: 1245,
    tags: ["getting-started", "tutorial", "guide"],
  },
  {
    id: 2,
    title: "10 Best Practices for Cloud Security in 2025",
    status: "Published",
    category: "Security",
    author: "Admin User",
    date: "2025-10-10",
    views: 982,
    tags: ["security", "best-practices", "cloud"],
  },
  {
    id: 3,
    title: "How to Optimize Your Website Performance",
    status: "Published",
    category: "Performance",
    author: "Admin User",
    date: "2025-10-05",
    views: 756,
    tags: ["performance", "optimization", "web"],
  },
  {
    id: 4,
    title: "Understanding Serverless Architecture",
    status: "Draft",
    category: "Technology",
    author: "Admin User",
    date: "2025-10-01",
    views: 0,
    tags: ["serverless", "architecture", "cloud"],
  },
  {
    id: 5,
    title: "The Future of Web Development in 2026",
    status: "Draft",
    category: "Trends",
    author: "Admin User",
    date: "2025-09-28",
    views: 0,
    tags: ["future", "trends", "web-development"],
  },
];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          <span>New Post</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 whitespace-nowrap">
              <FilterIcon className="size-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === "Published"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post.status === "Published" ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <EyeIcon className="size-3" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="size-8">
                          <EditIcon className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-red-500 hover:text-red-600"
                        >
                          <TrashIcon className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Showing {filteredPosts.length} of {blogPosts.length} posts
            </div>
            <div className="flex items-center gap-1">
              <TagIcon className="size-3" />
              <span>Categories: All</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Blog Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Posts</div>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Published</div>
              <div className="text-2xl font-bold">
                {blogPosts.filter((p) => p.status === "Published").length}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Drafts</div>
              <div className="text-2xl font-bold">
                {blogPosts.filter((p) => p.status === "Draft").length}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Views</div>
              <div className="text-2xl font-bold">
                {blogPosts
                  .reduce((sum, post) => sum + post.views, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
