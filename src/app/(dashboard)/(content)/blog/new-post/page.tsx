"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  User,
  FolderOpen,
  FileText,
  Hash,
  Globe,
  Settings,
  AlertCircle,
} from "lucide-react";

import { PageTitle } from "@/components/ui/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { BlogPostFormData, EditorState } from "@/types/blog-strapi";
import {
  defaultBlogPostFormData,
  defaultEditorState,
  sampleCategories,
  sampleTags,
  sampleAuthors,
  generateSlug,
  getContentStats,
  validateBlogPost,
  getStatusBadgeVariant,
  getStatusBadgeLabel,
} from "@/data/blog-post";

export default function NewPostPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<BlogPostFormData>(
    defaultBlogPostFormData
  );
  const [editorState, setEditorState] =
    useState<EditorState>(defaultEditorState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, formData.slug]);

  // Update content stats when content changes
  useEffect(() => {
    const stats = getContentStats(formData.content);
    setEditorState((prev) => ({
      ...prev,
      ...stats,
      isDirty: true,
    }));
  }, [formData.content]);

  const handleInputChange = (
    field: keyof BlogPostFormData,
    value: string | number | boolean | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleContentChange = (content: string) => {
    handleInputChange("content", content);
  };

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      const validationErrors = validateBlogPost(formData);

      if (Object.keys(validationErrors).length > 0 && !isAutoSave) {
        setErrors(validationErrors);
        return;
      }

      setIsSaving(true);

      try {
        // TODO: Replace with actual Strapi API call
        console.log("Saving blog post:", formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEditorState((prev) => ({
          ...prev,
          isDirty: false,
          isSaving: false,
          lastSaved: new Date().toLocaleTimeString(),
        }));

        if (!isAutoSave) {
          // Show success message or redirect
          console.log("Blog post saved successfully!");
        }
      } catch (error) {
        console.error("Error saving blog post:", error);
        setErrors({ general: "Failed to save blog post. Please try again." });
      } finally {
        setIsSaving(false);
      }
    },
    [formData]
  );

  // Auto-save functionality (every 30 seconds)
  useEffect(() => {
    if (!editorState.isDirty || !formData.title) return;

    const autoSaveTimer = setInterval(() => {
      handleSave(true); // Auto-save
    }, 30000);

    return () => clearInterval(autoSaveTimer);
  }, [editorState.isDirty, formData.title, handleSave]);

  const handlePublish = async () => {
    const validationErrors = validateBlogPost(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Replace with actual Strapi API call
      const publishData = {
        ...formData,
        status: "published" as const,
        publishedAt: new Date().toISOString(),
      };

      console.log("Publishing blog post:", publishData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to blog posts list
      router.push("/blog");
    } catch (error) {
      console.error("Error publishing blog post:", error);
      setErrors({ general: "Failed to publish blog post. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategory = sampleCategories.find(
    (cat) => cat.id === formData.categoryId
  );
  const selectedAuthor = sampleAuthors.find(
    (author) => author.id === formData.authorId
  );
  const selectedTags = sampleTags.filter((tag) =>
    formData.tagIds.includes(tag.id)
  );

  // Remove unused variables to fix linting warnings
  void selectedCategory;
  void selectedAuthor;
  void selectedTags;

  return (
    <PageTitle
      title="New Post"
      description="Compose a fresh blog article"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={!formData.content}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSaving || !formData.title || !formData.content}
          >
            <Globe className="h-4 w-4 mr-2" />
            {isSaving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                  onChange={(e) => handleInputChange("title", e.target.value)}
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
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="post-url-slug"
                  className={errors.slug ? "border-red-500" : ""}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
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
                onChange={handleContentChange}
                placeholder="Start writing your blog post..."
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-2">{errors.content}</p>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
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
                  onValueChange={(value) => handleInputChange("status", value)}
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
                    handleInputChange("isFeatured", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pinned">Pinned Post</Label>
                <Switch
                  id="pinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPinned", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="comments">Allow Comments</Label>
                <Switch
                  id="comments"
                  checked={formData.allowComments}
                  onCheckedChange={(checked) =>
                    handleInputChange("allowComments", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Content Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Words</span>
                <span className="font-medium">{editorState.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Characters
                </span>
                <span className="font-medium">
                  {editorState.characterCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Reading Time
                </span>
                <span className="font-medium">
                  {editorState.readingTime} min
                </span>
              </div>
              {editorState.lastSaved && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Saved
                  </span>
                  <span className="text-sm">{editorState.lastSaved}</span>
                </div>
              )}
            </CardContent>
          </Card>

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
                    handleInputChange("categoryId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
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
                          handleInputChange("tagIds", newTagIds);
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
                  handleInputChange("authorId", parseInt(value))
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
                  onChange={(e) =>
                    handleInputChange("seoTitle", e.target.value)
                  }
                  placeholder="SEO optimized title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription || ""}
                  onChange={(e) =>
                    handleInputChange("seoDescription", e.target.value)
                  }
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
      </div>
    </PageTitle>
  );
}
