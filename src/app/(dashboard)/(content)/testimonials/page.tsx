"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, UsersIcon, FolderIcon, SearchIcon, X } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import { TestimonialsTable } from "@/components/testimonials/testimonials-table";
import { TestimonialsStats } from "@/components/testimonials/testimonials-stats";
import { TestimonialsFilters } from "@/components/testimonials/testimonials-filters";
import { TestimonialsSearch } from "@/components/testimonials/testimonials-search";
import { TestimonialGroupForm } from "@/components/testimonials/testimonial-group-form";
import { TestimonialGroupsTable } from "@/components/testimonials/testimonial-groups-table";
import { GroupTestimonialsPreview } from "@/components/testimonials/group-testimonials-preview";
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
import {
  testimonials,
  filterTestimonials,
  sortTestimonials,
  calculateTestimonialStats,
  generateTestimonialId,
} from "@/data/testimonials";
import {
  testimonialGroups,
  calculateGroupStats,
  generateGroupId,
  duplicateGroup,
  getTestimonialsByGroupId,
} from "@/data/testimonial-groups";

export default function TestimonialsPage() {
  // State for testimonials
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>(testimonials);
  const [testimonialFilters, setTestimonialFilters] = useState<TestimonialFiltersType>({
    search: "",
    categories: [],
    rating: null,
    visibility: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  // State for groups
  const [groupsData, setGroupsData] = useState<TestimonialGroup[]>(testimonialGroups);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // Modal states
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>();
  const [editingGroup, setEditingGroup] = useState<TestimonialGroup | undefined>();
  const [previewGroup, setPreviewGroup] = useState<TestimonialGroup | undefined>();
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<TestimonialGroup | undefined>();

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Filtered and sorted testimonials
  const filteredTestimonials = useMemo(() => {
    let filtered = filterTestimonials(testimonialsData, testimonialFilters);
    filtered = sortTestimonials(filtered, testimonialFilters.sortBy, testimonialFilters.sortOrder);
    return filtered;
  }, [testimonialsData, testimonialFilters]);

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

      // Search in testimonial content within the group
      const groupTestimonials = getTestimonialsByGroupId(group.id);
      return groupTestimonials.some(
        (testimonial) =>
          testimonial.name.toLowerCase().includes(lowercaseQuery) ||
          testimonial.title.toLowerCase().includes(lowercaseQuery) ||
          testimonial.company.toLowerCase().includes(lowercaseQuery) ||
          testimonial.testimony.toLowerCase().includes(lowercaseQuery) ||
          testimonial.categories.some((category: string) => category.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [groupsData, groupSearchQuery]);

  // Testimonial stats
  const testimonialStats: TestimonialStats = useMemo(() => {
    const stats = calculateTestimonialStats(testimonialsData);
    const groupStats = calculateGroupStats(groupsData);
    return {
      ...stats,
      totalGroups: groupStats.total,
      activeGroups: groupStats.active,
      usedGroups: groupStats.usedGroups,
      unusedGroups: groupStats.unusedGroups,
    };
  }, [testimonialsData, groupsData]);

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
    setIsLoading(true);
    try {
      if (editingTestimonial) {
        // Update existing testimonial
        setTestimonialsData((prev) =>
          prev.map((t) =>
            t.id === editingTestimonial.id
              ? {
                  ...t,
                  ...formData,
                  updatedAt: new Date(),
                }
              : t
          )
        );
      } else {
        // Create new testimonial
        const newTestimonial: Testimonial = {
          id: generateTestimonialId(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTestimonialsData((prev) => [...prev, newTestimonial]);
      }
      setIsTestimonialFormOpen(false);
      setEditingTestimonial(undefined);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTestimonial = (testimonial: Testimonial) => {
    setDeletingTestimonial(testimonial);
  };

  const confirmDeleteTestimonial = () => {
    if (deletingTestimonial) {
      setTestimonialsData((prev) => prev.filter((t) => t.id !== deletingTestimonial.id));
      setDeletingTestimonial(undefined);
    }
  };

  const handleToggleTestimonialVisibility = (testimonial: Testimonial) => {
    setTestimonialsData((prev) =>
      prev.map((t) => (t.id === testimonial.id ? { ...t, isVisible: !t.isVisible, updatedAt: new Date() } : t))
    );
  };

  const handleViewTestimonialGroups = (testimonial: Testimonial) => {
    // This could open a modal showing which groups contain this testimonial
    console.log("View groups for testimonial:", testimonial.name);
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
        const newGroup: TestimonialGroup = {
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

  const handleDeleteGroup = (group: TestimonialGroup) => {
    setDeletingGroup(group);
  };

  const confirmDeleteGroup = () => {
    if (deletingGroup) {
      setGroupsData((prev) => prev.filter((g) => g.id !== deletingGroup.id));
      setDeletingGroup(undefined);
    }
  };

  const handleDuplicateGroup = (group: TestimonialGroup) => {
    const duplicatedGroup = duplicateGroup(group.id, `${group.name} (Copy)`);
    if (duplicatedGroup) {
      setGroupsData((prev) => [...prev, duplicatedGroup]);
    }
  };

  const handlePreviewGroup = (group: TestimonialGroup) => {
    setPreviewGroup(group);
    setIsPreviewOpen(true);
  };

  return (
    <PageTitle
      title="Testimonials Management"
      description="Manage customer testimonials and create reusable testimonial groups for your pages"
    >
      <div className="space-y-6">
        {/* Stats */}
        <TestimonialsStats stats={testimonialStats} />

        {/* Main Content */}
        <Tabs defaultValue="testimonials" className="space-y-4">
          <TabsList>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Testimonials ({filteredTestimonials.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              Groups ({filteredGroups.length})
            </TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex items-center justify-between">
              <TestimonialsSearch filters={testimonialFilters} onFiltersChange={setTestimonialFilters} />
              <Button onClick={handleAddTestimonial}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            <TestimonialsFilters filters={testimonialFilters} onFiltersChange={setTestimonialFilters} />

            <Card>
              <CardHeader>
                <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialsTable
                  testimonials={filteredTestimonials}
                  onEdit={handleEditTestimonial}
                  onDelete={handleDeleteTestimonial}
                  onToggleVisibility={handleToggleTestimonialVisibility}
                  onViewGroups={handleViewTestimonialGroups}
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
                  placeholder="Search groups by name, description, usage paths, or testimonial content..."
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
                <CardTitle>Testimonial Groups ({filteredGroups.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialGroupsTable
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
          loading={isLoading}
        />

        <GroupTestimonialsPreview group={previewGroup!} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />

        {/* Delete Confirmations */}
        <AlertDialog open={!!deletingTestimonial} onOpenChange={() => setDeletingTestimonial(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the testimonial from &ldquo;{deletingTestimonial?.name}&rdquo;? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTestimonial}
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
