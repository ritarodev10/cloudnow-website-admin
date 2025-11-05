"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Testimonial,
  TestimonialFormData,
  TestimonialCategory,
} from "@/types/testimonials";
import { useTestimonialCategories } from "../_hooks/queries/use-testimonial-categories";
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
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { testimonialFormSchema } from "./testimonial-form-schema";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  loading?: boolean;
}

export function TestimonialForm({
  testimonial,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: TestimonialFormProps) {
  const form = useForm<z.infer<typeof testimonialFormSchema>>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      testimony: "",
      image: "",
      rating: 5,
      categories: [],
      isVisible: false,
    },
    mode: "onChange",
  });

  const rating = form.watch("rating");
  const categories = form.watch("categories");
  const isVisible = form.watch("isVisible");

  // Fetch categories using React Query
  const {
    data: availableCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useTestimonialCategories({
    enabled: open, // Only fetch when modal is open
  });

  // Reset form when testimonial changes
  useEffect(() => {
    if (testimonial) {
      form.reset({
        name: testimonial.name,
        title: testimonial.title,
        company: testimonial.company,
        testimony: testimonial.testimony,
        image: testimonial.image || "",
        rating: testimonial.rating,
        categories: testimonial.categories,
        isVisible: testimonial.isVisible,
      });
    } else {
      form.reset({
        name: "",
        title: "",
        company: "",
        testimony: "",
        image: "",
        rating: 5,
        categories: [],
        isVisible: false,
      });
    }
  }, [testimonial, open, form]);

  const handleCategoryToggle = (category: TestimonialCategory) => {
    const currentCategories = categories || [];
    if (currentCategories.includes(category)) {
      form.setValue(
        "categories",
        currentCategories.filter((c) => c !== category),
        { shouldValidate: true }
      );
    } else {
      form.setValue("categories", [...currentCategories, category], {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveCategory = (category: TestimonialCategory) => {
    const currentCategories = categories || [];
    form.setValue(
      "categories",
      currentCategories.filter((c) => c !== category),
      { shouldValidate: true }
    );
  };

  const onFormSubmit = async (data: z.infer<typeof testimonialFormSchema>) => {
    // Convert to TestimonialFormData
    // Categories are validated as strings by Zod, we cast them as TestimonialCategory[]
    // since the UI ensures only valid categories are selected
    const formData: TestimonialFormData = {
      name: data.name,
      title: data.title,
      company: data.company,
      testimony: data.testimony,
      image: data.image || undefined,
      rating: data.rating,
      categories: data.categories as TestimonialCategory[],
      isVisible: data.isVisible,
    };
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="enhanced" className="max-w-4xl">
        <DialogHeader variant="enhanced" className="text-left pb-3 shrink-0">
          <DialogTitle variant="enhanced" className="text-xl">
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription variant="enhanced" className="text-sm mt-1">
            {testimonial
              ? "Update the testimonial information below to reflect the latest feedback."
              : "Share valuable customer feedback by adding a new testimonial to showcase your services."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="px-6 py-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto"
          >
            {/* Personal Information Section */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        Name <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name"
                          className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title/Position */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        Title/Position{" "}
                        <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., CEO, CTO, Manager"
                          className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company and Rating side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Company */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5 flex flex-col">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        Company{" "}
                        <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter company name"
                          className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rating */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5 flex flex-col">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        Rating{" "}
                        <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <Select
                        value={field.value?.toString() || "5"}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-[40px] bg-background border-input/60 transition-all hover:border-input data-[size=default]:h-[40px]">
                            <SelectValue>
                              <div className="flex items-center gap-2.5">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= (field.value || 5);
                                    return (
                                      <i
                                        key={star}
                                        className={cn(
                                          isFilled
                                            ? "ri-star-fill"
                                            : "ri-star-line",
                                          "text-sm transition-colors",
                                          isFilled
                                            ? "text-amber-400"
                                            : "text-muted-foreground/30"
                                        )}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {field.value || 5}{" "}
                                  {field.value === 1 ? "Star" : "Stars"}
                                </span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((starValue) => (
                            <SelectItem
                              key={starValue}
                              value={starValue.toString()}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= starValue;
                                    return (
                                      <i
                                        key={star}
                                        className={cn(
                                          isFilled
                                            ? "ri-star-fill"
                                            : "ri-star-line",
                                          "text-sm transition-colors",
                                          isFilled
                                            ? "text-amber-400"
                                            : "text-muted-foreground/30"
                                        )}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-sm">
                                  {starValue}{" "}
                                  {starValue === 1 ? "Star" : "Stars"}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Testimony */}
              <FormField
                control={form.control}
                name="testimony"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-medium text-foreground/90">
                      Testimony{" "}
                      <span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the customer testimonial..."
                        rows={2}
                        className="bg-background border-input/60 transition-all hover:border-input focus:border-ring resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-medium text-foreground/90">
                      Image URL
                      <span className="text-muted-foreground/60 text-xs font-normal ml-2">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Divider */}
            <div className="border-t border-border/50"></div>
            {/* Groups */}
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-sm font-medium text-foreground/90">
                    Groups <span className="text-destructive ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2.5">
                      {categoriesLoading && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Loading groups...
                        </p>
                      )}
                      {categoriesError && (
                        <p className="text-sm text-destructive">
                          {categoriesError instanceof Error
                            ? categoriesError.message
                            : "Failed to load groups"}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {availableCategories.map((category) => {
                          const isSelected = field.value?.includes(category);
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                const currentCategories = field.value || [];
                                if (currentCategories.includes(category)) {
                                  field.onChange(
                                    currentCategories.filter(
                                      (c) => c !== category
                                    )
                                  );
                                } else {
                                  field.onChange([
                                    ...currentCategories,
                                    category,
                                  ]);
                                }
                              }}
                              disabled={categoriesLoading}
                              className={cn(
                                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                                  : "bg-background border-input/60 text-foreground/80 hover:bg-accent/50 hover:border-input hover:scale-[1.01]",
                                categoriesLoading &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {category}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Divider */}
            <div className="border-t border-border/50"></div>
            {/* Visibility Toggle */}
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-muted/40">
                  <div className="space-y-1 pr-4">
                    <FormLabel className="text-sm font-medium text-foreground/90 cursor-pointer">
                      Visible to public
                    </FormLabel>
                    <FormDescription className="text-xs text-muted-foreground/70">
                      When enabled, this testimonial will be displayed on your
                      public website for visitors to see.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter variant="enhanced">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-10 min-w-[140px]"
              >
                {loading
                  ? "Saving..."
                  : testimonial
                  ? "Update Testimonial"
                  : "Create Testimonial"}
              </Button>
            </DialogFooter>{" "}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
