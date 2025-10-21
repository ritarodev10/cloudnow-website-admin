"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FAQ, FAQGroup, FAQFormData } from "@/types/faqs";
import { getFaqsByGroupId, generateFaqId } from "@/data/faqs";
import { HelpCircle, Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { FAQForm } from "./faq-form";
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

interface GroupFAQsModalProps {
  group: FAQGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFaqCreate: (faq: FAQ) => void;
  onFaqUpdate: (faq: FAQ) => void;
  onFaqDelete: (faqId: string) => void;
  onFaqReorder: (groupId: string, newOrder: string[]) => void;
}

export function GroupFAQsModal({
  group,
  open,
  onOpenChange,
  onFaqCreate,
  onFaqUpdate,
  onFaqDelete,
  onFaqReorder,
}: GroupFAQsModalProps) {
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | undefined>();
  const [deletingFaq, setDeletingFaq] = useState<FAQ | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Get FAQs for this group
  const groupFaqs = useMemo(() => {
    const faqs = getFaqsByGroupId(group.id);
    // Sort by the group's order array
    return faqs.sort((a, b) => {
      const aIndex = group.order.indexOf(a.id);
      const bIndex = group.order.indexOf(b.id);
      return aIndex - bIndex;
    });
  }, [group.id, group.order]);

  const handleAddFaq = () => {
    setEditingFaq(undefined);
    setIsFaqFormOpen(true);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsFaqFormOpen(true);
  };

  const handleFaqSubmit = async (formData: FAQFormData) => {
    setIsLoading(true);
    try {
      if (editingFaq) {
        // Update existing FAQ
        const updatedFaq: FAQ = {
          ...editingFaq,
          ...formData,
          updatedAt: new Date(),
        };
        onFaqUpdate(updatedFaq);
      } else {
        // Create new FAQ
        const newFaq: FAQ = {
          id: generateFaqId(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        onFaqCreate(newFaq);
      }
      setIsFaqFormOpen(false);
      setEditingFaq(undefined);
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFaq = (faq: FAQ) => {
    setDeletingFaq(faq);
  };

  const confirmDeleteFaq = () => {
    if (deletingFaq) {
      onFaqDelete(deletingFaq.id);
      setDeletingFaq(undefined);
    }
  };

  const handleToggleVisibility = (faq: FAQ) => {
    const updatedFaq: FAQ = {
      ...faq,
      isVisible: !faq.isVisible,
      updatedAt: new Date(),
    };
    onFaqUpdate(updatedFaq);
  };

  const handleMoveUp = (faqId: string) => {
    const currentIndex = group.order.indexOf(faqId);
    if (currentIndex > 0) {
      const newOrder = [...group.order];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
      onFaqReorder(group.id, newOrder);
    }
  };

  const handleMoveDown = (faqId: string) => {
    const currentIndex = group.order.indexOf(faqId);
    if (currentIndex < group.order.length - 1) {
      const newOrder = [...group.order];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      onFaqReorder(group.id, newOrder);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {group.name}
            </DialogTitle>
            <DialogDescription>
              {group.description || "Manage FAQs in this group"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Header with Add FAQ button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {groupFaqs.length} FAQ{groupFaqs.length !== 1 ? "s" : ""} in this group
              </div>
              <Button onClick={handleAddFaq} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            {/* FAQs List */}
            {groupFaqs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No FAQs in this group yet. Click "Add FAQ" to get started.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {groupFaqs.map((faq, index) => (
                  <Card key={faq.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Drag handle */}
                      <div className="flex flex-col gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleMoveUp(faq.id)}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleMoveDown(faq.id)}
                          disabled={index === groupFaqs.length - 1}
                        >
                          <GripVertical className="h-3 w-3 rotate-180" />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(faq)}
                          className="h-8 w-8 p-0"
                        >
                          {faq.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Form Modal */}
      <FAQForm
        faq={editingFaq}
        groupId={group.id}
        open={isFaqFormOpen}
        onOpenChange={setIsFaqFormOpen}
        onSubmit={handleFaqSubmit}
        loading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFaq} onOpenChange={() => setDeletingFaq(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the FAQ "{deletingFaq?.question}"? This action cannot be undone.
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
