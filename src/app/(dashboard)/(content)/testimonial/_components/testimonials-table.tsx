"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Testimonial } from "@/types/testimonials";

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
  onToggleVisibility: (testimonial: Testimonial) => void;
}

export function TestimonialsTable({
  testimonials,
  onEdit,
  onDelete,
  onToggleVisibility,
}: TestimonialsTableProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < rating;
      return (
        <i
          key={i}
          className={`${isFilled ? "ri-star-fill" : "ri-star-line"} text-xs ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
            <TableHead className="w-[60px]">Avatar</TableHead>
            <TableHead>Name & Company</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Groups</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <i className="ri-team-line text-2xl text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No testimonials found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((testimonial) => (
              <TableRow key={testimonial.id} className="hover:bg-muted/50">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title} at {testimonial.company}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({testimonial.rating})
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {testimonial.categories.slice(0, 2).map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                    {testimonial.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{testimonial.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={testimonial.isVisible ? "default" : "secondary"}
                  >
                    {testimonial.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(testimonial.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(testimonial)}>
                        <i className="ri-pencil-line mr-2 text-sm" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleVisibility(testimonial)}
                      >
                        {testimonial.isVisible ? (
                          <>
                            <i className="ri-eye-off-line mr-2 text-sm" />
                            Hide
                          </>
                        ) : (
                          <>
                            <i className="ri-eye-line mr-2 text-sm" />
                            Show
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(testimonial)}
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
