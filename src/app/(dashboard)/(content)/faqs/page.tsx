"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, HelpCircleIcon, SearchIcon, X } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { FAQGroupForm } from "@/components/faqs/faq-group-form";
import { FAQGroupsTable } from "@/components/faqs/faq-groups-table";
import { GroupFAQsModal } from "@/components/faqs/group-faqs-modal";
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
import { FAQ, FAQGroup, FAQGroupFormData } from "@/types/faqs";
import { faqs } from "@/data/faqs";
import { faqGroups, generateGroupId, duplicateGroup } from "@/data/faq-groups";

export default function FAQsPage() {
  // State for groups
  const [groupsData, setGroupsData] = useState<FAQGroup[]>(faqGroups);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // State for FAQs (managed within groups)
  const [faqsData, setFaqsData] = useState<FAQ[]>(faqs);

  // Modal states
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isFaqsModalOpen, setIsFaqsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FAQGroup | undefined>();
  const [selectedGroup, setSelectedGroup] = useState<FAQGroup | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<FAQGroup | undefined>();

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

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
      const groupFaqs = faqsData.filter(faq => faq.groupId === group.id);
      return groupFaqs.some(
        (faq) =>
          faq.question.toLowerCase().includes(lowercaseQuery) ||
          faq.answer.toLowerCase().includes(lowercaseQuery) ||
          faq.categories.some((category: string) => category.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [groupsData, groupSearchQuery, faqsData]);

  // Group handlers
  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: FAQGroup) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleGroupClick = (group: FAQGroup) => {
    setSelectedGroup(group);
    setIsFaqsModalOpen(true);
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
      // Remove FAQs that belong to this group
      setFaqsData((prev) => prev.filter((faq) => faq.groupId !== deletingGroup.id));
      // Remove the group
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
    // For now, just open the modal (same as clicking the group)
    handleGroupClick(group);
  };

  // FAQ handlers (called from the modal)
  const handleFaqCreate = (faq: FAQ) => {
    setFaqsData((prev) => [...prev, faq]);
    // Update group's faqIds and order
    setGroupsData((prev) =>
      prev.map((g) =>
        g.id === faq.groupId
          ? {
              ...g,
              faqIds: [...g.faqIds, faq.id],
              order: [...g.order, faq.id],
              updatedAt: new Date(),
            }
          : g
      )
    );
  };

  const handleFaqUpdate = (faq: FAQ) => {
    setFaqsData((prev) =>
      prev.map((f) => (f.id === faq.id ? faq : f))
    );
  };

  const handleFaqDelete = (faqId: string) => {
    const faq = faqsData.find(f => f.id === faqId);
    if (faq) {
      setFaqsData((prev) => prev.filter((f) => f.id !== faqId));
      // Update group's faqIds and order
      setGroupsData((prev) =>
        prev.map((g) =>
          g.id === faq.groupId
            ? {
                ...g,
                faqIds: g.faqIds.filter((id) => id !== faqId),
                order: g.order.filter((id) => id !== faqId),
                updatedAt: new Date(),
              }
            : g
        )
      );
    }
  };

  const handleFaqReorder = (groupId: string, newOrder: string[]) => {
    setGroupsData((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              order: newOrder,
              updatedAt: new Date(),
            }
          : g
      )
    );
  };

  return (
    <PageTitle
      title="FAQ Groups Management"
      description="Manage FAQ groups and their content. Click on a group to view and manage its FAQs."
    >
      <div className="space-y-6">
        {/* Header with Search and Add Group */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
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

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircleIcon className="h-5 w-5" />
              FAQ Groups ({filteredGroups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FAQGroupsTable
              groups={filteredGroups}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
              onDuplicate={handleDuplicateGroup}
              onPreview={handlePreviewGroup}
              onGroupClick={handleGroupClick}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <FAQGroupForm
          group={editingGroup}
          open={isGroupFormOpen}
          onOpenChange={setIsGroupFormOpen}
          onSubmit={handleGroupSubmit}
          loading={isLoading}
        />

        {selectedGroup && (
          <GroupFAQsModal
            group={selectedGroup}
            open={isFaqsModalOpen}
            onOpenChange={setIsFaqsModalOpen}
            onFaqCreate={handleFaqCreate}
            onFaqUpdate={handleFaqUpdate}
            onFaqDelete={handleFaqDelete}
            onFaqReorder={handleFaqReorder}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the group &ldquo;{deletingGroup?.name}&rdquo;? This will also delete all FAQs in this group. This action cannot be undone.
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