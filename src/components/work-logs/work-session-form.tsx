"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkSession } from "@/types";
import {
  timeToMinutes,
  validateWorkSession,
} from "@/lib/work-log-utils";

interface WorkSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Partial<WorkSession>) => void;
  onDelete?: (sessionId: string) => void;
  session?: Partial<WorkSession>;
  isEditing?: boolean;
}

const PROJECTS = [
  "Dashboard Redesign",
  "Content Marketing",
  "Marketing Campaign",
  "API Development",
  "Bug Fixes",
  "Code Review",
  "Documentation",
  "Testing",
  "Other",
];

const CATEGORIES = [
  "Development",
  "Design",
  "Writing",
  "Marketing",
  "Research",
  "Meeting",
  "Administrative",
  "Other",
];

export function WorkSessionForm({
  isOpen,
  onClose,
  onSave,
  onDelete,
  session,
  isEditing = false,
}: WorkSessionFormProps) {
  const [formData, setFormData] = useState<Partial<WorkSession>>({
    startTime: "09:00",
    endTime: "17:00",
    description: "",
    project: "",
    category: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      setFormData({
        ...session,
        startTime: session.startTime || "09:00",
        endTime: session.endTime || "17:00",
        description: session.description || "",
        project: session.project || "",
        category: session.category || "",
      });
    } else {
      setFormData({
        startTime: "09:00",
        endTime: "17:00",
        description: "",
        project: "",
        category: "",
      });
    }
    setErrors([]);
  }, [session, isOpen]);

  const handleSave = () => {
    const validationErrors = validateWorkSession(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (session?.id && onDelete) {
      onDelete(session.id);
      onClose();
    }
  };

  const calculateDuration = (): string => {
    if (!formData.startTime || !formData.endTime) return "0h 0m";

    const start = timeToMinutes(formData.startTime);
    const end = timeToMinutes(formData.endTime);
    const duration = end - start;

    if (duration <= 0) return "0h 0m";

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Work Session" : "Add Work Session"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your work session."
              : "Add a new work session to your timeline."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
                className={
                  errors.some((e) => e.includes("time")) ? "border-red-500" : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
                className={
                  errors.some((e) => e.includes("time")) ? "border-red-500" : ""
                }
              />
            </div>
          </div>

          {/* Duration Display */}
          <div className="text-center">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="text-lg font-semibold text-blue-600">
              {calculateDuration()}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="What did you work on?"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={
                errors.some((e) => e.includes("Description"))
                  ? "border-red-500"
                  : ""
              }
              rows={3}
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.project}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, project: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {PROJECTS.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {isEditing && session?.id && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Update" : "Add"} Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



