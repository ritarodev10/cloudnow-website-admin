import { PageBlock, PageContent, BlockType } from "@/types/service-page-builder";
import { 
  createBlockInstance, 
  duplicateBlock, 
  reorderBlocks, 
  moveBlockUp, 
  moveBlockDown, 
  removeBlock, 
  addBlockAtPosition, 
  updateBlockProps,
  getPageStatistics 
} from "@/data/service-blocks";

// Block manipulation helpers
export const addBlock = (blocks: PageBlock[], blockType: BlockType, position?: number): PageBlock[] => {
  const newBlock = createBlockInstance(blockType);
  
  if (position !== undefined) {
    return addBlockAtPosition(blocks, newBlock, position);
  }
  
  return [...blocks, { ...newBlock, order: blocks.length }];
};

export const deleteBlock = (blocks: PageBlock[], blockId: string): PageBlock[] => {
  return removeBlock(blocks, blockId);
};

export const moveBlock = (blocks: PageBlock[], blockId: string, direction: "up" | "down"): PageBlock[] => {
  if (direction === "up") {
    return moveBlockUp(blocks, blockId);
  } else {
    return moveBlockDown(blocks, blockId);
  }
};

export const cloneBlock = (blocks: PageBlock[], blockId: string): PageBlock[] => {
  const blockToClone = blocks.find(block => block.id === blockId);
  if (!blockToClone) return blocks;
  
  const clonedBlock = duplicateBlock(blockToClone);
  const insertIndex = blocks.findIndex(block => block.id === blockId) + 1;
  
  return addBlockAtPosition(blocks, clonedBlock, insertIndex);
};

export const updateBlock = (blocks: PageBlock[], blockId: string, newProps: Record<string, any>): PageBlock[] => {
  return updateBlockProps(blocks, blockId, newProps);
};

export const reorderBlocksByDrag = (blocks: PageBlock[], fromIndex: number, toIndex: number): PageBlock[] => {
  return reorderBlocks(blocks, fromIndex, toIndex);
};

// Template application logic
export const applyTemplate = (templateBlocks: PageBlock[]): PageBlock[] => {
  return templateBlocks.map((block, index) => ({
    ...block,
    id: `block_${Date.now()}_${index}`,
    order: index
  }));
};

// Export/import page content
export const exportPageContent = (pageContent: PageContent): string => {
  return JSON.stringify(pageContent, null, 2);
};

export const importPageContent = (jsonString: string): PageContent | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate the structure
    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      throw new Error("Invalid page content structure");
    }
    
    if (!parsed.metadata) {
      parsed.metadata = {
        lastEditedAt: new Date(),
        version: 1
      };
    }
    
    return parsed as PageContent;
  } catch (error) {
    console.error("Error importing page content:", error);
    return null;
  }
};

// Validation helpers
export const validatePageContent = (pageContent: PageContent): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!pageContent.blocks || !Array.isArray(pageContent.blocks)) {
    errors.push("Page content must have a blocks array");
    return { isValid: false, errors };
  }
  
  if (!pageContent.metadata) {
    errors.push("Page content must have metadata");
  }
  
  // Check for duplicate block IDs
  const blockIds = pageContent.blocks.map(block => block.id);
  const uniqueIds = new Set(blockIds);
  if (blockIds.length !== uniqueIds.size) {
    errors.push("Duplicate block IDs found");
  }
  
  // Check block order
  const orders = pageContent.blocks.map(block => block.order);
  const sortedOrders = [...orders].sort((a, b) => a - b);
  if (JSON.stringify(orders) !== JSON.stringify(sortedOrders)) {
    errors.push("Block orders are not sequential");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Page content statistics
export const getPageContentStats = (pageContent: PageContent) => {
  return getPageStatistics(pageContent.blocks);
};

// Block search and filtering
export const searchBlocks = (blocks: PageBlock[], query: string): PageBlock[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return blocks.filter(block => {
    // Search in block type
    if (block.type.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Search in props (text content)
    const propsString = JSON.stringify(block.props).toLowerCase();
    if (propsString.includes(lowercaseQuery)) {
      return true;
    }
    
    return false;
  });
};

export const filterBlocksByType = (blocks: PageBlock[], blockType: BlockType): PageBlock[] => {
  return blocks.filter(block => block.type === blockType);
};

export const filterBlocksByCategory = (blocks: PageBlock[], category: string): PageBlock[] => {
  return blocks.filter(block => block.category === category);
};

// Block content analysis
export const analyzeBlockContent = (block: PageBlock): { hasText: boolean; hasImages: boolean; hasLinks: boolean } => {
  const props = block.props;
  
  return {
    hasText: !!(props.title || props.subtitle || props.description || props.content),
    hasImages: !!(props.src || props.backgroundImage || props.image),
    hasLinks: !!(props.ctaLink || props.buttonLink || props.link)
  };
};

// Page content optimization
export const optimizePageContent = (pageContent: PageContent): PageContent => {
  // Remove empty blocks
  const filteredBlocks = pageContent.blocks.filter(block => {
    const analysis = analyzeBlockContent(block);
    return analysis.hasText || analysis.hasImages || analysis.hasLinks;
  });
  
  // Reorder blocks
  const reorderedBlocks = filteredBlocks.map((block, index) => ({
    ...block,
    order: index
  }));
  
  return {
    ...pageContent,
    blocks: reorderedBlocks,
    metadata: {
      ...pageContent.metadata,
      lastEditedAt: new Date(),
      version: (pageContent.metadata.version || 1) + 1
    }
  };
};

// Block duplication with variations
export const duplicateBlockWithVariation = (block: PageBlock, variation: "copy" | "template"): PageBlock => {
  const duplicated = duplicateBlock(block);
  
  if (variation === "template") {
    // Reset props to defaults for template variation
    // This would require access to block registry, but for now just duplicate as-is
    return duplicated;
  }
  
  return duplicated;
};

// Batch operations
export const batchUpdateBlocks = (
  blocks: PageBlock[], 
  updates: Array<{ blockId: string; props: Record<string, any> }>
): PageBlock[] => {
  let updatedBlocks = [...blocks];
  
  updates.forEach(({ blockId, props }) => {
    updatedBlocks = updateBlockProps(updatedBlocks, blockId, props);
  });
  
  return updatedBlocks;
};

export const batchDeleteBlocks = (blocks: PageBlock[], blockIds: string[]): PageBlock[] => {
  return blocks.filter(block => !blockIds.includes(block.id));
};

// Page content comparison
export const comparePageContent = (content1: PageContent, content2: PageContent): boolean => {
  return JSON.stringify(content1) === JSON.stringify(content2);
};

export const getPageContentDiff = (oldContent: PageContent, newContent: PageContent) => {
  const oldBlocks = oldContent.blocks;
  const newBlocks = newContent.blocks;
  
  const added = newBlocks.filter(block => !oldBlocks.find(oldBlock => oldBlock.id === block.id));
  const removed = oldBlocks.filter(block => !newBlocks.find(newBlock => newBlock.id === block.id));
  const modified = newBlocks.filter(block => {
    const oldBlock = oldBlocks.find(oldBlock => oldBlock.id === block.id);
    return oldBlock && JSON.stringify(oldBlock.props) !== JSON.stringify(block.props);
  });
  
  return { added, removed, modified };
};
