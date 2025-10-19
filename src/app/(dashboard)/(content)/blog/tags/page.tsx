"use client";

import { useState } from "react";
import { PlusIcon, EditIcon, TrashIcon, TagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  blogTags,
  searchTags,
  getPopularTags,
  BlogTag,
} from "@/data/blog-tags";

export default function BlogTagsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = searchTags(blogTags, searchTerm);

  const handleEdit = (tag: BlogTag) => {
    console.log("Edit tag:", tag);
    // TODO: Implement edit functionality
  };

  const handleDelete = (tag: BlogTag) => {
    console.log("Delete tag:", tag);
    // TODO: Implement delete functionality
  };

  const handleCreate = () => {
    console.log("Create new tag");
    // TODO: Implement create functionality
  };

  return (
    <PageTitle
      title="Blog Tags"
      description="Manage blog post tags for better organization."
      actions={
        <Button onClick={handleCreate} className="gap-2">
          <PlusIcon className="size-4" />
          <span>New Tag</span>
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTags.map((tag) => (
              <Card key={tag.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                      <div>
                        <h3 className="font-medium">{tag.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tag.postCount} posts
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tag)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tag)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tags found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getPopularTags(blogTags, 10).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-secondary/80"
              >
                <TagIcon className="size-3" />
                {tag.name} ({tag.postCount})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTitle>
  );
}
