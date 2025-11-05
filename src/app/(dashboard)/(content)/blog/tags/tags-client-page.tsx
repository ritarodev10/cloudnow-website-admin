"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageTitle } from "@/components/ui/page-title";
import { TagForm } from "./_components/tag-form";
import { TagsTable } from "./_components/tags-table";
import { TagsStats } from "./_components/tags-stats";
import { TagsSearch } from "./_components/tags-search";
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
import {
  Tag,
  TagFormData,
  TagFilters as TagFiltersType,
  TagStats,
} from "@/types/tags";
import { useTags } from "./_hooks/queries/use-tags";
import { useTagStats } from "./_hooks/queries/use-tag-stats";
import { useCreateTag } from "./_hooks/mutations/use-create-tag";
import { useUpdateTag } from "./_hooks/mutations/use-update-tag";
import { useDeleteTag } from "./_hooks/mutations/use-delete-tag";

interface TagsClientPageProps {
  initialTags: Tag[];
  initialStats: TagStats;
}

export function TagsClientPage({
  initialTags,
  initialStats,
}: TagsClientPageProps) {
  // React Query hooks with initial data from server
  const {
    data: tagsData = initialTags,
    isLoading: isLoadingTags,
  } = useTags({
    initialData: initialTags,
  });

  const { data: stats = initialStats, isLoading: isLoadingStats } =
    useTagStats({
      initialData: initialStats,
    });

  // Mutations
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const [tagFilters, setTagFilters] = useState<TagFiltersType>({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Modal states
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();
  const [deletingTag, setDeletingTag] = useState<Tag | undefined>();

  // Combined loading state
  const isLoading =
    isLoadingTags ||
    isLoadingStats ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Use stats from React Query
  const computedStats = stats;

  // Filter and sort tags
  const filteredTags = useMemo(() => {
    let filtered = [...tagsData];

    // Search filter
    if (tagFilters.search) {
      const lowercaseQuery = tagFilters.search.toLowerCase();
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(lowercaseQuery) ||
          tag.slug.toLowerCase().includes(lowercaseQuery) ||
          (tag.description &&
            tag.description.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (tagFilters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "usage":
          comparison = a.usageCount - b.usageCount;
          break;
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      return tagFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [tagsData, tagFilters]);

  // Tag handlers
  const handleAddTag = () => {
    setEditingTag(undefined);
    setIsTagFormOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsTagFormOpen(true);
  };

  const handleTagSubmit = async (formData: TagFormData) => {
    try {
      if (editingTag) {
        await updateMutation.mutateAsync({
          id: editingTag.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      // Close modal and reset editing state
      setIsTagFormOpen(false);
      setEditingTag(undefined);
    } catch (error) {
      console.error("Failed to save tag:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save tag. Please try again."
      );
    }
  };

  const handleDeleteTag = (tag: Tag) => {
    setDeletingTag(tag);
  };

  const confirmDeleteTag = async () => {
    if (deletingTag) {
      try {
        await deleteMutation.mutateAsync(deletingTag.id);
        setDeletingTag(undefined);
      } catch (error) {
        console.error("Failed to delete tag:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete tag. Please try again."
        );
      }
    }
  };

  return (
    <PageTitle
      title="Blog Tags"
      description="Manage tags to organize and categorize your blog posts"
    >
      <div className="space-y-6">
        {/* Stats */}
        <TagsStats stats={computedStats} />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <TagsSearch
              value={tagFilters.search}
              onChange={(value) =>
                setTagFilters({ ...tagFilters, search: value })
              }
            />
            <Select
              value={tagFilters.sortBy}
              onValueChange={(value: "name" | "usage" | "date") =>
                setTagFilters({ ...tagFilters, sortBy: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={tagFilters.sortOrder}
              onValueChange={(value: "asc" | "desc") =>
                setTagFilters({ ...tagFilters, sortOrder: value })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddTag} disabled={isLoading}>
            <i className="ri-add-line mr-2" />
            Create Tag
          </Button>
        </div>

        {/* Tags Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tags ({filteredTags.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TagsTable
              tags={filteredTags}
              onEdit={handleEditTag}
              onDelete={handleDeleteTag}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <TagForm
          tag={editingTag}
          open={isTagFormOpen}
          onOpenChange={setIsTagFormOpen}
          onSubmit={handleTagSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />

        <AlertDialog
          open={!!deletingTag}
          onOpenChange={(open) => !open && setDeletingTag(undefined)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tag</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingTag?.name}"? This
                action cannot be undone.
                {deletingTag && deletingTag.usageCount > 0 && (
                  <span className="block mt-2 text-destructive">
                    This tag is currently in use by {deletingTag.usageCount}{" "}
                    {deletingTag.usageCount === 1 ? "post" : "posts"} and cannot
                    be deleted.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTag}
                disabled={
                  (deletingTag ? deletingTag.usageCount > 0 : false) ||
                  deleteMutation.isPending
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="ri-delete-bin-line mr-2" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTitle>
  );
}

