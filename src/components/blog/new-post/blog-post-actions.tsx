"use client";

import { Save, Eye, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BlogPostActionsProps {
  showPreview: boolean;
  isSaving: boolean;
  hasContent: boolean;
  hasTitle: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onPublish: () => void;
}

export function BlogPostActions({
  showPreview,
  isSaving,
  hasContent,
  hasTitle,
  onTogglePreview,
  onSave,
  onPublish,
}: BlogPostActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onTogglePreview}
        disabled={!hasContent}
      >
        <Eye className="h-4 w-4 mr-2" />
        {showPreview ? "Edit" : "Preview"}
      </Button>
      <Button variant="outline" onClick={onSave} disabled={isSaving}>
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Saving..." : "Save Draft"}
      </Button>
      <Button
        onClick={onPublish}
        disabled={isSaving || !hasTitle || !hasContent}
      >
        <Globe className="h-4 w-4 mr-2" />
        {isSaving ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
}


