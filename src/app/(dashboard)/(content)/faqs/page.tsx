"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, HelpCircleIcon, FolderIcon, SearchIcon, X } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { FAQForm } from "@/components/faqs/faq-form";
import { FAQTable } from "@/components/faqs/faq-table";
import { FAQFilters } from "@/components/faqs/faq-filters";
import { FAQSearch } from "@/components/faqs/faq-search";
import { FAQGroupForm } from "@/components/faqs/faq-group-form";
import { FAQGroupsTable } from "@/components/faqs/faq-groups-table";
import { GroupFAQsPreview } from "@/components/faqs/group-faqs-preview";
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
import { FAQ, FAQGroup, FAQFormData, FAQGroupFormData, FAQFilters as FAQFiltersType } from "@/types/faqs";
import { faqs, filterFaqs, sortFaqs, generateFaqId } from "@/data/faqs";
import { faqGroups, generateGroupId, duplicateGroup, getFaqsByGroupId } from "@/data/faq-groups";

export default function FAQsPage() {
  // State for FAQs
  const [faqsData, setFaqsData] = useState<FAQ[]>(faqs);
  const [faqFilters, setFaqFilters] = useState<FAQFiltersType>({
    search: "",
    categories: [],
    visibility: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  // State for groups
  const [groupsData, setGroupsData] = useState<FAQGroup[]>(faqGroups);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // Modal states
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | undefined>();
  const [editingGroup, setEditingGroup] = useState<FAQGroup | undefined>();
  const [previewGroup, setPreviewGroup] = useState<FAQGroup | undefined>();
  const [deletingFaq, setDeletingFaq] = useState<FAQ | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<FAQGroup | undefined>();

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Filtered and sorted FAQs
  const filteredFaqs = useMemo(() => {
    let filtered = filterFaqs(faqsData, faqFilters);
    filtered = sortFaqs(filtered, faqFilters.sortBy, faqFilters.sortOrder);
    return filtered;
  }, [faqsData, faqFilters]);

  // Filtered groups based on search
  const filteredGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return groupsData;

    const lowercaseQuery = groupSearchQuery.toLowerCase();
    return groupsData.filter((group) => {
      // Search in group properties
      if (
        group.name.toLowerCase().includes(lowercaseQuery) ||
        (group.description && group.description.toLowerCase().includes(lowercaseQuery)) ||
        group.usagePaths.some((path) => path.toLowerCase().includes(lowercaseQuery))
      ) {
        return true;
      }

      // Search in FAQ content within the group
      const groupFaqs = getFaqsByGroupId(group.id);
      return groupFaqs.some(
        (faq) =>
          faq.question.toLowerCase().includes(lowercaseQuery) ||
          faq.answer.toLowerCase().includes(lowercaseQuery) ||
          faq.categories.some((category: string) => category.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [groupsData, groupSearchQuery]);

  // FAQ handlers
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
        setFaqsData((prev) =>
          prev.map((f) =>
            f.id === editingFaq.id
              ? {
                  ...f,
                  ...formData,
                  updatedAt: new Date(),
                }
              : f
          )
        );
      } else {
        // Create new FAQ
        const newFaq: FAQ = {
          id: generateFaqId(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setFaqsData((prev) => [...prev, newFaq]);
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
      setFaqsData((prev) => prev.filter((f) => f.id !== deletingFaq.id));
      setDeletingFaq(undefined);
    }
  };

  const handleToggleFaqVisibility = (faq: FAQ) => {
    setFaqsData((prev) =>
      prev.map((f) => (f.id === faq.id ? { ...f, isVisible: !f.isVisible, updatedAt: new Date() } : f))
    );
  };

  const handleViewFaqGroups = (faq: FAQ) => {
    // This could open a modal showing which groups contain this FAQ
    console.log("View groups for FAQ:", faq.question);
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
    setIsLoading(true);
    try {
      if (editingGroup) {
        // Update existing group
        setGroupsData((prev) =>
          prev.map((g) =>
            g.id === editingGroup.id
              ? {
                  ...g,
                  ...formData,
                  updatedAt: new Date(),
                }
              : g
          )
        );
      } else {
        // Create new group
        const newGroup: FAQGroup = {
          id: generateGroupId(),
          ...formData,
          usagePaths: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setGroupsData((prev) => [...prev, newGroup]);
      }
      setIsGroupFormOpen(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error("Failed to save group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = (group: FAQGroup) => {
    setDeletingGroup(group);
  };

  const confirmDeleteGroup = () => {
    if (deletingGroup) {
      setGroupsData((prev) => prev.filter((g) => g.id !== deletingGroup.id));
      setDeletingGroup(undefined);
    }
  };

  const handleDuplicateGroup = (group: FAQGroup) => {
    const duplicatedGroup = duplicateGroup(group.id, `${group.name} (Copy)`);
    if (duplicatedGroup) {
      setGroupsData((prev) => [...prev, duplicatedGroup]);
    }
  };

  const handlePreviewGroup = (group: FAQGroup) => {
    setPreviewGroup(group);
    setIsPreviewOpen(true);
  };

  return (
    <PageTitle
      title="FAQs Management"
      description="Manage frequently asked questions and create reusable FAQ groups for your pages"
    >
      <div className="space-y-6">
        {/* Main Content */}
        <Tabs defaultValue="faqs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircleIcon className="h-4 w-4" />
              FAQs ({filteredFaqs.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              Groups ({filteredGroups.length})
            </TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-4">
            <div className="flex items-center justify-between">
              <FAQSearch filters={faqFilters} onFiltersChange={setFaqFilters} />
              <Button onClick={handleAddFaq}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            <FAQFilters filters={faqFilters} onFiltersChange={setFaqFilters} />

            <Card>
              <CardHeader>
                <CardTitle>FAQs ({filteredFaqs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQTable
                  faqs={filteredFaqs}
                  onEdit={handleEditFaq}
                  onDelete={handleDeleteFaq}
                  onToggleVisibility={handleToggleFaqVisibility}
                  onViewGroups={handleViewFaqGroups}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups by name, description, usage paths, or FAQ content..."
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {groupSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setGroupSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button onClick={handleAddGroup}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>FAQ Groups ({filteredGroups.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQGroupsTable
                  groups={filteredGroups}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                  onDuplicate={handleDuplicateGroup}
                  onPreview={handlePreviewGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <FAQForm
          faq={editingFaq}
          open={isFaqFormOpen}
          onOpenChange={setIsFaqFormOpen}
          onSubmit={handleFaqSubmit}
          loading={isLoading}
        />

        <FAQGroupForm
          group={editingGroup}
          open={isGroupFormOpen}
          onOpenChange={setIsGroupFormOpen}
          onSubmit={handleGroupSubmit}
          loading={isLoading}
        />

        {previewGroup && <GroupFAQsPreview group={previewGroup} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />}

        {/* Delete Confirmations */}
        <AlertDialog open={!!deletingFaq} onOpenChange={() => setDeletingFaq(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the FAQ &ldquo;{deletingFaq?.question}&rdquo;? This action cannot be
                undone.
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

        <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the group &ldquo;{deletingGroup?.name}&rdquo;? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteGroup}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTitle>
  );
}
