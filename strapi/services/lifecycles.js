/**
 * Service Collection Lifecycle Hooks
 * Handles slug generation, validation, and metadata updates
 */

module.exports = {
  /**
   * Before create/update - Auto-generate slug and validate data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = generateSlug(data.title);
    }

    // Validate pageContent structure
    if (data.pageContent) {
      validatePageContent(data.pageContent);
    }

    // Set initial metadata for pageContent
    if (data.pageContent && !data.pageContent.metadata) {
      data.pageContent.metadata = {
        lastEditedAt: new Date().toISOString(),
        version: 1,
      };
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update pageContent metadata
    if (data.pageContent) {
      validatePageContent(data.pageContent);

      // Increment version and update timestamp
      if (data.pageContent.metadata) {
        data.pageContent.metadata.lastEditedAt = new Date().toISOString();
        data.pageContent.metadata.version = (data.pageContent.metadata.version || 1) + 1;
      } else {
        data.pageContent.metadata = {
          lastEditedAt: new Date().toISOString(),
          version: 1,
        };
      }
    }
  },

  /**
   * After create/update - Additional processing
   */
  async afterCreate(event) {
    const { result } = event;

    // Log service creation
    strapi.log.info(`Service created: ${result.title} (ID: ${result.id})`);

    // Update related data if needed
    await updateServiceStats();
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log service update
    strapi.log.info(`Service updated: ${result.title} (ID: ${result.id})`);

    // Update related data if needed
    await updateServiceStats();
  },

  /**
   * After delete - Cleanup
   */
  async afterDelete(event) {
    const { result } = event;

    // Log service deletion
    strapi.log.info(`Service deleted: ${result.title} (ID: ${result.id})`);

    // Update related data if needed
    await updateServiceStats();
  },
};

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Validate pageContent JSON structure
 */
function validatePageContent(pageContent) {
  if (!pageContent || typeof pageContent !== "object") {
    throw new Error("pageContent must be a valid object");
  }

  if (!Array.isArray(pageContent.blocks)) {
    throw new Error("pageContent.blocks must be an array");
  }

  // Validate each block
  pageContent.blocks.forEach((block, index) => {
    if (!block.id || !block.type) {
      throw new Error(`Block at index ${index} must have id and type`);
    }

    if (typeof block.props !== "object") {
      throw new Error(`Block at index ${index} must have valid props object`);
    }

    if (typeof block.order !== "number") {
      throw new Error(`Block at index ${index} must have numeric order`);
    }
  });

  // Validate metadata
  if (pageContent.metadata) {
    if (!pageContent.metadata.version || typeof pageContent.metadata.version !== "number") {
      throw new Error("pageContent.metadata.version must be a number");
    }
  }
}

/**
 * Update service statistics (placeholder for future implementation)
 */
async function updateServiceStats() {
  try {
    // TODO: Implement service statistics update
    // This could update cache, generate reports, etc.
    strapi.log.debug("Service stats updated");
  } catch (error) {
    strapi.log.error("Failed to update service stats:", error);
  }
}

