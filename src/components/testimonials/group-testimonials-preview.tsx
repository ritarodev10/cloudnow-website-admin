"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TestimonialGroup, Testimonial } from "@/types/testimonials";
import { getTestimonialsByGroupId } from "@/data/testimonial-groups";
import { Star, Quote } from "lucide-react";

interface GroupTestimonialsPreviewProps {
  group: TestimonialGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupTestimonialsPreview({ group, open, onOpenChange }: GroupTestimonialsPreviewProps) {
  const [testimonials] = useState<Testimonial[]>(() => group ? getTestimonialsByGroupId(group.id) : []);

  if (!group) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            {group.name}
          </DialogTitle>
          <DialogDescription>{group.description || "Preview of testimonials in this group"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Info */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h3 className="font-medium">{group.name}</h3>
              {group.description && <p className="text-sm text-muted-foreground mt-1">{group.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={group.isActive ? "default" : "secondary"}>{group.isActive ? "Active" : "Inactive"}</Badge>
              <Badge variant="outline">
                {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {/* Testimonials Grid */}
          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No testimonials in this group</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title} at {testimonial.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(testimonial.rating)}</div>
                  </div>

                  {/* Testimony */}
                  <div className="text-sm leading-relaxed">&ldquo;{testimonial.testimony}&rdquo;</div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {testimonial.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {/* Order indicator */}
                  <div className="text-xs text-muted-foreground">Order: {index + 1}</div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
