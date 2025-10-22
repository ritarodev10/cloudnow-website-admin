# Strapi Services Schema - Quick Reference

## 📁 Files Created

```
strapi/services/
├── schema.json              # Main service collection schema
├── lifecycles.js            # Lifecycle hooks (slug generation, validation)
├── config.js                # Configuration and setup utilities
├── api-examples.js          # API integration examples and helpers
├── README.md                 # Comprehensive documentation
└── components/
    └── seo.json            # SEO component schema
```

## 🚀 Quick Setup

1. **Copy to Strapi Project**:
   ```bash
   # Copy schema files to your Strapi project
   cp schema.json src/api/services/content-types/service/schema.json
   cp lifecycles.js src/api/services/content-types/service/lifecycles.js
   cp components/seo.json src/components/shared/seo.json
   ```

2. **Restart Strapi Server**:
   ```bash
   npm run develop
   ```

3. **Configure Permissions**:
   - Go to Strapi Admin Panel
   - Settings > Users & Permissions Plugin > Roles
   - Configure Public/Authenticated role permissions

## 📊 Service Collection Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Service title (3-255 chars) |
| `slug` | UID | ✅ | Auto-generated from title |
| `description` | Text | ✅ | Service description (10-1000 chars) |
| `category` | Enum | ✅ | Service category |
| `status` | Enum | ✅ | draft/active/inactive |
| `featured` | Boolean | ❌ | Featured service flag |
| `pageContent` | JSON | ❌ | Page builder content |
| `seo` | Component | ❌ | SEO meta information |

## 🔧 Key Features

- ✅ **Auto-slug generation** from titles
- ✅ **Page builder support** with JSON pageContent
- ✅ **SEO component** for meta information
- ✅ **Draft & Publish** workflow
- ✅ **Data validation** and lifecycle hooks
- ✅ **API examples** and integration helpers

## 📡 API Endpoints

- `GET /api/services` - List services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## 🔍 Query Examples

```javascript
// Get active services
GET /api/services?filters[status][$eq]=active

// Get featured services
GET /api/services?filters[featured][$eq]=true

// Search services
GET /api/services?filters[title][$containsi]=consulting

// Get with pageContent
GET /api/services?populate=*
```

## 📝 PageContent Structure

```json
{
  "blocks": [
    {
      "id": "block_123",
      "type": "hero",
      "category": "header", 
      "props": {
        "title": "Service Title",
        "subtitle": "Service Subtitle"
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

## 🎯 Supported Block Types

- `hero` - Hero sections
- `features` - Features grid
- `cta` - Call-to-action
- `faq` - FAQ sections
- `testimonials` - Customer testimonials
- `stats` - Statistics display
- `pricing` - Pricing tables
- `text` - Rich text content
- `image` - Image blocks

## 🔐 Environment Variables

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

## 📚 Documentation

See `README.md` for comprehensive documentation including:
- Detailed field descriptions
- API usage examples
- Migration instructions
- Troubleshooting guide
- Best practices

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section in README.md
2. Verify Strapi permissions configuration
3. Validate data structure matches schema
4. Check API authentication and tokens

