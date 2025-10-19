"use client";

import { Save, Eye, Globe, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BlogPostActionsProps {
  showPreview: boolean;
  isSaving: boolean;
  hasContent: boolean;
  hasTitle: boolean;
  useJsonImport: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  onToggleJsonImport: () => void;
}

export function BlogPostActions({
  showPreview,
  isSaving,
  hasContent,
  hasTitle,
  useJsonImport,
  onTogglePreview,
  onSave,
  onPublish,
  onToggleJsonImport,
}: BlogPostActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={useJsonImport ? "default" : "outline"}
        onClick={onToggleJsonImport}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        {useJsonImport ? "Form Mode" : "JSON Import"}
      </Button>
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


