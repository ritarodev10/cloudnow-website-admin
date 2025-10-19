"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { PageTitle } from "@/components/ui/page-title";

import { BlogPostFormData, EditorState } from "@/types/blog-strapi";
import {
  defaultBlogPostFormData,
  defaultEditorState,
  generateSlug,
  getContentStats,
  validateBlogPost,
} from "@/data/blog-post";

import { BlogPostForm } from "@/components/blog/new-post/blog-post-form";
import { BlogPostSidebar } from "@/components/blog/new-post/blog-post-sidebar";
import { BlogPostActions } from "@/components/blog/new-post/blog-post-actions";
import { BlogPostPreview } from "@/components/blog/new-post/blog-post-preview";
import { JsonImport } from "@/components/blog/new-post/json-import";

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
  const [useJsonImport, setUseJsonImport] = useState(false);

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

  const handleJsonImport = (importedData: BlogPostFormData) => {
    setFormData(importedData);
    setUseJsonImport(false);
    setErrors({});
    
    // Update content stats for imported data
    const stats = getContentStats(importedData.content);
    setEditorState((prev) => ({
      ...prev,
      ...stats,
      isDirty: true,
    }));
  };

  const handleCancelJsonImport = () => {
    setUseJsonImport(false);
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

  return (
    <PageTitle
      title="New Post"
      description="Create a new blog post with rich text editor"
      actions={
        <BlogPostActions
          showPreview={showPreview}
          isSaving={isSaving}
          hasContent={!!formData.content}
          hasTitle={!!formData.title}
          useJsonImport={useJsonImport}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onSave={() => handleSave()}
          onPublish={handlePublish}
          onToggleJsonImport={() => setUseJsonImport(!useJsonImport)}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {useJsonImport ? (
            <JsonImport
              onImport={handleJsonImport}
              onCancel={handleCancelJsonImport}
            />
          ) : (
            <>
              <BlogPostForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onContentChange={handleContentChange}
              />

              {/* Preview */}
              {showPreview && <BlogPostPreview content={formData.content} />}
            </>
          )}
        </div>

        {/* Sidebar */}
        {!useJsonImport && (
          <BlogPostSidebar
            formData={formData}
            editorState={editorState}
            errors={errors}
            onInputChange={handleInputChange}
          />
        )}
      </div>
    </PageTitle>
  );
}
