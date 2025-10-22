"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Testimonial, TestimonialFormData, TestimonialCategory } from "@/types/testimonials";
import { testimonialCategories, validateTestimonialForm } from "@/data/testimonials";
import { Star, X, Plus } from "lucide-react";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialFormData) => void;
  loading?: boolean;
}

export function TestimonialForm({ testimonial, open, onOpenChange, onSubmit, loading = false }: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: testimonial?.name || "",
    title: testimonial?.title || "",
    company: testimonial?.company || "",
    testimony: testimonial?.testimony || "",
    image: testimonial?.image || "",
    rating: testimonial?.rating || 5,
    categories: testimonial?.categories || [],
    isVisible: testimonial?.isVisible ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTestimonialForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Add any new categories to the global categories list
      formData.categories.forEach((category) => {
        if (!testimonialCategories.includes(category)) {
          testimonialCategories.push(category);
        }
      });

      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof TestimonialFormData,
    value: string | number | boolean | TestimonialCategory[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryToggle = (category: TestimonialCategory) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category];

    handleInputChange("categories", newCategories);
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    console.log("Adding testimonial category:", trimmedCategory);
    console.log("Current categories:", formData.categories);
    
    if (trimmedCategory && trimmedCategory.length >= 2 && trimmedCategory.length <= 50) {
      // Check if category already exists in current testimonial
      if (!formData.categories.includes(trimmedCategory as TestimonialCategory)) {
        // Add to current testimonial's categories (will be saved when testimonial is saved)
        const newCategories = [...formData.categories, trimmedCategory as TestimonialCategory];
        console.log("New categories array:", newCategories);
        handleInputChange("categories", newCategories);
      }
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleCancelAddCategory = () => {
    setNewCategory("");
    setIsAddingCategory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleClose = () => {
    setFormData({
      name: testimonial?.name || "",
      title: testimonial?.title || "",
      company: testimonial?.company || "",
      testimony: testimonial?.testimony || "",
      image: testimonial?.image || "",
      rating: testimonial?.rating || 5,
      categories: testimonial?.categories || [],
      isVisible: testimonial?.isVisible ?? true,
    });
    setErrors({});
    onOpenChange(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {testimonial
              ? "Update the testimonial information below."
              : "Fill in the details to create a new testimonial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title/Position *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., CEO, CTO, Manager"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Enter company name"
              className={errors.company ? "border-destructive" : ""}
            />
            {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
          </div>

          {/* Testimony */}
          <div className="space-y-2">
            <Label htmlFor="testimony">Testimony *</Label>
            <textarea
              id="testimony"
              value={formData.testimony}
              onChange={(e) => handleInputChange("testimony", e.target.value)}
              placeholder="Enter the customer testimonial..."
              rows={4}
              className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.testimony ? "border-destructive" : ""
              }`}
            />
            {errors.testimony && <p className="text-sm text-destructive">{errors.testimony}</p>}
          </div>

          {/* Rating and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating *</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => handleInputChange("rating", parseInt(value))}
              >
                <SelectTrigger className={errors.rating ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        {renderStars(rating)}
                        <span>
                          {rating} Star{rating !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? "border-destructive" : ""}
              />
              {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories *</Label>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <Badge
                  key={category}
                  variant="default"
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              
              {testimonialCategories.filter(cat => !formData.categories.includes(cat)).map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Badge>
              ))}

              {/* Add Category Button/Form */}
              {isAddingCategory ? (
                <div className="flex gap-1">
                  <Input
                    placeholder="New category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-6 px-2 text-xs"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim() || newCategory.trim().length < 2}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAddCategory}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/80 border-dashed"
                  onClick={() => setIsAddingCategory(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Badge>
              )}
            </div>
            {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => handleInputChange("isVisible", checked)}
            />
            <Label htmlFor="isVisible">Visible to public</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : testimonial ? "Update Testimonial" : "Create Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

