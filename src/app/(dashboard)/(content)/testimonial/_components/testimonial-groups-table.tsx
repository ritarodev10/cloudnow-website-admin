"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TestimonialGroup } from "@/types/testimonials";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  Users,
  Link as LinkIcon,
} from "lucide-react";

interface TestimonialGroupsTableProps {
  groups: TestimonialGroup[];
  onEdit: (group: TestimonialGroup) => void;
  onDelete: (group: TestimonialGroup) => void;
  onDuplicate: (group: TestimonialGroup) => void;
  onPreview: (group: TestimonialGroup) => void;
}

export function TestimonialGroupsTable({
  groups,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: TestimonialGroupsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Testimonials</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No groups found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="font-medium">{group.name}</div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {group.description || "No description"}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {group.testimonialIds.length} testimonial
                    {group.testimonialIds.length !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {group.usagePaths.length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {group.usagePaths.length} page
                          {group.usagePaths.length !== 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Not used
                        </span>
                      )}
                    </span>
                  </div>
                  {group.usagePaths.length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {group.usagePaths.slice(0, 2).map((path, index) => (
                        <div key={index} className="truncate max-w-[200px]">
                          {path}
                        </div>
                      ))}
                      {group.usagePaths.length > 2 && (
                        <div className="text-muted-foreground">
                          +{group.usagePaths.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant={group.isActive ? "default" : "secondary"}>
                    {group.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(group.updatedAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPreview(group)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(group)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(group)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
