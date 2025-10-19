"use client";

import { Settings, FolderOpen, User, Globe, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { BlogPostFormData, EditorState } from "@/types/blog-strapi";
import {
  sampleCategories,
  sampleTags,
  sampleAuthors,
  getStatusBadgeVariant,
  getStatusBadgeLabel,
} from "@/data/blog-post";

import { ContentStats } from "@/components/blog/new-post/content-stats";

interface BlogPostSidebarProps {
  formData: BlogPostFormData;
  editorState: EditorState;
  errors: Record<string, string>;
  onInputChange: (
    field: keyof BlogPostFormData,
    value: string | number | boolean | number[]
  ) => void;
}

export function BlogPostSidebar({
  formData,
  editorState,
  errors,
  onInputChange,
}: BlogPostSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Status & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant={getStatusBadgeVariant(formData.status)}>
              {getStatusBadgeLabel(formData.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="featured">Featured Post</Label>
            <Switch
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                onInputChange("isFeatured", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pinned">Pinned Post</Label>
            <Switch
              id="pinned"
              checked={formData.isPinned}
              onCheckedChange={(checked) => onInputChange("isPinned", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="comments">Allow Comments</Label>
            <Switch
              id="comments"
              checked={formData.allowComments}
              onCheckedChange={(checked) =>
                onInputChange("allowComments", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <ContentStats editorState={editorState} />

      {/* Category & Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Category & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={(value) =>
                onInputChange("categoryId", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {sampleCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags *</Label>
            <div className="space-y-2">
              {sampleTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={(e) => {
                      const newTagIds = e.target.checked
                        ? [...formData.tagIds, tag.id]
                        : formData.tagIds.filter((id) => id !== tag.id);
                      onInputChange("tagIds", newTagIds);
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.tagIds && (
              <p className="text-sm text-red-500">{errors.tagIds}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Author */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Author
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Select
            value={formData.authorId.toString()}
            onValueChange={(value) =>
              onInputChange("authorId", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {sampleAuthors.map((author) => (
                <SelectItem key={author.id} value={author.id.toString()}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.authorId && (
            <p className="text-sm text-red-500">{errors.authorId}</p>
          )}
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle || ""}
              onChange={(e) => onInputChange("seoTitle", e.target.value)}
              placeholder="SEO optimized title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription || ""}
              onChange={(e) => onInputChange("seoDescription", e.target.value)}
              placeholder="Meta description..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto-save Status */}
      {editorState.isDirty && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Auto-save will occur in 30 seconds.
          </AlertDescription>
        </Alert>
      )}

      {/* General Errors */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
