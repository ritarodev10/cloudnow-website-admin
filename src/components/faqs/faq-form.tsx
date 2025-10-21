"use client";

import { useState } from "react";
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
import { FAQ, FAQFormData, FAQCategory } from "@/types/faqs";
import { faqCategories, validateFaqForm } from "@/data/faqs";
import { X } from "lucide-react";

interface FAQFormProps {
  faq?: FAQ;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FAQFormData) => void;
  loading?: boolean;
}

export function FAQForm({ faq, open, onOpenChange, onSubmit, loading = false }: FAQFormProps) {
  const [formData, setFormData] = useState<FAQFormData>({
    question: faq?.question || "",
    answer: faq?.answer || "",
    categories: faq?.categories || [],
    isVisible: faq?.isVisible ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateFaqForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FAQFormData, value: string | boolean | FAQCategory[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryToggle = (category: FAQCategory) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category];

    handleInputChange("categories", newCategories);
  };

  const handleClose = () => {
    setFormData({
      question: faq?.question || "",
      answer: faq?.answer || "",
      categories: faq?.categories || [],
      isVisible: faq?.isVisible ?? true,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          <DialogDescription>
            {faq ? "Update the FAQ information below." : "Fill in the details to create a new FAQ."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              placeholder="Enter the frequently asked question"
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => handleInputChange("answer", e.target.value)}
              placeholder="Enter the answer to the question..."
              rows={6}
              className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.answer ? "border-destructive" : ""
              }`}
            />
            {errors.answer && <p className="text-sm text-destructive">{errors.answer}</p>}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories *</Label>
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <Badge
                  key={category}
                  variant={formData.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  {formData.categories.includes(category) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
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
              {loading ? "Saving..." : faq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
