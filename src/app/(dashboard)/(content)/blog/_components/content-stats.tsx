"use client";

import { useMemo } from "react";

interface ContentStatsProps {
  content: string;
}

export function ContentStats({ content }: ContentStatsProps) {
  // Strip HTML tags for counting
  const stats = useMemo(() => {
    if (typeof window === "undefined") {
      // Fallback for SSR
      const textContent = content.replace(/<[^>]*>/g, "");
      const words = textContent.trim().split(/\s+/).filter((word) => word.length > 0).length;
      const characters = textContent.length;
      const readingTime = Math.ceil(words / 200);
      return { words, characters, readingTime };
    }

    const tmp = document.createElement("DIV");
    tmp.innerHTML = content;
    const textContent = tmp.textContent || tmp.innerText || "";
    const words = textContent.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const characters = textContent.length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    return { words, characters, readingTime };
  }, [content]);

  const { words, characters, readingTime } = stats;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Content Stats</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Words</span>
          <span className="font-medium">{words}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Characters</span>
          <span className="font-medium">{characters}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Reading Time</span>
          <span className="font-medium">{readingTime} min</span>
        </div>
      </div>
    </div>
  );
}

