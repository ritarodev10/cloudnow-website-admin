"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TestimonialGroup,
  TestimonialGroupFormData,
} from "@/types/testimonials";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const testimonialGroupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

interface TestimonialGroupFormProps {
  group?: TestimonialGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialGroupFormData) => Promise<void>;
  loading?: boolean;
}

export function TestimonialGroupForm({
  group,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: TestimonialGroupFormProps) {
  const form = useForm<z.infer<typeof testimonialGroupFormSchema>>({
    resolver: zodResolver(testimonialGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [group, open, form]);

  const onFormSubmit = async (
    data: z.infer<typeof testimonialGroupFormSchema>
  ) => {
    // Convert to TestimonialGroupFormData
    // For new groups, isActive should be false by default
    // For existing groups, keep the existing isActive value
    const formData: TestimonialGroupFormData = {
      name: data.name,
      description: data.description || undefined,
      testimonialIds: [], // Empty as requested
      order: [], // Empty as requested
      isActive: group ? group.isActive : false, // Inactive by default for new groups
    };
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="enhanced" className="max-w-4xl">
        <DialogHeader variant="enhanced" className="text-left pb-3 shrink-0">
          <DialogTitle variant="enhanced" className="text-xl">
            {group ? "Edit Testimonial Group" : "Create Testimonial Group"}
          </DialogTitle>
          <DialogDescription variant="enhanced" className="text-sm mt-1">
            {group
              ? "Update the group information."
              : "Create a new testimonial group by providing a name and optional description."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="testimonial-group-form"
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="px-6 py-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto"
          >
            {/* Basic Information */}
            <div className="space-y-3">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground/90">
                      Group Name{" "}
                      <span className="text-destructive ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter group name"
                        className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-medium text-foreground/90">
                      Description
                      <span className="text-muted-foreground/60 text-xs font-normal ml-2">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter group description..."
                        rows={2}
                        className="bg-background border-input/60 transition-all hover:border-input focus:border-ring resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
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
            form="testimonial-group-form"
            disabled={loading}
            className="h-10 min-w-[140px]"
          >
            {loading ? "Saving..." : group ? "Update Group" : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
