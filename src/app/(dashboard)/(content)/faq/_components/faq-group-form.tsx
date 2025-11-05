"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FAQGroup,
  FAQGroupFormData,
} from "@/types/faqs";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const faqGroupFormSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  usagePaths: z.array(z.string()),
  isActive: z.boolean(),
});

interface FAQGroupFormProps {
  group?: FAQGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FAQGroupFormData) => Promise<void>;
  loading?: boolean;
}

export function FAQGroupForm({
  group,
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: FAQGroupFormProps) {
  const [usagePathInput, setUsagePathInput] = useState("");

  const form = useForm<z.infer<typeof faqGroupFormSchema>>({
    resolver: zodResolver(faqGroupFormSchema),
    defaultValues: {
      groupName: "",
      description: "",
      usagePaths: [],
      isActive: true,
    },
    mode: "onChange",
  });

  const usagePaths = form.watch("usagePaths");
  const isActive = form.watch("isActive");

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        groupName: group.groupName,
        description: group.description || "",
        usagePaths: group.usagePaths || [],
        isActive: group.isActive,
      });
    } else {
      form.reset({
        groupName: "",
        description: "",
        usagePaths: [],
        isActive: true,
      });
    }
    setUsagePathInput("");
  }, [group, open, form]);

  const handleAddUsagePath = () => {
    const trimmed = usagePathInput.trim();
    if (trimmed && !usagePaths.includes(trimmed)) {
      form.setValue("usagePaths", [...usagePaths, trimmed], {
        shouldValidate: true,
      });
      setUsagePathInput("");
    }
  };

  const handleRemoveUsagePath = (path: string) => {
    form.setValue(
      "usagePaths",
      usagePaths.filter((p) => p !== path),
      { shouldValidate: true }
    );
  };

  const onFormSubmit = async (
    data: z.infer<typeof faqGroupFormSchema>
  ) => {
    const formData: FAQGroupFormData = {
      groupName: data.groupName,
      description: data.description || undefined,
      usagePaths: data.usagePaths || [],
      isActive: data.isActive ?? true,
    };
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="enhanced" className="max-w-4xl">
        <DialogHeader variant="enhanced" className="text-left pb-3 shrink-0">
          <DialogTitle variant="enhanced" className="text-xl">
            {group ? "Edit FAQ Group" : "Create FAQ Group"}
          </DialogTitle>
          <DialogDescription variant="enhanced" className="text-sm mt-1">
            {group
              ? "Edit the group information and manage its FAQs."
              : "Create a new FAQ group by providing a name and optional description."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="faq-group-form"
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="px-6 py-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto"
          >
            {/* Basic Information */}
            <div className="space-y-3">
              {/* Name */}
              <FormField
                control={form.control}
                name="groupName"
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

              {/* Usage Paths */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/90">
                  Usage Paths
                  <span className="text-muted-foreground/60 text-xs font-normal ml-2">
                    (Optional)
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter usage path (e.g., /faq, /support)"
                    value={usagePathInput}
                    onChange={(e) => setUsagePathInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUsagePath();
                      }
                    }}
                    className="h-10"
                  />
                  <Button
                    type="button"
                    onClick={handleAddUsagePath}
                    variant="outline"
                    className="h-10"
                  >
                    Add
                  </Button>
                </div>
                {usagePaths.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {usagePaths.map((path) => (
                      <Badge
                        key={path}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleRemoveUsagePath(path)}
                      >
                        {path}
                        <i className="ri-close-line ml-1 text-sm" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable this group to be used
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
            form="faq-group-form"
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


