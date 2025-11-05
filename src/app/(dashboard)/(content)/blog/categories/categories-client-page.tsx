"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { CategoryForm } from "./_components/category-form";
import { CategoriesTable } from "./_components/categories-table";
import { CategoriesStats } from "./_components/categories-stats";
import { CategoriesFilters } from "./_components/categories-filters";
import { CategoriesSearch } from "./_components/categories-search";
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
  BlogCategory,
  CategoryFormData,
  CategoryFilters as CategoryFiltersType,
  CategoryStats,
} from "@/types/categories";
import { useCategories } from "./_hooks/queries/use-categories";
import { useCategoryStats } from "./_hooks/queries/use-category-stats";
import { useCreateCategory } from "./_hooks/mutations/use-create-category";
import { useUpdateCategory } from "./_hooks/mutations/use-update-category";
import { useDeleteCategory } from "./_hooks/mutations/use-delete-category";

interface CategoriesClientPageProps {
  initialCategories: BlogCategory[];
  initialStats: CategoryStats;
}

export function CategoriesClientPage({
  initialCategories,
  initialStats,
}: CategoriesClientPageProps) {
  // React Query hooks with initial data from server
  const {
    data: categoriesData = initialCategories,
    isLoading: isLoadingCategories,
  } = useCategories({
    initialData: initialCategories,
  });

  const { data: stats = initialStats, isLoading: isLoadingStats } =
    useCategoryStats({
      initialData: initialStats,
    });

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [categoryFilters, setCategoryFilters] =
    useState<CategoryFiltersType>({
      search: "",
      sortBy: "date",
      sortOrder: "desc",
      activeOnly: false,
    });

  // Modal states
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    BlogCategory | undefined
  >();
  const [deletingCategory, setDeletingCategory] = useState<
    BlogCategory | undefined
  >();

  // Combined loading state
  const isLoading =
    isLoadingCategories ||
    isLoadingStats ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Use stats from React Query
  const computedStats = stats;

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = [...categoriesData];

    // Search filter
    if (categoryFilters.search) {
      const lowercaseQuery = categoryFilters.search.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(lowercaseQuery) ||
          category.slug.toLowerCase().includes(lowercaseQuery) ||
          (category.description &&
            category.description.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Active only filter
    if (categoryFilters.activeOnly) {
      filtered = filtered.filter((category) => category.isActive);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (categoryFilters.sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "posts":
          comparison = a.postCount - b.postCount;
          break;
      }
      return categoryFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [categoriesData, categoryFilters]);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (formData: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      // Close modal and reset editing state
      setIsCategoryFormOpen(false);
      setEditingCategory(undefined);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save category. Please try again."
      );
    }
  };

  const handleDeleteCategory = (category: BlogCategory) => {
    setDeletingCategory(category);
  };

  const confirmDeleteCategory = async () => {
    if (deletingCategory) {
      try {
        await deleteMutation.mutateAsync(deletingCategory.id);
        setDeletingCategory(undefined);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete category. Please try again."
        );
      }
    }
  };

  return (
    <PageTitle
      title="Blog Categories"
      description="Manage blog categories to organize your posts"
    >
      <div className="space-y-6">
        {/* Stats */}
        <CategoriesStats stats={computedStats} />

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CategoriesSearch
              filters={categoryFilters}
              onFiltersChange={setCategoryFilters}
            />
            <Button onClick={handleAddCategory}>
              <i className="ri-add-line text-sm mr-2" />
              Create Category
            </Button>
          </div>

          <CategoriesFilters
            filters={categoryFilters}
            onFiltersChange={setCategoryFilters}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Categories ({filteredCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoriesTable
                categories={filteredCategories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <CategoryForm
          category={editingCategory}
          open={isCategoryFormOpen}
          onOpenChange={setIsCategoryFormOpen}
          onSubmit={handleCategorySubmit}
          loading={isLoading}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deletingCategory}
          onOpenChange={() => setDeletingCategory(undefined)}
        >
          <AlertDialogContent variant="enhanced" className="max-w-lg">
            <AlertDialogHeader
              variant="enhanced"
              className="text-left pb-3 shrink-0"
            >
              <AlertDialogTitle variant="enhanced" className="text-xl">
                Delete Category
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
                      Deleting category{" "}
                      <span className="font-semibold">
                        &ldquo;{deletingCategory?.name}&rdquo;
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deletingCategory?.postCount === 0
                        ? "This category will be permanently deleted and cannot be recovered."
                        : `This category is being used by ${deletingCategory?.postCount} post(s). You cannot delete it until you remove or reassign those posts.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter variant="enhanced" className="shrink-0">
              <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteCategory}
                disabled={deletingCategory?.postCount !== 0}
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

