"use client";

import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import { BlogPostFormData } from "@/types/blog-strapi";

// Function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

interface BlogPostFormProps {
  formData: BlogPostFormData;
  errors: Record<string, string>;
  onInputChange: (
    field: keyof BlogPostFormData,
    value: string | number | boolean | number[]
  ) => void;
  onContentChange: (content: string) => void;
}

export function BlogPostForm({
  formData,
  errors,
  onInputChange,
  onContentChange,
}: BlogPostFormProps) {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Post Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                onInputChange("title", title);
                // Auto-generate slug if slug is empty or matches previous title
                if (
                  !formData.slug ||
                  formData.slug === generateSlug(formData.title)
                ) {
                  onInputChange("slug", generateSlug(title));
                }
              }}
              placeholder="Enter blog post title..."
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onInputChange("slug", e.target.value)}
              placeholder="post-url-slug"
              className={errors.slug ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from title. You can edit it manually.
            </p>
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => onInputChange("excerpt", e.target.value)}
              placeholder="Brief description of the post..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rich Text Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.content}
            onChange={onContentChange}
            placeholder="Start writing your blog post..."
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-2">{errors.content}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
