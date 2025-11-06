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

// Dummy data
const dummyMediaItems: MediaItem[] = [
  // Images
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    url: "/assets/images/hero-banner.jpg",
    thumbnail: "/assets/images/hero-banner.jpg",
    size: 245678,
    mimeType: "image/jpeg",
    uploadedAt: "2024-01-15T10:30:00Z",
    uploadedBy: "John Doe",
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "2",
    name: "company-logo.png",
    type: "image",
    url: "/assets/images/company-logo.png",
    thumbnail: "/assets/images/company-logo.png",
    size: 123456,
    mimeType: "image/png",
    uploadedAt: "2024-01-20T14:15:00Z",
    uploadedBy: "Jane Smith",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "3",
    name: "team-photo.jpg",
    type: "image",
    url: "/assets/images/team-photo.jpg",
    thumbnail: "/assets/images/team-photo.jpg",
    size: 567890,
    mimeType: "image/jpeg",
    uploadedAt: "2024-02-01T09:00:00Z",
    uploadedBy: "Mike Johnson",
    dimensions: { width: 1600, height: 1200 },
  },
  {
    id: "4",
    name: "product-screenshot.png",
    type: "image",
    url: "/assets/images/product-screenshot.png",
    thumbnail: "/assets/images/product-screenshot.png",
    size: 345678,
    mimeType: "image/png",
    uploadedAt: "2024-02-10T16:45:00Z",
    uploadedBy: "Sarah Wilson",
    dimensions: { width: 1280, height: 720 },
  },
  {
    id: "5",
    name: "icon-set.svg",
    type: "image",
    url: "/assets/images/icon-set.svg",
    thumbnail: "/assets/images/icon-set.svg",
    size: 45678,
    mimeType: "image/svg+xml",
    uploadedAt: "2024-02-15T11:20:00Z",
    uploadedBy: "John Doe",
    dimensions: { width: 256, height: 256 },
  },
  {
    id: "6",
    name: "background-gradient.jpg",
    type: "image",
    url: "/assets/images/background-gradient.jpg",
    thumbnail: "/assets/images/background-gradient.jpg",
    size: 789012,
    mimeType: "image/jpeg",
    uploadedAt: "2024-02-20T13:30:00Z",
    uploadedBy: "Jane Smith",
    dimensions: { width: 2560, height: 1440 },
  },
  // Videos
  {
    id: "7",
    name: "product-demo.mp4",
    type: "video",
    url: "/assets/videos/product-demo.mp4",
    thumbnail: "/assets/images/video-thumbnail-1.jpg",
    size: 4567890,
    mimeType: "video/mp4",
    uploadedAt: "2024-01-25T10:00:00Z",
    uploadedBy: "Mike Johnson",
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "8",
    name: "company-intro.mp4",
    type: "video",
    url: "/assets/videos/company-intro.mp4",
    thumbnail: "/assets/images/video-thumbnail-2.jpg",
    size: 6789012,
    mimeType: "video/mp4",
    uploadedAt: "2024-02-05T15:30:00Z",
    uploadedBy: "Sarah Wilson",
    dimensions: { width: 1280, height: 720 },
  },
  // Documents
  {
    id: "9",
    name: "company-brochure.pdf",
    type: "document",
    url: "/assets/documents/company-brochure.pdf",
    size: 2345678,
    mimeType: "application/pdf",
    uploadedAt: "2024-01-10T09:15:00Z",
    uploadedBy: "John Doe",
  },
  {
    id: "10",
    name: "annual-report-2023.pdf",
    type: "document",
    url: "/assets/documents/annual-report-2023.pdf",
    size: 5678901,
    mimeType: "application/pdf",
    uploadedAt: "2024-01-18T14:00:00Z",
    uploadedBy: "Jane Smith",
  },
  {
    id: "11",
    name: "presentation-deck.pptx",
    type: "document",
    url: "/assets/documents/presentation-deck.pptx",
    size: 3456789,
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    uploadedAt: "2024-02-08T11:45:00Z",
    uploadedBy: "Mike Johnson",
  },
  {
    id: "12",
    name: "data-sheet.xlsx",
    type: "document",
    url: "/assets/documents/data-sheet.xlsx",
    size: 1234567,
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploadedAt: "2024-02-12T16:20:00Z",
    uploadedBy: "Sarah Wilson",
  },
  // Audio
  {
    id: "13",
    name: "podcast-episode-1.mp3",
    type: "audio",
    url: "/assets/audio/podcast-episode-1.mp3",
    size: 8901234,
    mimeType: "audio/mpeg",
    uploadedAt: "2024-01-30T10:30:00Z",
    uploadedBy: "John Doe",
  },
  {
    id: "14",
    name: "background-music.mp3",
    type: "audio",
    url: "/assets/audio/background-music.mp3",
    size: 4567890,
    mimeType: "audio/mpeg",
    uploadedAt: "2024-02-14T13:00:00Z",
    uploadedBy: "Jane Smith",
  },
];

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

  // Filter and search media items
  const filteredItems = useMemo(() => {
    return dummyMediaItems.filter((item) => {
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
                <p className="text-2xl font-bold">{dummyMediaItems.length}</p>
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
                  {dummyMediaItems.filter((item) => item.type === "image")
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
                  {dummyMediaItems.filter((item) => item.type === "video")
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
                    dummyMediaItems.reduce((sum, item) => sum + item.size, 0)
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



