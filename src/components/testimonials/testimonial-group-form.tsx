"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestimonialGroup, TestimonialGroupFormData, Testimonial } from "@/types/testimonials";
import { testimonials } from "@/data/testimonials";
import { validateGroupForm } from "@/data/testimonial-groups";
import { X, GripVertical, UsersIcon } from "lucide-react";

interface TestimonialGroupFormProps {
  group?: TestimonialGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialGroupFormData) => void;
  loading?: boolean;
}

export function TestimonialGroupForm({
  group,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: TestimonialGroupFormProps) {
  const [formData, setFormData] = useState<TestimonialGroupFormData>({
    name: group?.name || "",
    description: group?.description || "",
    testimonialIds: group?.testimonialIds || [],
    order: group?.order || [],
    isActive: group?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>(testimonials);

  useEffect(() => {
    setFormData({
      name: group?.name || "",
      description: group?.description || "",
      testimonialIds: group?.testimonialIds || [],
      order: group?.order || [],
      isActive: group?.isActive ?? true,
    });
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateGroupForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof TestimonialGroupFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTestimonialToggle = (testimonialId: string) => {
    const newTestimonialIds = formData.testimonialIds.includes(testimonialId)
      ? formData.testimonialIds.filter((id) => id !== testimonialId)
      : [...formData.testimonialIds, testimonialId];

    // Update order to match new selection
    const newOrder = newTestimonialIds.filter((id) => formData.order.includes(id));

    handleInputChange("testimonialIds", newTestimonialIds);
    handleInputChange("order", newOrder);
  };

  const handleOrderChange = (testimonialId: string, direction: "up" | "down") => {
    const currentIndex = formData.order.indexOf(testimonialId);
    if (currentIndex === -1) return;

    const newOrder = [...formData.order];
    if (direction === "up" && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
    } else if (direction === "down" && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    }

    handleInputChange("order", newOrder);
  };

  const handleClose = () => {
    setFormData({
      name: group?.name || "",
      description: group?.description || "",
      testimonialIds: group?.testimonialIds || [],
      order: group?.order || [],
      isActive: group?.isActive ?? true,
    });
    setErrors({});
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSelectedTestimonials = () => {
    return formData.order
      .map((id) => testimonials.find((t) => t.id === id))
      .filter((testimonial): testimonial is Testimonial => testimonial !== undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Testimonial Group" : "Create Testimonial Group"}</DialogTitle>
          <DialogDescription>
            {group
              ? "Update the group information and testimonial selection."
              : "Create a new group by selecting testimonials and organizing them."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter group name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter group description"
                rows={3}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? "border-destructive" : ""
                }`}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
          </div>

          {/* Testimonial Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Testimonials *</Label>
              <Badge variant="secondary">{formData.testimonialIds.length} selected</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    formData.testimonialIds.includes(testimonial.id)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleTestimonialToggle(testimonial.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="text-xs">{getInitials(testimonial.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {testimonial.title} at {testimonial.company}
                    </div>
                  </div>
                  {formData.testimonialIds.includes(testimonial.id) && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {errors.testimonialIds && <p className="text-sm text-destructive">{errors.testimonialIds}</p>}
          </div>

          {/* Order Management */}
          {formData.testimonialIds.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Testimonial Order</Label>
                <Badge variant="outline">Drag to reorder (coming soon)</Badge>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-4">
                {getSelectedTestimonials().map((testimonial, index) => (
                  <div key={testimonial.id} className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium w-6">{index + 1}.</span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="text-xs">{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{testimonial.company}</div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleOrderChange(testimonial.id, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleOrderChange(testimonial.id, "down")}
                        disabled={index === getSelectedTestimonials().length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Active group</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : group ? "Update Group" : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

