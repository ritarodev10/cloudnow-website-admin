# Services Collection - Strapi Schema Documentation

## Overview

This directory contains the Strapi schema configuration for the Services collection, which powers the CloudNow website's service page builder system. Each service can have dynamic page content built using predefined components.

## Files Structure

```
strapi/services/
├── schema.json              # Main service collection schema
├── lifecycles.js            # Lifecycle hooks (slug generation, validation)
├── README.md                # This documentation file
└── components/
    └── seo.json            # SEO component (reusable across collections)
```

## Service Collection Schema

### Basic Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Service title (3-255 characters) |
| `slug` | UID | ✅ | URL-friendly identifier (auto-generated from title) |
| `description` | Text | ✅ | Service description (10-1000 characters) |
| `category` | Enumeration | ✅ | Service category (see categories below) |
| `status` | Enumeration | ✅ | Publication status (draft/active/inactive) |
| `featured` | Boolean | ❌ | Whether service is featured (default: false) |
| `pageContent` | JSON | ❌ | Page builder content (see structure below) |
| `seo` | Component | ❌ | SEO meta information |
| `publishedAt` | DateTime | ❌ | Publication timestamp (managed by Strapi) |

### Categories

The service category enumeration includes:

- **IT Consulting** - IT strategy and consulting services
- **Cloud Solutions** - Cloud migration and optimization
- **Hosting Services** - Web hosting and infrastructure
- **Backup & Recovery** - Data backup and disaster recovery
- **Cybersecurity** - Security services and solutions
- **Professional Services** - Professional consulting
- **Microsoft Solutions** - Microsoft-specific services
- **Other** - Miscellaneous services

### Status Values

- **draft** - Service is being worked on (not published)
- **active** - Service is live and published
- **inactive** - Service is published but disabled

## PageContent JSON Structure

The `pageContent` field stores the page builder data as JSON with the following structure:

```json
{
  "blocks": [
    {
      "id": "unique-block-id",
      "type": "hero|features|cta|faq|testimonials|stats|pricing|text|image",
      "category": "header|content|conversion|social-proof|media|forms",
      "props": {
        // Component-specific properties
        "title": "Block Title",
        "subtitle": "Block Subtitle",
        // ... other props based on block type
      },
      "order": 0
    }
  ],
  "metadata": {
    "lastEditedAt": "2024-01-15T10:30:00.000Z",
    "version": 1
  }
}
```

### Supported Block Types

| Block Type | Category | Description |
|------------|----------|-------------|
| `hero` | header | Hero section with title, subtitle, CTA |
| `features` | content | Features grid/list/cards layout |
| `cta` | conversion | Call-to-action section |
| `faq` | content | FAQ accordion/grid layout |
| `testimonials` | social-proof | Customer testimonials |
| `stats` | social-proof | Statistics display |
| `pricing` | conversion | Pricing plans table |
| `text` | content | Rich text content |
| `image` | media | Single image with caption |

### Block Categories

- **header** - Page headers and hero sections
- **content** - Main content blocks (features, text, FAQ)
- **conversion** - Call-to-action and pricing blocks
- **social-proof** - Testimonials and statistics
- **media** - Images and videos
- **forms** - Contact forms and inputs

## SEO Component

The `seo` component provides comprehensive SEO meta information:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metaTitle` | String | ❌ | Page title (10-60 characters) |
| `metaDescription` | Text | ❌ | Meta description (50-160 characters) |
| `keywords` | Text | ❌ | SEO keywords (max 500 characters) |
| `metaImage` | String | ❌ | Meta image URL |
| `canonicalURL` | String | ❌ | Canonical URL |
| `ogTitle` | String | ❌ | Open Graph title (max 60 characters) |
| `ogDescription` | Text | ❌ | Open Graph description (max 160 characters) |
| `ogImage` | String | ❌ | Open Graph image URL |
| `twitterCard` | Enumeration | ❌ | Twitter card type |
| `robots` | Enumeration | ❌ | Robots meta directive |

## Lifecycle Hooks

The `lifecycles.js` file provides automatic functionality:

### Before Create/Update
- **Slug Generation**: Auto-generates URL-friendly slug from title
- **PageContent Validation**: Validates JSON structure and block data
- **Metadata Updates**: Sets initial metadata for pageContent

### After Create/Update/Delete
- **Logging**: Logs all service operations
- **Statistics Update**: Updates service statistics (placeholder)

## API Endpoints

Once deployed, the following API endpoints will be available:

### Services Collection

- `GET /api/services` - List all services
- `GET /api/services/:id` - Get specific service
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Query Parameters

- `?filters[category][$eq]=IT Consulting` - Filter by category
- `?filters[status][$eq]=active` - Filter by status
- `?filters[featured][$eq]=true` - Filter featured services
- `?sort=title:asc` - Sort by title
- `?pagination[page]=1&pagination[pageSize]=10` - Pagination

### Example API Calls

```javascript
// Get all active services
const response = await fetch('/api/services?filters[status][$eq]=active');

// Get featured services with pageContent
const featured = await fetch('/api/services?filters[featured][$eq]=true&populate=*');

// Create new service
const newService = await fetch('/api/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      title: 'New Service',
      description: 'Service description',
      category: 'IT Consulting',
      status: 'draft',
      pageContent: {
        blocks: [],
        metadata: { version: 1 }
      }
    }
  })
});
```

## Setup Instructions

1. **Copy Schema Files**: Copy the schema files to your Strapi project's `src/api/services/` directory
2. **Install Dependencies**: Ensure your Strapi project has the required plugins
3. **Restart Strapi**: Restart your Strapi server to load the new schema
4. **Create Content**: Use the Strapi admin panel to create and manage services

## Migration from Frontend Data

To migrate existing frontend service data to Strapi:

1. Export service data from frontend
2. Transform data to match Strapi schema format
3. Use Strapi API to bulk import services
4. Update frontend to use Strapi API endpoints

## Best Practices

1. **Slug Management**: Let Strapi auto-generate slugs, but validate uniqueness
2. **PageContent Validation**: Always validate pageContent structure before saving
3. **SEO Optimization**: Fill out SEO component for better search visibility
4. **Status Management**: Use draft status for work-in-progress services
5. **Featured Services**: Limit featured services to maintain page performance

## Troubleshooting

### Common Issues

1. **Slug Conflicts**: If slug generation fails, check for duplicate titles
2. **PageContent Errors**: Validate JSON structure matches expected format
3. **SEO Component**: Ensure SEO component is properly configured
4. **API Permissions**: Check Strapi permissions for API access

### Validation Errors

- **Title too short**: Minimum 3 characters required
- **Description too short**: Minimum 10 characters required
- **Invalid category**: Must be one of the predefined categories
- **Invalid pageContent**: Check block structure and required fields

## Future Enhancements

Potential future improvements:

1. **Service Templates**: Add template collection for reusable page layouts
2. **Media Library**: Integrate with Strapi media library for images
3. **Versioning**: Add content versioning for pageContent
4. **Analytics**: Track service page performance
5. **Relations**: Add relations to other collections (categories, authors, etc.)

## Support

For issues or questions regarding this schema:

1. Check Strapi documentation: https://docs.strapi.io/
2. Review lifecycle hooks for custom behavior
3. Validate data structure matches expected format
4. Check API permissions and authentication
