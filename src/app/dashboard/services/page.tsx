"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { ServicesSearch } from "@/components/services/services-search";
import { ServicesFilters } from "@/components/services/services-filters";
import { ServicesStats } from "@/components/services/services-stats";
import { ServicesTable } from "@/components/services/services-table";
import { ServiceForm } from "@/components/services/service-form";
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
import { Service, ServiceFormData, ServiceFilters } from "@/types";
import { services, calculateServiceStats, filterServices, sortServices, generateServiceId } from "@/data/services";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ServiceFilters>({
    search: "",
    category: "all",
    status: "all",
    featured: "all",
  });
  const [servicesData, setServicesData] = useState<Service[]>(services);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [deletingService, setDeletingService] = useState<Service | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    const filtered = filterServices(servicesData, filters);
    return sortServices(filtered, "title", "asc");
  }, [servicesData, filters]);

  // Calculate statistics
  const stats = useMemo(() => calculateServiceStats(servicesData), [servicesData]);

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ServiceFilters) => {
    setFilters(newFilters);
    if (newFilters.search !== searchTerm) {
      setSearchTerm(newFilters.search);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      featured: "all",
    });
    setSearchTerm("");
  };

  // Handle add new service
  const handleAddService = () => {
    setEditingService(undefined);
    setIsFormOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  // Handle delete service
  const handleDeleteService = (service: Service) => {
    setDeletingService(service);
  };

  // Handle toggle featured
  const handleToggleFeatured = (service: Service) => {
    setServicesData((prev) => prev.map((s) => (s.id === service.id ? { ...s, featured: !s.featured } : s)));
  };

  // Handle form submission
  const handleFormSubmit = async (formData: ServiceFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingService) {
        // Update existing service
        setServicesData((prev) =>
          prev.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  ...formData,
                  updatedAt: new Date(),
                }
              : s
          )
        );
      } else {
        // Add new service
        const newService: Service = {
          id: generateServiceId(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setServicesData((prev) => [...prev, newService]);
      }

      setIsFormOpen(false);
      setEditingService(undefined);
    } catch (error) {
      console.error("Failed to save service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingService) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setServicesData((prev) => prev.filter((s) => s.id !== deletingService.id));

      setDeletingService(undefined);
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTitle
      title="Services"
      description="Manage your services and offerings"
      actions={
        <Button onClick={handleAddService}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <ServicesStats stats={stats} />

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ServicesSearch filters={filters} onFiltersChange={handleFiltersChange} onSearch={handleSearch} />
            <ServicesFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services ({filteredServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesTable
              services={filteredServices}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onToggleFeatured={handleToggleFeatured}
            />
          </CardContent>
        </Card>
      </div>

      {/* Service Form Dialog */}
      <ServiceForm
        service={editingService}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        loading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingService} onOpenChange={() => setDeletingService(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingService?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTitle>
  );
}




