/**
 * Strapi Services Collection Configuration
 *
 * This file contains additional configuration and setup instructions
 * for the Services collection in Strapi.
 */

// Collection Configuration
export const ServicesConfig = {
  // Collection settings
  collectionName: "services",
  singularName: "service",
  pluralName: "services",

  // API settings
  api: {
    prefix: "/api",
    version: "v1",
  },

  // Content type settings
  contentType: {
    kind: "collectionType",
    draftAndPublish: true,
    autoPopulate: true,
  },

  // Field configurations
  fields: {
    title: {
      type: "string",
      required: true,
      unique: false,
      maxLength: 255,
      minLength: 3,
    },
    slug: {
      type: "uid",
      targetField: "title",
      required: true,
      unique: true,
    },
    description: {
      type: "text",
      required: true,
      maxLength: 1000,
      minLength: 10,
    },
    category: {
      type: "enumeration",
      enum: [
        "IT Consulting",
        "Cloud Solutions",
        "Hosting Services",
        "Backup & Recovery",
        "Cybersecurity",
        "Professional Services",
        "Microsoft Solutions",
        "Other",
      ],
      required: true,
      default: "Other",
    },
    status: {
      type: "enumeration",
      enum: ["draft", "active", "inactive"],
      default: "draft",
      required: true,
    },
    featured: {
      type: "boolean",
      default: false,
      required: false,
    },
    pageContent: {
      type: "json",
      required: false,
      default: {
        blocks: [],
        metadata: {
          lastEditedAt: null,
          version: 1,
        },
      },
    },
  },
};

// Validation Rules
export const ValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-&.,()]+$/,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  category: {
    required: true,
    enum: ServicesConfig.fields.category.enum,
  },
  status: {
    required: true,
    enum: ServicesConfig.fields.status.enum,
  },
  pageContent: {
    required: false,
    schema: {
      type: "object",
      properties: {
        blocks: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "type", "props", "order"],
            properties: {
              id: { type: "string" },
              type: { type: "string" },
              category: { type: "string" },
              props: { type: "object" },
              order: { type: "number" },
            },
          },
        },
        metadata: {
          type: "object",
          required: ["version"],
          properties: {
            lastEditedAt: { type: "string", format: "date-time" },
            version: { type: "number", minimum: 1 },
          },
        },
      },
    },
  },
};

// API Permissions Configuration
export const APIPermissions = {
  // Public permissions (for frontend)
  public: {
    "api::service.service": {
      controllers: {
        service: ["find", "findOne"],
      },
      actions: {
        "api::service.service.find": {
          enabled: true,
          conditions: [
            {
              field: "status",
              operator: "eq",
              value: "active",
            },
          ],
        },
        "api::service.service.findOne": {
          enabled: true,
          conditions: [
            {
              field: "status",
              operator: "eq",
              value: "active",
            },
          ],
        },
      },
    },
  },

  // Admin permissions (for CMS)
  admin: {
    "api::service.service": {
      controllers: {
        service: ["find", "findOne", "create", "update", "delete"],
      },
      actions: {
        "api::service.service.find": { enabled: true },
        "api::service.service.findOne": { enabled: true },
        "api::service.service.create": { enabled: true },
        "api::service.service.update": { enabled: true },
        "api::service.service.delete": { enabled: true },
      },
    },
  },
};

// Migration Scripts
export const MigrationScripts = {
  // Migrate from frontend data to Strapi
  async migrateFromFrontend(frontendData: any[]) {
    const migratedServices = [];

    for (const service of frontendData) {
      try {
        const migratedService = {
          title: service.title,
          description: service.description,
          category: service.category,
          status: service.status || "draft",
          featured: service.featured || false,
          pageContent: service.pageContent || {
            blocks: [],
            metadata: { version: 1 },
          },
        };

        migratedServices.push(migratedService);
      } catch (error) {
        console.error(`Failed to migrate service: ${service.title}`, error);
      }
    }

    return migratedServices;
  },

  // Validate existing data
  async validateExistingData(services: any[]) {
    const validationErrors = [];

    services.forEach((service, index) => {
      // Validate required fields
      if (!service.title || service.title.length < 3) {
        validationErrors.push(`Service ${index}: Invalid title`);
      }

      if (!service.description || service.description.length < 10) {
        validationErrors.push(`Service ${index}: Invalid description`);
      }

      if (!service.category || !ServicesConfig.fields.category.enum.includes(service.category)) {
        validationErrors.push(`Service ${index}: Invalid category`);
      }

      // Validate pageContent structure
      if (service.pageContent && !ValidationRules.pageContent.schema) {
        validationErrors.push(`Service ${index}: Invalid pageContent structure`);
      }
    });

    return validationErrors;
  },
};

// Setup Instructions
export const SetupInstructions = {
  // Step 1: Copy files to Strapi project
  copyFiles: `
    1. Copy schema.json to: src/api/services/content-types/service/schema.json
    2. Copy lifecycles.js to: src/api/services/content-types/service/lifecycles.js
    3. Copy seo.json to: src/components/shared/seo.json
    4. Restart Strapi server
  `,

  // Step 2: Configure permissions
  configurePermissions: `
    1. Go to Strapi Admin Panel
    2. Navigate to Settings > Users & Permissions Plugin > Roles
    3. Configure Public role permissions for Services
    4. Configure Authenticated role permissions for Services
  `,

  // Step 3: Test API endpoints
  testEndpoints: `
    1. Test GET /api/services
    2. Test GET /api/services/:id
    3. Test POST /api/services (with authentication)
    4. Test PUT /api/services/:id (with authentication)
    5. Test DELETE /api/services/:id (with authentication)
  `,

  // Step 4: Migrate existing data
  migrateData: `
    1. Export existing service data from frontend
    2. Use MigrationScripts.migrateFromFrontend() to transform data
    3. Use Strapi API to bulk import services
    4. Verify data integrity
  `,
};

// Environment Variables
export const EnvironmentVariables = {
  required: ["STRAPI_URL", "STRAPI_API_TOKEN"],
  optional: ["STRAPI_PREVIEW_SECRET", "STRAPI_WEBHOOK_SECRET"],

  // Example .env configuration
  example: `
    # Strapi Configuration
    STRAPI_URL=http://localhost:1337
    STRAPI_API_TOKEN=your_api_token_here
    
    # Optional
    STRAPI_PREVIEW_SECRET=your_preview_secret
    STRAPI_WEBHOOK_SECRET=your_webhook_secret
  `,
};

// Troubleshooting Guide
export const TroubleshootingGuide = {
  commonIssues: {
    "Slug generation fails": {
      cause: "Duplicate titles or invalid characters",
      solution: "Ensure unique titles and valid characters only",
    },
    "PageContent validation fails": {
      cause: "Invalid JSON structure",
      solution: "Check block structure matches expected schema",
    },
    "API permissions denied": {
      cause: "Incorrect role permissions",
      solution: "Configure proper permissions in Strapi admin",
    },
    "SEO component not found": {
      cause: "Component not properly installed",
      solution: "Ensure seo.json is in correct components directory",
    },
  },

  debugging: {
    enableLogging: "Set NODE_ENV=development to enable detailed logs",
    checkPermissions: "Verify API permissions in Strapi admin panel",
    validateData: "Use ValidationRules to check data structure",
    testEndpoints: "Use API testing tools to verify endpoints",
  },
};

export default {
  ServicesConfig,
  ValidationRules,
  APIPermissions,
  MigrationScripts,
  SetupInstructions,
  EnvironmentVariables,
  TroubleshootingGuide,
};
