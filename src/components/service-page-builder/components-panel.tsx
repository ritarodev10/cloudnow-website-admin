"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { blockRegistry, getBlocksByCategory } from "../service-page-blocks/block-registry";
import { BlockType, BlockCategory } from "@/types/service-page-builder";

interface ComponentsPanelProps {
  onAddBlock: (blockType: BlockType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ComponentsPanel({ onAddBlock, isCollapsed = false, onToggleCollapse }: ComponentsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<BlockCategory>>(new Set(["header", "content"]));

  const categories: { id: BlockCategory; name: string; description: string }[] = [
    { id: "header", name: "Header", description: "Hero sections and headers" },
    { id: "content", name: "Content", description: "Text, features, and information" },
    { id: "conversion", name: "Conversion", description: "CTAs and pricing" },
    { id: "social-proof", name: "Social Proof", description: "Testimonials and stats" },
    { id: "media", name: "Media", description: "Images and videos" },
    { id: "forms", name: "Forms", description: "Contact forms and inputs" },
  ];

  const toggleCategory = (categoryId: BlockCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredBlocks = Object.values(blockRegistry).filter(
    (block) =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blocksByCategory = categories.reduce((acc, category) => {
    acc[category.id] = getBlocksByCategory(category.id).filter(
      (block) =>
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return acc;
  }, {} as Record<BlockCategory, any[]>);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="mb-4">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Components</h3>
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchTerm ? (
          // Show filtered results
          <div className="space-y-2">
            {filteredBlocks.map((block) => (
              <Card
                key={block.type}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onAddBlock(block.type)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{block.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{block.name}</h4>
                      <p className="text-xs text-gray-600">{block.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Show categorized results
          <div className="space-y-4">
            {categories.map((category) => {
              const blocks = blocksByCategory[category.id];
              const isExpanded = expandedCategories.has(category.id);

              if (blocks.length === 0) return null;

              return (
                <div key={category.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-gray-600">{category.description}</div>
                    </div>
                    {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                  </Button>

                  {isExpanded && (
                    <div className="ml-4 space-y-2 mt-2">
                      {blocks.map((block) => (
                        <Card
                          key={block.type}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onAddBlock(block.type)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{block.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{block.name}</h4>
                                <p className="text-xs text-gray-600">{block.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
