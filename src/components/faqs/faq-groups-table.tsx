"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FAQGroup } from "@/types/faqs";
import { Edit, Trash2, Copy, Eye, FolderIcon } from "lucide-react";

interface FAQGroupsTableProps {
  groups: FAQGroup[];
  onEdit: (group: FAQGroup) => void;
  onDelete: (group: FAQGroup) => void;
  onDuplicate: (group: FAQGroup) => void;
  onPreview: (group: FAQGroup) => void;
  onGroupClick: (group: FAQGroup) => void; // New handler for row clicks
}

export function FAQGroupsTable({ groups, onEdit, onDelete, onDuplicate, onPreview, onGroupClick }: FAQGroupsTableProps) {
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
            <TableHead>FAQs</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No groups found
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow 
                key={group.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onGroupClick(group)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    {group.name}
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate text-muted-foreground" title={group.description}>
                    {group.description || "No description"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{group.faqIds.length} FAQs</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {group.usagePaths.length > 0 ? (
                      group.usagePaths.slice(0, 2).map((path) => (
                        <Badge key={path} variant="outline" className="text-xs">
                          {path}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Not used
                      </Badge>
                    )}
                    {group.usagePaths.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.usagePaths.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={group.isActive ? "default" : "secondary"}>
                    {group.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(group.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(group);
                      }} 
                      title="Preview Group"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(group);
                      }} 
                      title="Duplicate Group"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(group);
                      }} 
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(group);
                      }}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
