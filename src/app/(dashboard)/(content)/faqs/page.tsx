"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, HelpCircleIcon, SearchIcon, X } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { FAQGroupsTable } from "@/components/faqs/faq-groups-table";
import { GroupManagementModal } from "@/components/faqs/group-management-modal";
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
import { FAQ, FAQGroup } from "@/types/faqs";
import { faqs } from "@/data/faqs";
import { faqGroups, generateGroupId, duplicateGroup } from "@/data/faq-groups";

export default function FAQsPage() {
  // State for groups
  const [groupsData, setGroupsData] = useState<FAQGroup[]>(faqGroups);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // State for FAQs (managed within groups)
  const [faqsData, setFaqsData] = useState<FAQ[]>(faqs);

  // Modal states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FAQGroup | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<FAQGroup | undefined>();


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
      const groupFaqs = faqsData.filter((faq) => faq.groupId === group.id);
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
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group: FAQGroup) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleGroupClick = (group: FAQGroup) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleGroupSave = async (groupData: { name: string; description?: string; isActive: boolean }, faqs: FAQ[]) => {
    try {
      if (editingGroup) {
        // Update existing group
        const updatedGroup: FAQGroup = {
          ...editingGroup,
          ...groupData,
          faqIds: faqs.map(faq => faq.id),
          order: faqs.map(faq => faq.id),
          updatedAt: new Date(),
        };
        
        setGroupsData((prev) =>
          prev.map((g) => (g.id === editingGroup.id ? updatedGroup : g))
        );
        
        // Update FAQs
        setFaqsData((prev) => {
          // Remove old FAQs for this group
          const withoutOldFaqs = prev.filter(faq => faq.groupId !== editingGroup.id);
          // Add updated FAQs
          return [...withoutOldFaqs, ...faqs];
        });
      } else {
        // Create new group
        const newGroup: FAQGroup = {
          id: generateGroupId(),
          ...groupData,
          faqIds: faqs.map(faq => faq.id),
          order: faqs.map(faq => faq.id),
          usagePaths: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setGroupsData((prev) => [...prev, newGroup]);
        
        // Add new FAQs
        setFaqsData((prev) => [...prev, ...faqs]);
      }
      
      setIsGroupModalOpen(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error("Failed to save group:", error);
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

  // Get FAQs for the editing group
  const getGroupFaqs = (group?: FAQGroup): FAQ[] => {
    if (!group) return [];
    return faqsData.filter(faq => faq.groupId === group.id);
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

        {/* Combined Group Management Modal */}
        <GroupManagementModal
          group={editingGroup}
          open={isGroupModalOpen}
          onOpenChange={setIsGroupModalOpen}
          onSave={handleGroupSave}
          existingFaqs={getGroupFaqs(editingGroup)}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the group &ldquo;{deletingGroup?.name}&rdquo;? This will also delete all
                FAQs in this group. This action cannot be undone.
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