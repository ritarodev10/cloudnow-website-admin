"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/ui/page-title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
type MediaType = "image" | "video" | "document" | "audio";

interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  size: number; // in bytes
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

// Media items will be fetched from UploadThing API or database

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getMediaTypeIcon(type: MediaType): string {
  switch (type) {
    case "image":
      return "ri-image-line";
    case "video":
      return "ri-video-line";
    case "document":
      return "ri-file-text-line";
    case "audio":
      return "ri-music-line";
    default:
      return "ri-file-line";
  }
}

function getMediaTypeColor(type: MediaType): string {
  switch (type) {
    case "image":
      return "bg-blue-500";
    case "video":
      return "bg-purple-500";
    case "document":
      return "bg-orange-500";
    case "audio":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

export function MediaClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]); // Will be fetched from API

  // Filter and search media items
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, typeFilter]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log("Upload clicked");
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete clicked for:", selectedItems);
    setSelectedItems([]);
  };

  return (
    <PageTitle
      title="Media Library"
      description="Manage and organize your media files"
    >
      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <i
              className={
                viewMode === "grid" ? "ri-list-check" : "ri-grid-line"
              }
            />
          </Button>
          {selectedItems.length > 0 && (
            <Button variant="destructive" onClick={handleDelete}>
              <i className="ri-delete-bin-line mr-2" />
              Delete ({selectedItems.length})
            </Button>
          )}
          <Button onClick={handleUpload}>
            <i className="ri-upload-cloud-line mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{mediaItems.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <i className="ri-folder-line text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">
                  {mediaItems.filter((item) => item.type === "image")
                    .length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <i className="ri-image-line text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">
                  {mediaItems.filter((item) => item.type === "video")
                    .length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <i className="ri-video-line text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(
                    mediaItems.reduce((sum, item) => sum + item.size, 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <i className="ri-database-line text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid/List */}
      <Card>
        <CardContent className="pt-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <i className="ri-inbox-line text-4xl text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No media files found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload your first media file to get started"}
              </p>
              {!searchQuery && typeFilter === "all" && (
                <Button onClick={handleUpload}>
                  <i className="ri-upload-cloud-line mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-sm"
                >
                  {selectedItems.length === filteredItems.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length} file{filteredItems.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`group relative cursor-pointer rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "bg-background/80 border-background group-hover:border-primary"
                            }`}
                          >
                            {isSelected && (
                              <i className="ri-check-line text-white text-xs" />
                            )}
                          </div>
                        </div>

                        {/* Media Preview */}
                        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
                          {item.type === "image" && item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : item.type === "video" && item.thumbnail ? (
                            <div className="relative w-full h-full">
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <i className="ri-play-circle-fill text-white text-3xl" />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${getMediaTypeColor(
                                item.type
                              )}`}
                            >
                              <i
                                className={`${getMediaTypeIcon(
                                  item.type
                                )} text-white text-3xl`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Media Info */}
                        <div className="p-3 space-y-1">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <span>{formatFileSize(item.size)}</span>
                          </div>
                          {item.dimensions && (
                            <p className="text-xs text-muted-foreground">
                              {item.dimensions.width} × {item.dimensions.height}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-2">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent/50"
                        }`}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        {/* Selection Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-input"
                          }`}
                        >
                          {isSelected && (
                            <i className="ri-check-line text-white text-xs" />
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {item.type === "image" && item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : item.type === "video" && item.thumbnail ? (
                            <div className="relative w-full h-full">
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <i className="ri-play-circle-fill text-white text-xl" />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${getMediaTypeColor(
                                item.type
                              )}`}
                            >
                              <i
                                className={`${getMediaTypeIcon(
                                  item.type
                                )} text-white text-xl`}
                              />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{item.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(item.size)}</span>
                            {item.dimensions && (
                              <span>
                                {item.dimensions.width} × {item.dimensions.height}
                              </span>
                            )}
                            <span>•</span>
                            <span>{formatDate(item.uploadedAt)}</span>
                            <span>•</span>
                            <span>{item.uploadedBy}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement view/preview
                              console.log("View:", item.id);
                            }}
                          >
                            <i className="ri-eye-line" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement download
                              console.log("Download:", item.id);
                            }}
                          >
                            <i className="ri-download-line" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </PageTitle>
  );
}




