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
import { FAQGroup, FAQ } from "@/types/faqs";

interface FAQGroupsTableProps {
  groups: FAQGroup[];
  faqs: FAQ[];
  onEdit: (group: FAQGroup) => void;
  onDelete: (group: FAQGroup) => void;
}

export function FAQGroupsTable({
  groups,
  faqs,
  onEdit,
  onDelete,
}: FAQGroupsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getFAQCount = (groupId: string) => {
    return faqs.filter((faq) => faq.groupId === groupId).length;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>FAQs</TableHead>
            <TableHead>Usage Paths</TableHead>
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
                  <i className="ri-folder-line text-2xl text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No groups found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => {
              const faqCount = getFAQCount(group.id);
              return (
                <TableRow key={group.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{group.groupName}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {group.description || "No description"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {faqCount} FAQ{faqCount !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <i className="ri-links-line text-sm text-muted-foreground" />
                      <span className="text-sm">
                        {group.usagePaths.length > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {group.usagePaths.length} path
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
                          <i className="ri-more-line text-sm" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(group)}>
                          <i className="ri-pencil-line mr-2 text-sm" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(group)}
                          className="text-destructive focus:text-destructive"
                        >
                          <i className="ri-delete-bin-line mr-2 text-sm" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}





