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
import { FAQ, FAQGroup } from "@/types/faqs";

interface FAQsTableProps {
  faqs: FAQ[];
  groups: FAQGroup[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
}

export function FAQsTable({
  faqs,
  groups,
  onEdit,
  onDelete,
}: FAQsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    return group?.groupName || "Unknown";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <i className="ri-questionnaire-line text-2xl text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No FAQs found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            faqs.map((faq) => (
              <TableRow key={faq.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="font-medium max-w-md">
                    {truncateText(faq.question, 60)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground max-w-md">
                    {truncateText(faq.answer, 80)}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {getGroupName(faq.groupId)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {faq.order}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(faq.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(faq)}>
                        <i className="ri-pencil-line mr-2 text-sm" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(faq)}
                        className="text-destructive focus:text-destructive"
                      >
                        <i className="ri-delete-bin-line mr-2 text-sm" />
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


