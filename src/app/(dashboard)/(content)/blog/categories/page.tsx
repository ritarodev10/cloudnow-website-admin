"use client";

import { useState } from "react";
import { PlusIcon, EditIcon, TrashIcon, FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  blogCategories,
  searchCategories,
  BlogCategory,
} from "@/data/blog-categories";

export default function BlogCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = searchCategories(blogCategories, searchTerm);

  const handleEdit = (category: BlogCategory) => {
    console.log("Edit category:", category);
    // TODO: Implement edit functionality
  };

  const handleDelete = (category: BlogCategory) => {
    console.log("Delete category:", category);
    // TODO: Implement delete functionality
  };

  const handleCreate = () => {
    console.log("Create new category");
    // TODO: Implement create functionality
  };

  return (
    <PageTitle
      title="Blog Categories"
      description="Manage blog post categories and organization."
      actions={
        <Button onClick={handleCreate} className="gap-2">
          <PlusIcon className="size-4" />
          <span>New Category</span>
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="gap-1">
                      <FolderIcon className="size-3" />
                      {category.postCount} posts
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No categories found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </CardContent>
      </Card>
    </PageTitle>
  );
}
