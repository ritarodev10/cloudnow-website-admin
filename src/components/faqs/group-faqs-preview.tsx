"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FAQGroup } from "@/types/faqs";
import { getFaqsByGroupId } from "@/data/faq-groups";
import { HelpCircle } from "lucide-react";

interface GroupFAQsPreviewProps {
  group: FAQGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupFAQsPreview({ group, open, onOpenChange }: GroupFAQsPreviewProps) {
  if (!group) return null;
  
  const groupFaqs = getFaqsByGroupId(group.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {group.name}
          </DialogTitle>
          <DialogDescription>{group.description || "Preview of FAQs in this group"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {groupFaqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No FAQs in this group</div>
          ) : (
            groupFaqs.map((faq, index) => (
              <div key={faq.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-sm">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    <div className="flex flex-wrap gap-1">
                      {faq.categories.map((category: string) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant={faq.isVisible ? "default" : "secondary"} className="text-xs">
                    {faq.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
