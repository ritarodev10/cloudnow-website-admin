"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SaveIcon,
  EyeIcon,
  MonitorIcon,
  TabletIcon,
  SmartphoneIcon,
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
} from "lucide-react";

interface EditorNavbarProps {
  serviceTitle?: string;
  isSaving?: boolean;
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
  previewDevice: "desktop" | "tablet" | "mobile";
  onPreviewDeviceChange: (device: "desktop" | "tablet" | "mobile") => void;
  onSave: () => void;
  onPublish: () => void;
  onBack: () => void;
  onPreview: () => void;
}

export function EditorNavbar({
  serviceTitle,
  isSaving = false,
  lastSaved,
  hasUnsavedChanges = false,
  previewDevice,
  onPreviewDeviceChange,
  onSave,
  onPublish,
  onBack,
  onPreview,
}: EditorNavbarProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Services
        </Button>

        <div className="h-6 w-px bg-gray-300" />

        <div>
          <h1 className="text-lg font-semibold text-gray-900">{serviceTitle || "Untitled Service"}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isSaving ? (
              <>
                <ClockIcon className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckIcon className="h-3 w-3 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            ) : (
              <span>Not saved</span>
            )}

            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Center Section - Preview Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-2">Preview:</span>
        <div className="flex border border-gray-300 rounded-md">
          <Button
            variant={previewDevice === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewDeviceChange("desktop")}
            className="rounded-r-none border-r border-gray-300"
          >
            <MonitorIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={previewDevice === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewDeviceChange("tablet")}
            className="rounded-none border-r border-gray-300"
          >
            <TabletIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={previewDevice === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewDeviceChange("mobile")}
            className="rounded-l-none"
          >
            <SmartphoneIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPreview} className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4" />
          Preview
        </Button>

        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving} className="flex items-center gap-2">
          <SaveIcon className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>

        <Button size="sm" onClick={onPublish} disabled={isSaving} className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}

