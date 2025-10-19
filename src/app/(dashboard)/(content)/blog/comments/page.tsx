"use client";

import { useState } from "react";
import {
  CheckIcon,
  XIcon,
  TrashIcon,
  MessageSquareIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  blogComments,
  searchComments,
  filterCommentsByStatus,
  formatCommentDate,
  BlogComment,
} from "@/data/blog-comments";

export default function BlogCommentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredComments = filterCommentsByStatus(
    searchComments(blogComments, searchTerm),
    filterStatus
  );

  const handleApprove = (comment: BlogComment) => {
    console.log("Approve comment:", comment);
    // TODO: Implement approve functionality
  };

  const handleReject = (comment: BlogComment) => {
    console.log("Reject comment:", comment);
    // TODO: Implement reject functionality
  };

  const handleDelete = (comment: BlogComment) => {
    console.log("Delete comment:", comment);
    // TODO: Implement delete functionality
  };

  const getStatusBadge = (status: string, isSpam: boolean) => {
    if (isSpam) {
      return <Badge variant="destructive">Spam</Badge>;
    }

    switch (status) {
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="outline">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return formatCommentDate(dateString);
  };

  return (
    <PageTitle
      title="Blog Comments"
      description="Manage blog post comments and moderation."
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Input
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <UserIcon className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{comment.author}</h3>
                        <p className="text-sm text-muted-foreground">
                          {comment.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(comment.status, comment.isSpam)}
                      <div className="flex gap-1">
                        {comment.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(comment)}
                            >
                              <CheckIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(comment)}
                            >
                              <XIcon className="size-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm">{comment.content}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquareIcon className="size-3" />
                      <span>Post: {comment.postTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredComments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No comments found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </PageTitle>
  );
}
