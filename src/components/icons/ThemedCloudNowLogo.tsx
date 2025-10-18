"use client";

import CloudNowLogo from "./CloudNowLogo";

interface ThemedCloudNowLogoProps {
  width?: number;
  className?: string;
}

export function ThemedCloudNowLogo({
  width = 200,
  className,
}: ThemedCloudNowLogoProps) {
  // Calculate height based on original aspect ratio (1000/4000)
  const aspectRatio = 1000 / 4000;
  const height = width * aspectRatio;

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative ${className || ""}`}
    >
      {/* Black logo for light mode */}
      <div className="absolute inset-0 transition-opacity duration-200 ease-in-out opacity-100 dark:opacity-0">
        <CloudNowLogo width={width} variant="white" />
      </div>

      {/* White logo for dark mode */}
      <div className="absolute inset-0 transition-opacity duration-200 ease-in-out opacity-0 dark:opacity-100">
        <CloudNowLogo width={width} variant="white" />
      </div>
    </div>
  );
}
