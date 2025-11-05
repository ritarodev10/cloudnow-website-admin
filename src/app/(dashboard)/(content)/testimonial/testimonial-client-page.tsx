"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/ui/page-title";
import { TestimonialForm } from "./_components/testimonial-form";
import { TestimonialsTable } from "./_components/testimonials-table";
import { TestimonialsStats } from "./_components/testimonials-stats";
import { TestimonialsFilters } from "./_components/testimonials-filters";
import { TestimonialsSearch } from "./_components/testimonials-search";
import { TestimonialGroupForm } from "./_components/testimonial-group-form";
import { TestimonialGroupsTable } from "./_components/testimonial-groups-table";
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
  Testimonial,
  TestimonialGroup,
  TestimonialFormData,
  TestimonialGroupFormData,
  TestimonialFilters as TestimonialFiltersType,
  TestimonialStats,
} from "@/types/testimonials";
import { useTestimonialStore } from "@/stores/testimonial-store";
import { useTestimonials } from "./_hooks/queries/use-testimonials";
import { useTestimonialGroups } from "./_hooks/queries/use-testimonial-groups";
import { useTestimonialStats } from "./_hooks/queries/use-testimonial-stats";
import { useCreateTestimonial } from "./_hooks/mutations/use-create-testimonial";
import { useUpdateTestimonial } from "./_hooks/mutations/use-update-testimonial";
import { useDeleteTestimonial } from "./_hooks/mutations/use-delete-testimonial";
import { useCreateTestimonialGroup } from "./_hooks/mutations/use-create-testimonial-group";
import { useUpdateTestimonialGroup } from "./_hooks/mutations/use-update-testimonial-group";
import { useDeleteTestimonialGroup } from "./_hooks/mutations/use-delete-testimonial-group";

interface TestimonialClientPageProps {
  initialTestimonials: Testimonial[];
  initialGroups: TestimonialGroup[];
  initialStats: TestimonialStats;
}

