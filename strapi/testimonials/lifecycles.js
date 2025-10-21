/**
 * Testimonials Collection Lifecycle Hooks
 * Handles validation, group relationships, and metadata updates
 */

module.exports = {
  /**
   * Testimonial Collection Lifecycle Hooks
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate rating range
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate categories array
    if (data.categories && !Array.isArray(data.categories)) {
      throw new Error("Categories must be an array");
    }

    // Validate image URL if provided
    if (data.image && data.image.trim()) {
      try {
        new URL(data.image);
      } catch {
        throw new Error("Please provide a valid image URL");
      }
    }

    // Set default values
    if (!data.rating) {
      data.rating = 5;
    }
    if (!data.categories) {
      data.categories = [];
    }
    if (data.isVisible === undefined) {
      data.isVisible = true;
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate rating range
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate categories array
    if (data.categories && !Array.isArray(data.categories)) {
      throw new Error("Categories must be an array");
    }

    // Validate image URL if provided
    if (data.image && data.image.trim()) {
      try {
        new URL(data.image);
      } catch {
        throw new Error("Please provide a valid image URL");
      }
    }
  },

  /**
   * After create/update - Update related groups
   */
  async afterCreate(event) {
    const { result } = event;

    // Log testimonial creation
    strapi.log.info(`Testimonial created: ${result.name} (ID: ${result.id})`);

    // Update group relationships if needed
    await updateGroupRelationships(result.id);
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log testimonial update
    strapi.log.info(`Testimonial updated: ${result.name} (ID: ${result.id})`);

    // Update group relationships if needed
    await updateGroupRelationships(result.id);
  },

  /**
   * After delete - Cleanup group relationships
   */
  async afterDelete(event) {
    const { result } = event;

    // Log testimonial deletion
    strapi.log.info(`Testimonial deleted: ${result.name} (ID: ${result.id})`);

    // Remove from all groups
    await removeFromAllGroups(result.id);
  },
};

/**
 * Update group relationships for a testimonial
 */
async function updateGroupRelationships(testimonialId) {
  try {
    // Find all groups that contain this testimonial
    const groups = await strapi.entityService.findMany("api::testimonial-group.testimonial-group", {
      filters: {
        testimonials: {
          id: testimonialId,
        },
      },
      populate: ["testimonials"],
    });

    // Update each group's order array
    for (const group of groups) {
      const testimonialIds = group.testimonials.map((t) => t.id.toString());

      // Ensure testimonial is in the order array
      if (!group.order.includes(testimonialId)) {
        group.order.push(testimonialId);
      }

      // Update the group
      await strapi.entityService.update("api::testimonial-group.testimonial-group", group.id, {
        data: {
          order: group.order,
        },
      });
    }
  } catch (error) {
    strapi.log.error("Failed to update group relationships:", error);
  }
}

/**
 * Remove testimonial from all groups
 */
async function removeFromAllGroups(testimonialId) {
  try {
    // Find all groups that contain this testimonial
    const groups = await strapi.entityService.findMany("api::testimonial-group.testimonial-group", {
      filters: {
        testimonials: {
          id: testimonialId,
        },
      },
      populate: ["testimonials"],
    });

    // Remove from each group
    for (const group of groups) {
      const updatedTestimonials = group.testimonials.filter((t) => t.id.toString() !== testimonialId);
      const updatedOrder = group.order.filter((id) => id !== testimonialId);

      await strapi.entityService.update("api::testimonial-group.testimonial-group", group.id, {
        data: {
          testimonials: updatedTestimonials.map((t) => t.id),
          order: updatedOrder,
        },
      });
    }
  } catch (error) {
    strapi.log.error("Failed to remove testimonial from groups:", error);
  }
}

/**
 * Testimonial Group Collection Lifecycle Hooks
 */
module.exports.testimonialGroup = {
  /**
   * Before create/update - Validate group data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate order array matches testimonialIds
    if (data.order && data.testimonialIds) {
      const orderSet = new Set(data.order);
      const testimonialIdsSet = new Set(data.testimonialIds);

      if (orderSet.size !== testimonialIdsSet.size || ![...orderSet].every((id) => testimonialIdsSet.has(id))) {
        throw new Error("Order array must contain exactly the same testimonial IDs");
      }
    }

    // Set default values
    if (!data.order) {
      data.order = data.testimonialIds || [];
    }
    if (!data.usagePaths) {
      data.usagePaths = [];
    }
    if (data.isActive === undefined) {
      data.isActive = true;
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate order array matches testimonialIds
    if (data.order && data.testimonialIds) {
      const orderSet = new Set(data.order);
      const testimonialIdsSet = new Set(data.testimonialIds);

      if (orderSet.size !== testimonialIdsSet.size || ![...orderSet].every((id) => testimonialIdsSet.has(id))) {
        throw new Error("Order array must contain exactly the same testimonial IDs");
      }
    }
  },

  /**
   * After create/update - Log group changes
   */
  async afterCreate(event) {
    const { result } = event;
    strapi.log.info(`Testimonial group created: ${result.name} (ID: ${result.id})`);
  },

  async afterUpdate(event) {
    const { result } = event;
    strapi.log.info(`Testimonial group updated: ${result.name} (ID: ${result.id})`);
  },

  /**
   * After delete - Log group deletion
   */
  async afterDelete(event) {
    const { result } = event;
    strapi.log.info(`Testimonial group deleted: ${result.name} (ID: ${result.id})`);
  },
};
