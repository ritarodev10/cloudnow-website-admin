"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import { ContentStats } from "../_components/content-stats";
import {
  postFormSchema,
  PostFormSchema,
} from "../_components/post-form-schema";
import { PostStatus } from "@/types/posts";
import { useCategories } from "../categories/_hooks/queries/use-categories";
import { useTags } from "../tags/_hooks/queries/use-tags";
import { BlogCategory } from "@/types/categories";
import { Tag } from "@/types/tags";

export function NewPostClientPage() {
  // Fetch categories and tags from the database
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  // Filter only active categories
  const activeCategories = categories.filter(
    (cat: BlogCategory) => cat.isActive
  );

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      featured: false,
      pinned: false,
      allowComments: true,
      category: "",
      tags: [],
    },
    mode: "onChange",
  });

  const title = form.watch("title");
  const content = form.watch("content");
  const selectedTags = form.watch("tags");

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [title, form]);

  const handleTagToggle = (tagName: string) => {
    const currentTags = selectedTags || [];
    if (currentTags.includes(tagName)) {
      form.setValue(
        "tags",
        currentTags.filter((t) => t !== tagName),
        { shouldValidate: true }
      );
    } else {
      form.setValue("tags", [...currentTags, tagName], {
        shouldValidate: true,
      });
    }
  };

  const handleSaveDraft = async (data: PostFormSchema) => {
    const draftData = { ...data, status: "draft" as PostStatus };
    console.log("Saving draft:", draftData);
    // TODO: Implement API call
  };

  const handlePublish = async (data: PostFormSchema) => {
    const publishData = { ...data, status: "published" as PostStatus };
    console.log("Publishing:", publishData);
    // TODO: Implement API call
  };

  const handleJsonImport = () => {
    // TODO: Implement JSON import
    console.log("JSON Import clicked");
  };

  const handlePreview = () => {
    // TODO: Implement preview
    console.log("Preview clicked");
  };

  const onSubmit = async (data: PostFormSchema) => {
    // This will be handled by Save Draft or Publish buttons
    console.log("Form submitted:", data);
  };

  return (
    <PageTitle
      title="New Post"
      description="Create a new blog post with rich text editor"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleJsonImport}
            className="h-10"
          >
            <i className="ri-file-text-line mr-2" />
            JSON Import
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="h-10"
          >
            <i className="ri-eye-line mr-2" />
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit(handleSaveDraft)}
            className="h-10"
          >
            <i className="ri-save-line mr-2" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handlePublish)}
            className="h-10 bg-primary"
          >
            <i className="ri-global-line mr-2" />
            Publish
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              {/* Post Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Title <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog post title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Auto-generated from title. You can edit it manually.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the post..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Content <span className="text-destructive">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TipTapEditor
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Form>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <Form {...form}>
              {/* Status & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Featured Post
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pinned"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Pinned Post
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowComments"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            Allow Comments
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentStats content={content} />
                </CardContent>
              </Card>

              {/* Category & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Category & Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={categoriesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  categoriesLoading
                                    ? "Loading categories..."
                                    : "Select category"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activeCategories.length === 0 &&
                            !categoriesLoading ? (
                              <SelectItem value="no-categories" disabled>
                                No categories available
                              </SelectItem>
                            ) : (
                              activeCategories.map((category: BlogCategory) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tags <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {tagsLoading ? (
                              <div className="text-sm text-muted-foreground">
                                Loading tags...
                              </div>
                            ) : tags.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No tags available
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag: Tag) => {
                                  const isSelected = field.value?.includes(
                                    tag.name
                                  );
                                  return (
                                    <button
                                      key={tag.id}
                                      type="button"
                                      onClick={() => handleTagToggle(tag.name)}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                        isSelected
                                          ? "bg-primary text-primary-foreground border-primary"
                                          : "bg-background border-input hover:bg-accent"
                                      }`}
                                    >
                                      {tag.name}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Form>
          </div>
        </div>
      </form>
    </PageTitle>
  );
}
