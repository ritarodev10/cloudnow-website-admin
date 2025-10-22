# Services Module Schema

This folder contains Strapi CMS schema definitions for the services module and page builder system of the CloudNow website.

## Schema Files

### Core Collections

1. **`services/schema.json`** - Service pages with page builder content
   - Fields: title, slug, description, category, status, featured, pageContent, template
   - Analytics: viewCount, lastEditedBy
   - Relations: template (many-to-one), lastEditedBy (user)
   - SEO: seo component
   - Categories: IT Consulting, Cloud Solutions, Hosting Services, etc.

2. **`page-templates/schema.json`** - Page templates
   - Fields: name, slug, description, category, previewImage, blocks, tags
   - Features: isActive, isDefault, usageCount
   - Relations: services (one-to-many), createdBy (user)
   - Categories: business, premium, minimal, creative, ecommerce
   - SEO: seo component

3. **`page-blocks/schema.json`** - Reusable page blocks
   - Fields: name, type, category, description, icon, defaultProps, requiredProps, optionalProps
   - Features: isActive, isBuiltIn, usageCount, sortOrder
   - Relations: createdBy (user)
   - Block Types: hero, features, cta, faq, testimonials, stats, pricing, text, image, contact-form, gallery, video
   - Categories: header, content, conversion, social-proof, media
   - SEO: seo component

## Relations

```
Service (M) ←→ (1) PageTemplate
Service (M) ←→ (1) User (lastEditedBy)
PageTemplate (1) ←→ (M) Service
PageTemplate (1) ←→ (1) User (createdBy)
PageBlock (M) ←→ (1) User (createdBy)
```

## Page Builder System

### Block Types
- **Hero**: Landing sections with titles, CTAs, and backgrounds
- **Features**: Feature lists with icons, titles, and descriptions
- **CTA**: Call-to-action sections with buttons and messaging
- **FAQ**: FAQ sections with expandable questions
- **Testimonials**: Customer testimonials and reviews
- **Stats**: Statistics and metrics display
- **Pricing**: Pricing tables and plans
- **Text**: Rich text content blocks
- **Image**: Image galleries and single images
- **Contact Form**: Contact and inquiry forms
- **Gallery**: Image galleries and portfolios
- **Video**: Video embeds and players

### Block Categories
- **Header**: Hero sections and headers
- **Content**: Text, features, and informational blocks
- **Conversion**: CTAs, forms, and conversion-focused blocks
- **Social Proof**: Testimonials, stats, and trust indicators
- **Media**: Images, videos, and galleries

### Template Categories
- **Business**: Professional business templates
- **Premium**: High-end service templates
- **Minimal**: Clean and minimal designs
- **Creative**: Creative and artistic layouts
- **Ecommerce**: E-commerce focused templates

## Usage

Copy these schema files to your Strapi project:

```bash
# Services
cp services/schema.json src/api/service/content-types/service/schema.json

# Page Templates
cp page-templates/schema.json src/api/page-template/content-types/page-template/schema.json

# Page Blocks
cp page-blocks/schema.json src/api/page-block/content-types/page-block/schema.json
```

## Features

- **Page Builder**: Visual page builder with drag-and-drop blocks
- **Templates**: Predefined page templates for quick setup
- **Reusable Blocks**: Customizable blocks with props and validation
- **Content Management**: Rich content editing with JSON structure
- **SEO Optimization**: Built-in SEO fields and component
- **Analytics**: View counts and usage tracking
- **User Tracking**: Track who created/edited content
- **Version Control**: Page content versioning and metadata
- **Media Management**: Image and video support
- **Custom Fields**: Extensible JSON fields for custom data

## Content Workflow

1. **Page Blocks** define available components
2. **Page Templates** provide starting layouts
3. **Services** use templates and custom blocks
4. **Page Builder** allows visual editing
5. **SEO** is optimized for each service
6. **Analytics** track performance and usage

## Page Content Structure

```json
{
  "blocks": [
    {
      "id": "unique_id",
      "type": "hero",
      "category": "header",
      "props": {
        "title": "Service Title",
        "subtitle": "Service Subtitle",
        "ctaText": "Get Started"
      },
      "order": 0
    }
  ],
  "metadata": {
    "lastEditedAt": "2024-01-15T10:30:00Z",
    "version": 1
  }
}
```
