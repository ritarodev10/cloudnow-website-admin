"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/ui/page-title";
import { FAQForm } from "./_components/faq-form";
import { FAQsTable } from "./_components/faqs-table";
import { FAQsStats } from "./_components/faqs-stats";
import { FAQsFilters } from "./_components/faqs-filters";
import { FAQsSearch } from "./_components/faqs-search";
import { FAQGroupForm } from "./_components/faq-group-form";
import { FAQGroupsTable } from "./_components/faq-groups-table";
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
  FAQ,
  FAQGroup,
  FAQFormData,
  FAQGroupFormData,
  FAQFilters as FAQFiltersType,
  FAQStats,
} from "@/types/faqs";
import { useFAQs } from "./_hooks/queries/use-faqs";
import { useFAQGroups } from "./_hooks/queries/use-faq-groups";
import { useFAQStats } from "./_hooks/queries/use-faq-stats";
import { useCreateFAQ } from "./_hooks/mutations/use-create-faq";
import { useUpdateFAQ } from "./_hooks/mutations/use-update-faq";
import { useDeleteFAQ } from "./_hooks/mutations/use-delete-faq";
import { useCreateFAQGroup } from "./_hooks/mutations/use-create-faq-group";
import { useUpdateFAQGroup } from "./_hooks/mutations/use-update-faq-group";
import { useDeleteFAQGroup } from "./_hooks/mutations/use-delete-faq-group";

interface FAQClientPageProps {
  initialFAQs: FAQ[];
  initialGroups: FAQGroup[];
  initialStats: FAQStats;
}

export function FAQClientPage({
  initialFAQs,
  initialGroups,
  initialStats,
}: FAQClientPageProps) {
  // React Query hooks with initial data from server
  const {
    data: faqsData = initialFAQs,
    isLoading: isLoadingFAQs,
  } = useFAQs({
    initialData: initialFAQs,
  });

  const { data: groupsData = initialGroups, isLoading: isLoadingGroups } =
    useFAQGroups({
      initialData: initialGroups,
    });

  const { data: stats = initialStats, isLoading: isLoadingStats } =
    useFAQStats({
      initialData: initialStats,
    });

  // Mutations
  const createMutation = useCreateFAQ();
  const updateMutation = useUpdateFAQ();
  const deleteMutation = useDeleteFAQ();
  const createGroupMutation = useCreateFAQGroup();
  const updateGroupMutation = useUpdateFAQGroup();
  const deleteGroupMutation = useDeleteFAQGroup();

  const [faqFilters, setFaqFilters] = useState<FAQFiltersType>({
    search: "",
    groups: [],
    sortBy: "date",
    sortOrder: "desc",
  });

  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // Modal states
  const [isFAQFormOpen, setIsFAQFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>();
  const [editingGroup, setEditingGroup] = useState<FAQGroup | undefined>();
  const [deletingFAQ, setDeletingFAQ] = useState<FAQ | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<FAQGroup | undefined>();

  // Combined loading state
  const isLoading =
    isLoadingFAQs ||
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

  // Filter and sort FAQs
  const filteredFAQs = useMemo(() => {
    let filtered = [...faqsData];

    // Search filter
    if (faqFilters.search) {
      const lowercaseQuery = faqFilters.search.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(lowercaseQuery) ||
          faq.answer.toLowerCase().includes(lowercaseQuery) ||
          groupsData.some(
            (group) =>
              group.id === faq.groupId &&
              group.groupName.toLowerCase().includes(lowercaseQuery)
          )
      );
    }

    // Group filter
    if (faqFilters.groups.length > 0) {
      filtered = filtered.filter((faq) =>
        faqFilters.groups.includes(faq.groupId)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (faqFilters.sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "order":
          comparison = a.order - b.order;
          break;
        case "question":
          comparison = a.question.localeCompare(b.question);
          break;
      }
      return faqFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [faqsData, faqFilters, groupsData]);

  // Filter groups based on search
  const filteredGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return groupsData;

    const lowercaseQuery = groupSearchQuery.toLowerCase();
    return groupsData.filter((group) => {
      if (
        group.groupName.toLowerCase().includes(lowercaseQuery) ||
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

  // FAQ handlers
  const handleAddFAQ = () => {
    setEditingFAQ(undefined);
    setIsFAQFormOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setIsFAQFormOpen(true);
  };

  const handleFAQSubmit = async (formData: FAQFormData) => {
    try {
      if (editingFAQ) {
        await updateMutation.mutateAsync({
          id: editingFAQ.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      // Close modal and reset editing state
      setIsFAQFormOpen(false);
      setEditingFAQ(undefined);
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save FAQ. Please try again."
      );
    }
  };

  const handleDeleteFAQ = (faq: FAQ) => {
    setDeletingFAQ(faq);
  };

  const confirmDeleteFAQ = async () => {
    if (deletingFAQ) {
      try {
        await deleteMutation.mutateAsync(deletingFAQ.id);
        setDeletingFAQ(undefined);
      } catch (error) {
        console.error("Failed to delete FAQ:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete FAQ. Please try again."
        );
      }
    }
  };

  // Group handlers
  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: FAQGroup) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleGroupSubmit = async (formData: FAQGroupFormData) => {
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

  const handleDeleteGroup = (group: FAQGroup) => {
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
      title="FAQ Management"
      description="Manage frequently asked questions and create reusable FAQ groups for your pages"
    >
      <div className="space-y-6">
        {/* Stats */}
        <FAQsStats stats={computedStats} />

        {/* Main Content */}
        <Tabs defaultValue="faqs" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="faqs"
              className="flex items-center gap-2"
            >
              <i className="ri-questionnaire-line text-sm" />
              FAQs ({filteredFAQs.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <i className="ri-folder-line text-sm" />
              Groups ({filteredGroups.length})
            </TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-4">
            <div className="flex items-center justify-between">
              <FAQsSearch
                filters={faqFilters}
                onFiltersChange={setFaqFilters}
              />
              <Button onClick={handleAddFAQ}>
                <i className="ri-add-line text-sm mr-2" />
                Add FAQ
              </Button>
            </div>

            <FAQsFilters
              filters={faqFilters}
              onFiltersChange={setFaqFilters}
              groups={groupsData}
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  FAQs ({filteredFAQs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FAQsTable
                  faqs={filteredFAQs}
                  groups={groupsData}
                  onEdit={handleEditFAQ}
                  onDelete={handleDeleteFAQ}
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
                  FAQ Groups ({filteredGroups.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FAQGroupsTable
                  groups={filteredGroups}
                  faqs={faqsData}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <FAQForm
          faq={editingFAQ}
          open={isFAQFormOpen}
          onOpenChange={setIsFAQFormOpen}
          onSubmit={handleFAQSubmit}
          loading={isLoading}
        />

        <FAQGroupForm
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
          open={!!deletingFAQ}
          onOpenChange={() => setDeletingFAQ(undefined)}
        >
          <AlertDialogContent variant="enhanced" className="max-w-lg">
            <AlertDialogHeader
              variant="enhanced"
              className="text-left pb-3 shrink-0"
            >
              <AlertDialogTitle variant="enhanced" className="text-xl">
                Delete FAQ
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
                      Deleting FAQ:{" "}
                      <span className="font-semibold">
                        {deletingFAQ?.question}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This FAQ will be permanently deleted and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter variant="enhanced" className="shrink-0">
              <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteFAQ}
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
                This action cannot be undone. The group and all its FAQs will be
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
                        &ldquo;{deletingGroup?.groupName}&rdquo;
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All FAQs associated with this group will be permanently deleted
                      due to cascade delete.
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


