import { BlockType, BlockDefinition, PageBlock } from "@/types/service-page-builder";
import { blockRegistry } from "@/components/service-page-blocks/block-registry";

// Helper function to create a new block instance
export const createBlockInstance = (type: BlockType, customProps?: Record<string, any>): PageBlock => {
  const blockDefinition = blockRegistry[type];
  
  return {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    category: blockDefinition.category,
    props: {
      ...blockDefinition.defaultProps,
      ...customProps
    },
    order: 0
  };
};

// Helper function to duplicate a block
export const duplicateBlock = (block: PageBlock): PageBlock => {
  return {
    ...block,
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    order: block.order + 1
  };
};

// Helper function to validate block props
export const validateBlockProps = (type: BlockType, props: Record<string, any>): Record<string, string> => {
  const blockDefinition = blockRegistry[type];
  const errors: Record<string, string> = {};

  // Check required props
  blockDefinition.requiredProps.forEach(prop => {
    if (!props[prop] || (typeof props[prop] === 'string' && props[prop].trim() === '')) {
      errors[prop] = `${prop} is required`;
    }
  });

  // Type-specific validations
  switch (type) {
    case "hero":
      if (props.title && props.title.length < 3) {
        errors.title = "Title must be at least 3 characters";
      }
      break;
    
    case "features":
      if (props.features && !Array.isArray(props.features)) {
        errors.features = "Features must be an array";
      } else if (props.features && props.features.length === 0) {
        errors.features = "At least one feature is required";
      }
      break;
    
    case "cta":
      if (props.buttonText && props.buttonText.length < 2) {
        errors.buttonText = "Button text must be at least 2 characters";
      }
      break;
    
    case "faq":
      if (props.faqs && !Array.isArray(props.faqs)) {
        errors.faqs = "FAQs must be an array";
      } else if (props.faqs && props.faqs.length === 0) {
        errors.faqs = "At least one FAQ is required";
      }
      break;
    
    case "testimonials":
      if (props.testimonials && !Array.isArray(props.testimonials)) {
        errors.testimonials = "Testimonials must be an array";
      } else if (props.testimonials && props.testimonials.length === 0) {
        errors.testimonials = "At least one testimonial is required";
      }
      break;
    
    case "stats":
      if (props.stats && !Array.isArray(props.stats)) {
        errors.stats = "Stats must be an array";
      } else if (props.stats && props.stats.length === 0) {
        errors.stats = "At least one stat is required";
      }
      break;
    
    case "pricing":
      if (props.plans && !Array.isArray(props.plans)) {
        errors.plans = "Plans must be an array";
      } else if (props.plans && props.plans.length === 0) {
        errors.plans = "At least one plan is required";
      }
      break;
    
    case "text":
      if (props.content && props.content.length < 10) {
        errors.content = "Content must be at least 10 characters";
      }
      break;
    
    case "image":
      if (props.src && !isValidUrl(props.src)) {
        errors.src = "Please enter a valid image URL";
      }
      break;
  }

  return errors;
};

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to get block display name
export const getBlockDisplayName = (type: BlockType): string => {
  return blockRegistry[type]?.name || type;
};

// Helper function to get block icon
export const getBlockIcon = (type: BlockType): string => {
  return blockRegistry[type]?.icon || "📄";
};

// Helper function to get block category
export const getBlockCategory = (type: BlockType): string => {
  return blockRegistry[type]?.category || "content";
};

// Helper function to get all available block types
export const getAllBlockTypes = (): BlockType[] => {
  return Object.keys(blockRegistry) as BlockType[];
};

// Helper function to get blocks by category
export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return Object.values(blockRegistry).filter(block => block.category === category);
};

// Helper function to reorder blocks
export const reorderBlocks = (blocks: PageBlock[], fromIndex: number, toIndex: number): PageBlock[] => {
  const result = Array.from(blocks);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update order property
  return result.map((block, index) => ({ ...block, order: index }));
};

// Helper function to move block up
export const moveBlockUp = (blocks: PageBlock[], blockId: string): PageBlock[] => {
  const currentIndex = blocks.findIndex(block => block.id === blockId);
  if (currentIndex <= 0) return blocks;
  
  return reorderBlocks(blocks, currentIndex, currentIndex - 1);
};

// Helper function to move block down
export const moveBlockDown = (blocks: PageBlock[], blockId: string): PageBlock[] => {
  const currentIndex = blocks.findIndex(block => block.id === blockId);
  if (currentIndex === -1 || currentIndex >= blocks.length - 1) return blocks;
  
  return reorderBlocks(blocks, currentIndex, currentIndex + 1);
};

// Helper function to remove block
export const removeBlock = (blocks: PageBlock[], blockId: string): PageBlock[] => {
  return blocks.filter(block => block.id !== blockId);
};

// Helper function to add block at specific position
export const addBlockAtPosition = (
  blocks: PageBlock[], 
  newBlock: PageBlock, 
  position: number
): PageBlock[] => {
  const result = [...blocks];
  result.splice(position, 0, newBlock);
  
  // Update order property
  return result.map((block, index) => ({ ...block, order: index }));
};

// Helper function to update block props
export const updateBlockProps = (
  blocks: PageBlock[], 
  blockId: string, 
  newProps: Record<string, any>
): PageBlock[] => {
  return blocks.map(block => 
    block.id === blockId ? { ...block, props: { ...block.props, ...newProps } } : block
  );
};

// Helper function to get block count by type
export const getBlockCountByType = (blocks: PageBlock[]): Record<BlockType, number> => {
  const counts = {} as Record<BlockType, number>;
  
  Object.keys(blockRegistry).forEach(type => {
    counts[type as BlockType] = 0;
  });
  
  blocks.forEach(block => {
    counts[block.type] = (counts[block.type] || 0) + 1;
  });
  
  return counts;
};

// Helper function to get page statistics
export const getPageStatistics = (blocks: PageBlock[]) => {
  const blockCounts = getBlockCountByType(blocks);
  const totalBlocks = blocks.length;
  
  return {
    totalBlocks,
    blockCounts,
    hasHero: blockCounts.hero > 0,
    hasCta: blockCounts.cta > 0,
    hasTestimonials: blockCounts.testimonials > 0,
    hasStats: blockCounts.stats > 0,
    hasPricing: blockCounts.pricing > 0,
    categories: Object.values(blockRegistry).reduce((acc, blockDef) => {
      const count = blockCounts[blockDef.type];
      if (count > 0) {
        acc[blockDef.category] = (acc[blockDef.category] || 0) + count;
      }
      return acc;
    }, {} as Record<string, number>)
  };
};
