"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FAQ, FAQFormData } from "@/types/faqs";
import { useFAQGroups } from "../_hooks/queries/use-faq-groups";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { faqFormSchema, FAQFormSchema } from "./faq-form-schema";

interface FAQFormProps {
  faq?: FAQ;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FAQFormData) => Promise<void>;
  loading?: boolean;
}

export function FAQForm({
  faq,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: FAQFormProps) {
  const form = useForm<FAQFormSchema>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      groupId: "",
      question: "",
      answer: "",
      order: 0,
    },
    mode: "onChange",
  });

  // Fetch groups using React Query
  const {
    data: groups = [],
    isLoading: groupsLoading,
  } = useFAQGroups({
    enabled: open, // Only fetch when modal is open
  });

  // Reset form when FAQ changes
  useEffect(() => {
    if (faq) {
      form.reset({
        groupId: faq.groupId,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      });
    } else {
      form.reset({
        groupId: "",
        question: "",
        answer: "",
        order: 0,
      });
    }
  }, [faq, open, form]);

  const onFormSubmit = async (data: FAQFormSchema) => {
    const formData: FAQFormData = {
      groupId: data.groupId,
      question: data.question,
      answer: data.answer,
      order: data.order,
    };
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="enhanced" className="max-w-4xl">
        <DialogHeader variant="enhanced" className="text-left pb-3 shrink-0">
          <DialogTitle variant="enhanced" className="text-xl">
            {faq ? "Edit FAQ" : "Create FAQ"}
          </DialogTitle>
          <DialogDescription variant="enhanced" className="text-sm mt-1">
            {faq
              ? "Edit the FAQ question and answer."
              : "Create a new FAQ by providing a question, answer, and assigning it to a group."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="faq-form"
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="px-6 py-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto"
          >
            {/* Group Selection */}
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground/90">
                    Group{" "}
                    <span className="text-destructive ml-0.5">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={groupsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.groupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground/90">
                    Question{" "}
                    <span className="text-destructive ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter question"
                      className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-sm font-medium text-foreground/90">
                    Answer{" "}
                    <span className="text-destructive ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter answer..."
                      rows={6}
                      className="bg-background border-input/60 transition-all hover:border-input focus:border-ring resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground/90">
                    Order
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-10 bg-background border-input/60 transition-all hover:border-input focus:border-ring"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Order within the group (lower numbers appear first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            form="faq-form"
            disabled={loading}
            className="h-10 min-w-[140px]"
          >
            {loading ? "Saving..." : faq ? "Update FAQ" : "Create FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


