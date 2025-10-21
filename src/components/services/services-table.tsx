"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, EditIcon, TrashIcon, StarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Service } from "@/types";

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleFeatured: (service: Service) => void;
}

export function ServicesTable({ services, onEdit, onDelete, onToggleFeatured }: ServicesTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "IT Consulting": "default",
      "Cloud Solutions": "secondary",
      "Hosting Services": "outline",
      "Backup & Recovery": "destructive",
      Cybersecurity: "default",
      "Professional Services": "secondary",
      "Microsoft Solutions": "outline",
      Other: "secondary",
    };
    return variants[category] || "secondary";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Featured</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onToggleFeatured(service)} className="h-8 w-8 p-0">
                  <StarIcon
                    className={`h-4 w-4 ${
                      service.featured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </TableCell>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell className="max-w-md truncate text-muted-foreground">{service.description}</TableCell>
              <TableCell>
                <Badge variant={getCategoryBadgeVariant(service.category)}>{service.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(service.status)}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(service)}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(service)} className="text-destructive">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}




