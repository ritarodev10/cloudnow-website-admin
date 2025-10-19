"use client";

import { Hash } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EditorState } from "@/types/blog-strapi";

interface ContentStatsProps {
  editorState: EditorState;
}

export function ContentStats({ editorState }: ContentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Content Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Words</span>
          <span className="font-medium">{editorState.wordCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Characters</span>
          <span className="font-medium">{editorState.characterCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Reading Time</span>
          <span className="font-medium">{editorState.readingTime} min</span>
        </div>
        {editorState.lastSaved && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Saved</span>
            <span className="text-sm">{editorState.lastSaved}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


