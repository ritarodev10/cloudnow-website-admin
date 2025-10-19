"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPostPreviewProps {
  content: string;
}

export function BlogPostPreview({ content }: BlogPostPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}


