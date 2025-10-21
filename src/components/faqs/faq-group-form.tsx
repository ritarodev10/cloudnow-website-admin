"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FAQGroup, FAQGroupFormData, FAQ } from "@/types/faqs";
import { faqs } from "@/data/faqs";
import { validateGroupForm } from "@/data/faq-groups";
import { GripVertical, HelpCircle } from "lucide-react";

interface FAQGroupFormProps {
  group?: FAQGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FAQGroupFormData) => void;
  loading?: boolean;
}

export function FAQGroupForm({ group, open, onOpenChange, onSubmit, loading = false }: FAQGroupFormProps) {
  const [formData, setFormData] = useState<FAQGroupFormData>({
    name: group?.name || "",
    description: group?.description || "",
    faqIds: group?.faqIds || [],
    order: group?.order || [],
    isActive: group?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: group?.name || "",
      description: group?.description || "",
      faqIds: group?.faqIds || [],
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

  const handleInputChange = (field: keyof FAQGroupFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFaqToggle = (faqId: string) => {
    const newFaqIds = formData.faqIds.includes(faqId)
      ? formData.faqIds.filter((id) => id !== faqId)
      : [...formData.faqIds, faqId];

    // Update order to match new selection
    const newOrder = newFaqIds.filter((id) => formData.order.includes(id));

    handleInputChange("faqIds", newFaqIds);
    handleInputChange("order", newOrder);
  };

  const handleOrderChange = (faqId: string, direction: "up" | "down") => {
    const currentIndex = formData.order.indexOf(faqId);
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
      faqIds: group?.faqIds || [],
      order: group?.order || [],
      isActive: group?.isActive ?? true,
    });
    setErrors({});
    onOpenChange(false);
  };

  const getSelectedFaqs = () => {
    return formData.order.map((id) => faqs.find((f) => f.id === id)).filter((faq): faq is FAQ => faq !== undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{group ? "Edit FAQ Group" : "Create FAQ Group"}</DialogTitle>
          <DialogDescription>
            {group
              ? "Update the group information and FAQ selection."
              : "Create a new group by selecting FAQs and organizing them."}
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

          {/* FAQ Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select FAQs *</Label>
              <Badge variant="secondary">{formData.faqIds.length} selected</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`flex items-start space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    formData.faqIds.includes(faq.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleFaqToggle(faq.id)}
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{faq.question}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {faq.answer.substring(0, 100)}...
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {faq.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {formData.faqIds.includes(faq.id) && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {errors.faqIds && <p className="text-sm text-destructive">{errors.faqIds}</p>}
          </div>

          {/* Order Management */}
          {formData.faqIds.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>FAQ Order</Label>
                <Badge variant="outline">Drag to reorder (coming soon)</Badge>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-4">
                {getSelectedFaqs().map((faq, index) => (
                  <div key={faq.id} className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium w-6">{index + 1}.</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{faq.question}</div>
                      <div className="text-xs text-muted-foreground truncate">{faq.categories.join(", ")}</div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleOrderChange(faq.id, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleOrderChange(faq.id, "down")}
                        disabled={index === getSelectedFaqs().length - 1}
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
