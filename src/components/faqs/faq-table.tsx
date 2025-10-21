"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FAQ } from "@/types/faqs";
import { Edit, Trash2, Eye, EyeOff, FolderIcon } from "lucide-react";

interface FAQTableProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onToggleVisibility: (faq: FAQ) => void;
  onViewGroups: (faq: FAQ) => void;
}

export function FAQTable({ faqs, onEdit, onDelete, onToggleVisibility, onViewGroups }: FAQTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No FAQs found
              </TableCell>
            </TableRow>
          ) : (
            faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={faq.question}>
                    {faq.question}
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate text-muted-foreground" title={faq.answer}>
                    {truncateText(faq.answer, 100)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {faq.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={faq.isVisible ? "default" : "secondary"}>
                    {faq.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(faq.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewGroups(faq)} title="View Groups">
                      <FolderIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleVisibility(faq)}
                      title={faq.isVisible ? "Hide" : "Show"}
                    >
                      {faq.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(faq)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(faq)}
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
