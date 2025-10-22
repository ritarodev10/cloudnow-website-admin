"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  GripVerticalIcon,
  CopyIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EditIcon,
} from "lucide-react";
import { PageBlock } from "@/types/service-page-builder";
import { BlockRenderer } from "../service-page-blocks/block-renderer";
import { blockRegistry } from "../service-page-blocks/block-registry";

interface CanvasAreaProps {
  blocks: PageBlock[];
  selectedBlockId?: string;
  previewDevice: "desktop" | "tablet" | "mobile";
  onSelectBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onEditBlock: (blockId: string) => void;
}

export function CanvasArea({
  blocks,
  selectedBlockId,
  previewDevice,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onEditBlock,
}: CanvasAreaProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | undefined>();

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-2xl";
      case "desktop":
      default:
        return "max-w-full";
    }
  };

  const renderBlockWrapper = (block: PageBlock, index: number) => {
    const isSelected = selectedBlockId === block.id;
    const isHovered = hoveredBlockId === block.id;
    const blockDefinition = blockRegistry[block.type];
    const canMoveUp = index > 0;
    const canMoveDown = index < blocks.length - 1;

    return (
      <div
        key={block.id}
        className={`relative group ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
        onMouseEnter={() => setHoveredBlockId(block.id)}
        onMouseLeave={() => setHoveredBlockId(undefined)}
        onClick={() => onSelectBlock(block.id)}
      >
        {/* Block Controls */}
        {(isSelected || isHovered) && (
          <div className="absolute -left-12 top-0 z-10 flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onEditBlock(block.id);
              }}
            >
              <EditIcon className="h-3 w-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateBlock(block.id);
              }}
            >
              <CopyIcon className="h-3 w-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBlock(block.id);
              }}
            >
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Drag Handle */}
        {(isSelected || isHovered) && (
          <div className="absolute -right-12 top-0 z-10 flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white shadow-md"
              disabled={!canMoveUp}
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveUp) onMoveBlock(block.id, "up");
              }}
            >
              <ChevronUpIcon className="h-3 w-3" />
            </Button>

            <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded border">
              <GripVerticalIcon className="h-3 w-3 text-gray-500" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white shadow-md"
              disabled={!canMoveDown}
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveDown) onMoveBlock(block.id, "down");
              }}
            >
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Block Content */}
        <div className="relative">
          <BlockRenderer block={block} isPreview={true} />

          {/* Block Label */}
          {(isSelected || isHovered) && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="text-xs">
                {blockDefinition.icon} {blockDefinition.name}
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto">
      <div className="min-h-full py-8">
        <div className={`mx-auto px-4 ${getPreviewWidth()}`}>
          {blocks.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <PlusIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your page</h3>
                <p className="text-gray-600 mb-4">Add components from the left panel to create your service page</p>
                <div className="text-sm text-gray-500">Drag and drop components or click to add them</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-0">{blocks.map((block, index) => renderBlockWrapper(block, index))}</div>
          )}
        </div>
      </div>
    </div>
  );
}

