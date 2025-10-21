"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { XIcon, PlusIcon, TrashIcon } from "lucide-react";
import { PageBlock, BlockType } from "@/types/service-page-builder";
import { testimonialGroups } from "@/data/testimonial-groups";
import { blockRegistry } from "@/components/service-page-blocks/block-registry";

interface SettingsPanelProps {
  selectedBlock?: PageBlock;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onUpdateBlock: (blockId: string, props: Record<string, any>) => void;
}

export function SettingsPanel({
  selectedBlock,
  isCollapsed = false,
  onToggleCollapse,
  onUpdateBlock,
}: SettingsPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedBlock) {
      setLocalProps(selectedBlock.props);
    }
  }, [selectedBlock]);

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);

    if (selectedBlock) {
      onUpdateBlock(selectedBlock.id, newProps);
    }
  };

  const handleArrayItemAdd = (key: string, newItem: any) => {
    const currentArray = localProps[key] || [];
    const updatedArray = [...currentArray, newItem];
    handlePropChange(key, updatedArray);
  };

  const handleArrayItemRemove = (key: string, index: number) => {
    const currentArray = localProps[key] || [];
    const updatedArray = currentArray.filter((_: any, i: number) => i !== index);
    handlePropChange(key, updatedArray);
  };

  const handleArrayItemUpdate = (key: string, index: number, field: string, value: any) => {
    const currentArray = localProps[key] || [];
    const updatedArray = currentArray.map((item: any, i: number) => (i === index ? { ...item, [field]: value } : item));
    handlePropChange(key, updatedArray);
  };

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="mb-4">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const blockDefinition = blockRegistry[selectedBlock.type];

  const renderInput = (key: string, value: any, type: string = "text") => {
    // Special handling for testimonials group selection
    if (key === "groupId" && selectedBlock?.type === "testimonials") {
      return (
        <Select value={value || ""} onValueChange={(val) => handlePropChange(key, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select testimonial group..." />
          </SelectTrigger>
          <SelectContent>
            {testimonialGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{group.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {group.testimonialIds.length} testimonials
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Special handling for display style selection
    if (key === "displayStyle" && selectedBlock?.type === "testimonials") {
      return (
        <Select value={value || "grid"} onValueChange={(val) => handlePropChange(key, val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select display style..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid Layout</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="list">List Layout</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    switch (type) {
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handlePropChange(key, e.target.value)}
            placeholder={`Enter ${key}...`}
          />
        );
      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => handlePropChange(key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${key}...`} />
            </SelectTrigger>
            <SelectContent>{/* Add select options based on key */}</SelectContent>
          </Select>
        );
      case "boolean":
        return <Switch checked={value || false} onCheckedChange={(checked) => handlePropChange(key, checked)} />;
      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => handlePropChange(key, parseInt(e.target.value) || 0)}
            placeholder={`Enter ${key}...`}
          />
        );
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => handlePropChange(key, e.target.value)}
            placeholder={`Enter ${key}...`}
          />
        );
    }
  };

  const renderArrayField = (key: string, array: any[]) => {
    return (
      <div className="space-y-3">
        {array.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Item {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleArrayItemRemove(key, index)}
                className="h-6 w-6 p-0"
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
            {Object.keys(item).map((field) => (
              <div key={field} className="mb-2">
                <Label className="text-xs">{field}</Label>
                {renderInput(`${key}.${index}.${field}`, item[field])}
              </div>
            ))}
          </Card>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleArrayItemAdd(key, { id: Date.now().toString(), title: "", description: "" })}
          className="w-full"
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>
    );
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Block Settings</h3>
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{blockDefinition.icon}</span>
          <div>
            <div className="font-medium text-sm">{blockDefinition.name}</div>
            <div className="text-xs text-gray-600">{blockDefinition.description}</div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {Object.keys(localProps).map((key) => {
            const value = localProps[key];
            const isArray = Array.isArray(value);

            return (
              <div key={key}>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>

                {isArray ? renderArrayField(key, value) : renderInput(key, value)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
