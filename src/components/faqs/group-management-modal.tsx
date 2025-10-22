"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FAQ, FAQGroup, FAQCategory } from "@/types/faqs";
import { faqCategories, generateFaqId, validateFaqForm } from "@/data/faqs";
import { generateGroupId } from "@/data/faq-groups";
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, X, Save, XCircle } from "lucide-react";

interface GroupManagementModalProps {
  group?: FAQGroup; // undefined for create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (groupData: { name: string; description?: string }, faqs: FAQ[]) => void;
  existingFaqs?: FAQ[]; // FAQs that belong to this group
}

interface FAQCardProps {
  faq: FAQ;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (faq: FAQ) => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function FAQCard({
  faq,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: FAQCardProps) {
  const [editData, setEditData] = useState({
    question: faq.question,
    answer: faq.answer,
    categories: faq.categories,
    isVisible: faq.isVisible,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryToggle = (category: FAQCategory) => {
    const newCategories = editData.categories.includes(category)
      ? editData.categories.filter((c) => c !== category)
      : [...editData.categories, category];
    setEditData((prev) => ({ ...prev, categories: newCategories }));
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    console.log("Adding category:", trimmedCategory);
    console.log("Current categories:", editData.categories);
    
    if (trimmedCategory && trimmedCategory.length >= 2 && trimmedCategory.length <= 50) {
      // Check if category already exists in current FAQ
      if (!editData.categories.includes(trimmedCategory as FAQCategory)) {
        // Add to current FAQ's categories (will be saved when FAQ is saved)
        const newCategories = [...editData.categories, trimmedCategory as FAQCategory];
        console.log("New categories array:", newCategories);
        setEditData((prev) => ({ ...prev, categories: newCategories }));
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

  const handleSave = () => {
    const validationErrors = validateFaqForm({
      ...editData,
      groupId: faq.groupId,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Add any new categories to the global categories list
      editData.categories.forEach((category) => {
        if (!faqCategories.includes(category)) {
          faqCategories.push(category);
        }
      });

      onSave({
        ...faq,
        ...editData,
        updatedAt: new Date(),
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      question: faq.question,
      answer: faq.answer,
      categories: faq.categories,
      isVisible: faq.isVisible,
    });
    setErrors({});
    onCancel();
  };

  if (isEditing) {
    return (
      <Card className="border-primary">
        <CardContent className="p-4 space-y-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor={`question-${faq.id}`}>Question *</Label>
            <Input
              id={`question-${faq.id}`}
              value={editData.question}
              onChange={(e) => setEditData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the frequently asked question"
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor={`answer-${faq.id}`}>Answer *</Label>
            <textarea
              id={`answer-${faq.id}`}
              value={editData.answer}
              onChange={(e) => setEditData((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the answer to the question..."
              rows={4}
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
              {editData.categories.map((category) => (
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
              
              {faqCategories.filter(cat => !editData.categories.includes(cat)).map((category) => (
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
              id={`visible-${faq.id}`}
              checked={editData.isVisible}
              onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isVisible: checked }))}
            />
            <Label htmlFor={`visible-${faq.id}`}>Visible to public</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Reorder Controls */}
          <div className="flex flex-col gap-1 mt-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onMoveUp} disabled={!canMoveUp}>
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onMoveDown} disabled={!canMoveDown}>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm">{faq.question}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={faq.isVisible ? "default" : "secondary"} className="text-xs">
                  {faq.isVisible ? "Visible" : "Hidden"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            <div className="flex flex-wrap gap-1">
              {faq.categories.map((category: string) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onToggleVisibility} className="h-8 w-8 p-0">
              {faq.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GroupManagementModal({
  group,
  open,
  onOpenChange,
  onSave,
  existingFaqs = [],
}: GroupManagementModalProps) {
  const isCreateMode = !group;

  // Group state
  const [groupName, setGroupName] = useState(group?.name || "");
  const [groupDescription, setGroupDescription] = useState(group?.description || "");

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>(existingFaqs);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  // Reset state when modal opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setGroupName(group?.name || "");
      setGroupDescription(group?.description || "");
      setFaqs(existingFaqs);
      setEditingFaqId(null);
      setDeletingFaqId(null);
    }
    onOpenChange(newOpen);
  };

  const handleAddFaq = () => {
    const newFaq: FAQ = {
      id: generateFaqId(),
      question: "",
      answer: "",
      categories: [],
      isVisible: true,
      groupId: group?.id || "temp", // Will be updated when group is saved
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFaqs((prev) => [...prev, newFaq]);
    setEditingFaqId(newFaq.id);
  };

  const handleEditFaq = (faqId: string) => {
    setEditingFaqId(faqId);
  };

  const handleSaveFaq = (updatedFaq: FAQ) => {
    setFaqs((prev) => prev.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq)));
    setEditingFaqId(null);
  };

  const handleCancelFaq = () => {
    setEditingFaqId(null);
  };

  const handleDeleteFaq = (faqId: string) => {
    setDeletingFaqId(faqId);
  };

  const confirmDeleteFaq = () => {
    if (deletingFaqId) {
      setFaqs((prev) => prev.filter((faq) => faq.id !== deletingFaqId));
      setDeletingFaqId(null);
    }
  };

  const handleToggleVisibility = (faqId: string) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === faqId ? { ...faq, isVisible: !faq.isVisible, updatedAt: new Date() } : faq))
    );
  };

  const handleMoveUp = (faqId: string) => {
    const currentIndex = faqs.findIndex((faq) => faq.id === faqId);
    if (currentIndex > 0) {
      const newFaqs = [...faqs];
      [newFaqs[currentIndex - 1], newFaqs[currentIndex]] = [newFaqs[currentIndex], newFaqs[currentIndex - 1]];
      setFaqs(newFaqs);
    }
  };

  const handleMoveDown = (faqId: string) => {
    const currentIndex = faqs.findIndex((faq) => faq.id === faqId);
    if (currentIndex < faqs.length - 1) {
      const newFaqs = [...faqs];
      [newFaqs[currentIndex], newFaqs[currentIndex + 1]] = [newFaqs[currentIndex + 1], newFaqs[currentIndex]];
      setFaqs(newFaqs);
    }
  };

  const handleSave = () => {
    // Validate group name
    if (!groupName.trim()) {
      return; // Could add error handling here
    }

    // Update FAQ groupIds if this is a new group
    const groupId = group?.id || generateGroupId();
    const faqsWithGroupId = faqs.map((faq) => ({
      ...faq,
      groupId,
    }));

    onSave(
      {
        name: groupName.trim(),
        description: groupDescription.trim() || undefined,
      },
      faqsWithGroupId
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{isCreateMode ? "Create FAQ Group" : "Edit FAQ Group"}</DialogTitle>
            <DialogDescription>
              {isCreateMode
                ? "Create a new FAQ group and add FAQs to it."
                : "Edit the group information and manage its FAQs."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Group Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-description">Description (Optional)</Label>
                <textarea
                  id="group-description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* FAQs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">FAQs ({faqs.length})</h3>
                <Button onClick={handleAddFaq} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>

              {faqs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    No FAQs in this group yet. Click "Add FAQ" to get started.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <FAQCard
                      key={faq.id}
                      faq={faq}
                      isEditing={editingFaqId === faq.id}
                      onEdit={() => handleEditFaq(faq.id)}
                      onSave={handleSaveFaq}
                      onCancel={handleCancelFaq}
                      onDelete={() => handleDeleteFaq(faq.id)}
                      onToggleVisibility={() => handleToggleVisibility(faq.id)}
                      onMoveUp={() => handleMoveUp(faq.id)}
                      onMoveDown={() => handleMoveDown(faq.id)}
                      canMoveUp={index > 0}
                      canMoveDown={index < faqs.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{isCreateMode ? "Create Group" : "Update Group"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete FAQ Confirmation */}
      <AlertDialog open={!!deletingFaqId} onOpenChange={() => setDeletingFaqId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFaq}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
