"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentsPanel } from "@/components/service-page-builder/components-panel";
import { CanvasArea } from "@/components/service-page-builder/canvas-area";
import { SettingsPanel } from "@/components/service-page-builder/settings-panel";
import { EditorNavbar } from "@/components/service-page-builder/editor-navbar";
import { PageBlock, PageContent, BlockType, EditorState } from "@/types/service-page-builder";
import { Service } from "@/types/services";
import { blockRegistry } from "@/components/service-page-blocks/block-registry";

interface ServicePageEditorProps {
  service?: Service;
  initialContent?: PageContent;
}

export function ServicePageEditor({ service, initialContent }: ServicePageEditorProps) {
  const router = useRouter();

  const [blocks, setBlocks] = useState<PageBlock[]>(initialContent?.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
  const [editorState, setEditorState] = useState<EditorState>({
    isPreviewMode: false,
    previewDevice: "desktop",
    isSaving: false,
    hasUnsavedChanges: false,
  });
  const [isComponentsPanelCollapsed, setIsComponentsPanelCollapsed] = useState(false);
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!editorState.hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave(true);
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [editorState.hasUnsavedChanges]);

  const generateBlockId = () => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addBlock = useCallback(
    (blockType: BlockType) => {
      const blockDefinition = blockRegistry[blockType];
      const newBlock: PageBlock = {
        id: generateBlockId(),
        type: blockType,
        category: blockDefinition.category,
        props: { ...blockDefinition.defaultProps },
        order: blocks.length,
      };

      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
      setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [blocks.length]
  );

  const updateBlock = useCallback((blockId: string, newProps: Record<string, any>) => {
    setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, props: newProps } : block)));
    setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const moveBlock = useCallback((blockId: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const currentIndex = prev.findIndex((block) => block.id === blockId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newBlocks = [...prev];
      [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];

      // Update order property
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
    setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const blockToDuplicate = blocks.find((block) => block.id === blockId);
      if (!blockToDuplicate) return;

      const duplicatedBlock: PageBlock = {
        ...blockToDuplicate,
        id: generateBlockId(),
        order: blocks.length,
      };

      setBlocks((prev) => [...prev, duplicatedBlock]);
      setSelectedBlockId(duplicatedBlock.id);
      setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [blocks]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) => prev.filter((block) => block.id !== blockId));
      if (selectedBlockId === blockId) {
        setSelectedBlockId(undefined);
      }
      setEditorState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [selectedBlockId]
  );

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      setEditorState((prev) => ({ ...prev, isSaving: true }));

      try {
        const pageContent: PageContent = {
          blocks: blocks.map((block, index) => ({ ...block, order: index })),
          metadata: {
            lastEditedAt: new Date(),
            version: 1,
          },
        };

        // TODO: Replace with actual API call
        console.log("Saving page content:", pageContent);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEditorState((prev) => ({
          ...prev,
          isSaving: false,
          hasUnsavedChanges: false,
          lastSaved: new Date(),
        }));

        if (!isAutoSave) {
          console.log("Page saved successfully!");
        }
      } catch (error) {
        console.error("Error saving page:", error);
        setEditorState((prev) => ({ ...prev, isSaving: false }));
      }
    },
    [blocks]
  );

  const handlePublish = useCallback(async () => {
    await handleSave();

    try {
      // TODO: Replace with actual API call
      console.log("Publishing service page...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to services list
      router.push("/services");
    } catch (error) {
      console.error("Error publishing page:", error);
    }
  }, [handleSave, router]);

  const handlePreview = () => {
    setEditorState((prev) => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  };

  const handleBack = () => {
    router.push("/services");
  };

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <EditorNavbar
        serviceTitle={service?.title}
        isSaving={editorState.isSaving}
        lastSaved={editorState.lastSaved}
        hasUnsavedChanges={editorState.hasUnsavedChanges}
        previewDevice={editorState.previewDevice}
        onPreviewDeviceChange={(device) => setEditorState((prev) => ({ ...prev, previewDevice: device }))}
        onSave={() => handleSave()}
        onPublish={handlePublish}
        onBack={handleBack}
        onPreview={handlePreview}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Components Panel */}
        <ComponentsPanel
          onAddBlock={addBlock}
          isCollapsed={isComponentsPanelCollapsed}
          onToggleCollapse={() => setIsComponentsPanelCollapsed(!isComponentsPanelCollapsed)}
        />

        {/* Canvas Area */}
        <CanvasArea
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          previewDevice={editorState.previewDevice}
          onSelectBlock={setSelectedBlockId}
          onMoveBlock={moveBlock}
          onDuplicateBlock={duplicateBlock}
          onDeleteBlock={deleteBlock}
          onEditBlock={(blockId) => setSelectedBlockId(blockId)}
        />

        {/* Settings Panel */}
        <SettingsPanel
          selectedBlock={selectedBlock}
          isCollapsed={isSettingsPanelCollapsed}
          onToggleCollapse={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
          onUpdateBlock={updateBlock}
        />
      </div>
    </div>
  );
}
