"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tag, TagFormData } from "@/types/tags";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const tagFormSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name must be less than 50 characters"),
  slug: z
    .string()
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be a valid URL slug")
    .optional()
    .or(z.literal("")),
  description: z.string().max(200, "Description must be less than 200 characters").optional().or(z.literal("")),
});

interface TagFormProps {
  tag?: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TagFormData) => Promise<void>;
  loading?: boolean;
}

export function TagForm({
  tag,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: TagFormProps) {
  const form = useForm<z.infer<typeof tagFormSchema>>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
    mode: "onChange",
  });

  const name = form.watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !tag) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, tag, form]);

  // Reset form when tag changes
  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || "",
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [tag, open, form]);

  const handleSubmit = async (data: z.infer<typeof tagFormSchema>) => {
    await onSubmit({
      name: data.name.trim(),
      slug: data.slug?.trim() || undefined,
      description: data.description?.trim() || undefined,
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
          <DialogDescription>
            {tag
              ? "Update the tag information below."
              : "Add a new tag to organize your blog posts."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React, TypeScript, AWS"
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="auto-generated-from-name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Auto-generated from name. You can edit it manually.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description for this tag..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin" />
                    {tag ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {tag ? (
                      <>
                        <i className="ri-save-line mr-2" />
                        Update Tag
                      </>
                    ) : (
                      <>
                        <i className="ri-add-line mr-2" />
                        Create Tag
                      </>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}