export function TestimonialClientPage({
  initialTestimonials,
  initialGroups,
  initialStats,
}: TestimonialClientPageProps) {
  // React Query hooks with initial data from server
  const {
    data: testimonialsData = initialTestimonials,
    isLoading: isLoadingTestimonials,
  } = useTestimonials({
    initialData: initialTestimonials,
  });

  const { data: groupsData = initialGroups, isLoading: isLoadingGroups } =
    useTestimonialGroups({
      initialData: initialGroups,
    });

  const { data: stats = initialStats, isLoading: isLoadingStats } =
    useTestimonialStats({
      initialData: initialStats,
    });

  // Mutations
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const createGroupMutation = useCreateTestimonialGroup();
  const updateGroupMutation = useUpdateTestimonialGroup();
  const deleteGroupMutation = useDeleteTestimonialGroup();

  const [testimonialFilters, setTestimonialFilters] =
    useState<TestimonialFiltersType>({
      search: "",
      categories: [],
      rating: null,
      visibility: "all",
      sortBy: "date",
      sortOrder: "desc",
    });

  // Zustand store for testimonial count
  const setTestimonialCount = useTestimonialStore((state) => state.setCount);

  // Keep sidebar count in sync with React Query data
  useEffect(() => {
    setTestimonialCount(testimonialsData.length);
  }, [testimonialsData.length, setTestimonialCount]);

  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // Modal states
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<
    Testimonial | undefined
  >();
  const [editingGroup, setEditingGroup] = useState<
    TestimonialGroup | undefined
  >();
  const [deletingTestimonial, setDeletingTestimonial] = useState<
    Testimonial | undefined
  >();
  const [deletingGroup, setDeletingGroup] = useState<
    TestimonialGroup | undefined
  >();

  // Combined loading state
  const isLoading =
    isLoadingTestimonials ||
    isLoadingGroups ||
    isLoadingStats ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    createGroupMutation.isPending ||
    updateGroupMutation.isPending ||
    deleteGroupMutation.isPending;

  // Use stats from React Query
  const computedStats = stats;

  // Filter and sort testimonials
  const filteredTestimonials = useMemo(() => {
    let filtered = [...testimonialsData];

    // Search filter
    if (testimonialFilters.search) {
      const lowercaseQuery = testimonialFilters.search.toLowerCase();
      filtered = filtered.filter(
        (testimonial) =>
          testimonial.name.toLowerCase().includes(lowercaseQuery) ||
          testimonial.company.toLowerCase().includes(lowercaseQuery) ||
          testimonial.title.toLowerCase().includes(lowercaseQuery) ||
          testimonial.testimony.toLowerCase().includes(lowercaseQuery) ||
          testimonial.categories.some((category) =>
            category.toLowerCase().includes(lowercaseQuery)
          )
      );
    }

    // Category filter
    if (testimonialFilters.categories.length > 0) {
      filtered = filtered.filter((testimonial) =>
        testimonial.categories.some((category) =>
          testimonialFilters.categories.includes(category)
        )
      );
    }

    // Rating filter
    if (testimonialFilters.rating !== null) {
      filtered = filtered.filter(
        (testimonial) => testimonial.rating === testimonialFilters.rating
      );
    }

    // Visibility filter
    if (testimonialFilters.visibility === "visible") {
      filtered = filtered.filter((testimonial) => testimonial.isVisible);
    } else if (testimonialFilters.visibility === "hidden") {
      filtered = filtered.filter((testimonial) => !testimonial.isVisible);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (testimonialFilters.sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "company":
          comparison = a.company.localeCompare(b.company);
          break;
      }
      return testimonialFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [testimonialsData, testimonialFilters]);

  // Filter groups based on search
  const filteredGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return groupsData;

    const lowercaseQuery = groupSearchQuery.toLowerCase();
    return groupsData.filter((group) => {
      if (
        group.name.toLowerCase().includes(lowercaseQuery) ||
        (group.description &&
          group.description.toLowerCase().includes(lowercaseQuery)) ||
        group.usagePaths.some((path) =>
          path.toLowerCase().includes(lowercaseQuery)
        )
      ) {
        return true;
      }
      return false;
    });
  }, [groupsData, groupSearchQuery]);

  // Testimonial handlers
  const handleAddTestimonial = () => {
    setEditingTestimonial(undefined);
    setIsTestimonialFormOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsTestimonialFormOpen(true);
  };

  const handleTestimonialSubmit = async (formData: TestimonialFormData) => {
    try {
      if (editingTestimonial) {
        await updateMutation.mutateAsync({
          id: editingTestimonial.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      // Close modal and reset editing state
      setIsTestimonialFormOpen(false);
      setEditingTestimonial(undefined);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save testimonial. Please try again."
      );
    }
  };

  const handleDeleteTestimonial = (testimonial: Testimonial) => {
    setDeletingTestimonial(testimonial);
  };

  const confirmDeleteTestimonial = async () => {
    if (deletingTestimonial) {
      try {
        await deleteMutation.mutateAsync(deletingTestimonial.id);
        setDeletingTestimonial(undefined);
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete testimonial. Please try again."
        );
      }
    }
  };

  const handleToggleTestimonialVisibility = async (
    testimonial: Testimonial
  ) => {
    try {
      const updatedTestimonial = {
        ...testimonial,
        isVisible: !testimonial.isVisible,
      };
      const formData: TestimonialFormData = {
        name: updatedTestimonial.name,
        title: updatedTestimonial.title,
        company: updatedTestimonial.company,
        testimony: updatedTestimonial.testimony,
        image: updatedTestimonial.image,
        rating: updatedTestimonial.rating,
        categories: updatedTestimonial.categories,
        isVisible: updatedTestimonial.isVisible,
      };

      await updateMutation.mutateAsync({
        id: testimonial.id,
        data: formData,
      });
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update visibility. Please try again."
      );
    }
  };

  // Group handlers
  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: TestimonialGroup) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleGroupSubmit = async (formData: TestimonialGroupFormData) => {
    try {
      if (editingGroup) {
        await updateGroupMutation.mutateAsync({
          id: editingGroup.id,
          data: formData,
        });
      } else {
        await createGroupMutation.mutateAsync(formData);
      }

      // Close modal and reset editing state
      setIsGroupFormOpen(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error("Failed to save group:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save group. Please try again."
      );
    }
  };

  const handleDeleteGroup = (group: TestimonialGroup) => {
    setDeletingGroup(group);
  };

  const confirmDeleteGroup = async () => {
    if (deletingGroup) {
      try {
        await deleteGroupMutation.mutateAsync(deletingGroup.id);
        setDeletingGroup(undefined);
      } catch (error) {
        console.error("Failed to delete group:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete group. Please try again."
        );
      }
    }
  };

  return (
    <PageTitle
      title="Testimonials Management"
      description="Manage customer testimonials and create reusable testimonial groups for your pages"
    >
      <div className="space-y-6">
        {/* Stats */}
        <TestimonialsStats stats={computedStats} />

        {/* Main Content */}
        <Tabs defaultValue="testimonials" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="testimonials"
              className="flex items-center gap-2"
            >
              <i className="ri-team-line text-sm" />
              Testimonials ({filteredTestimonials.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <i className="ri-folder-line text-sm" />
              Groups ({filteredGroups.length})
            </TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex items-center justify-between">
              <TestimonialsSearch
                filters={testimonialFilters}
                onFiltersChange={setTestimonialFilters}
              />
              <Button onClick={handleAddTestimonial}>
                <i className="ri-add-line text-sm mr-2" />
                Add Testimonial
              </Button>
            </div>

            <TestimonialsFilters
              filters={testimonialFilters}
              onFiltersChange={setTestimonialFilters}
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  Testimonials ({filteredTestimonials.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialsTable
                  testimonials={filteredTestimonials}
                  onEdit={handleEditTestimonial}
                  onDelete={handleDeleteTestimonial}
                  onToggleVisibility={handleToggleTestimonialVisibility}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search groups by name..."
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {groupSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setGroupSearchQuery("")}
                  >
                    <i className="ri-close-line text-sm" />
                  </Button>
                )}
              </div>
              <Button onClick={handleAddGroup}>
                <i className="ri-add-line text-sm mr-2" />
                Create Group
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Testimonial Groups ({filteredGroups.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialGroupsTable
                  groups={filteredGroups}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <TestimonialForm
          testimonial={editingTestimonial}
          open={isTestimonialFormOpen}
          onOpenChange={setIsTestimonialFormOpen}
          onSubmit={handleTestimonialSubmit}
          loading={isLoading}
        />

        <TestimonialGroupForm
          group={editingGroup}
          open={isGroupFormOpen}
          onOpenChange={setIsGroupFormOpen}
          onSubmit={handleGroupSubmit}
          loading={
            createGroupMutation.isPending || updateGroupMutation.isPending
          }
        />

        {/* Delete Confirmations */}
        <AlertDialog
          open={!!deletingTestimonial}
          onOpenChange={() => setDeletingTestimonial(undefined)}
        >
          <AlertDialogContent variant="enhanced" className="max-w-lg">
            <AlertDialogHeader
              variant="enhanced"
              className="text-left pb-3 shrink-0"
            >
              <AlertDialogTitle variant="enhanced" className="text-xl">
                Delete Testimonial
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="px-6 py-4 space-y-3 flex-1 min-h-0">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <svg
                        className="size-4 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Deleting testimonial from{" "}
                      <span className="font-semibold">
                        {deletingTestimonial?.name}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All ratings, groups, and metadata associated with this
                      testimonial will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter variant="enhanced" className="shrink-0">
              <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTestimonial}
                className="bg-[#dc2626] text-white hover:bg-[#b91c1c] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] h-10 min-w-[120px] font-medium"
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={!!deletingGroup}
          onOpenChange={() => setDeletingGroup(undefined)}
        >
          <AlertDialogContent variant="enhanced" className="max-w-lg">
            <AlertDialogHeader
              variant="enhanced"
              className="text-left pb-3 shrink-0"
            >
              <AlertDialogTitle variant="enhanced" className="text-xl">
                Delete Group
              </AlertDialogTitle>
              <AlertDialogDescription
                variant="enhanced"
                className="text-sm mt-1"
              >
                This action cannot be undone. The group structure will be
                permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="px-6 py-4 space-y-3 flex-1 min-h-0">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <svg
                        className="size-4 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Deleting group{" "}
                      <span className="font-semibold">
                        &ldquo;{deletingGroup?.name}&rdquo;
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All testimonials associated with this group will remain,
                      but the group structure will be permanently removed from
                      your system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter variant="enhanced" className="shrink-0">
              <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteGroup}
                className="bg-[#dc2626] text-white hover:bg-[#b91c1c] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] h-10 min-w-[120px] font-medium"
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTitle>
  );
}
