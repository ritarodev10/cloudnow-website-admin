# Strapi Schema Reference

This folder contains Strapi CMS schema definitions for the CloudNow website backend.

## Schema Files

### Services
- `services/schema.json` - Service pages with page builder content
  - Fields: title, slug, description, category, status, featured, pageContent, seo
  - Categories: IT Consulting, Cloud Solutions, Hosting Services, etc.

### Testimonials
- `testimonials/schema.json` - Individual testimonials
  - Fields: name, title, company, testimony, image, rating, categories, isVisible, group
  - Categories: Customer Success, Product Review, Service Quality, etc.
- `testimonials/groups-schema.json` - Testimonial groups
  - Fields: name, description, testimonials (relation), order, isActive, usagePaths

### FAQs
- `faqs/schema.json` - Individual FAQs
  - Fields: question, answer, categories, isVisible, group, order
  - Categories: General, Cloud Services, Billing, Technical Support, etc.
- `faqs/groups-schema.json` - FAQ groups
  - Fields: name, description, faqs (relation), order, isActive, usagePaths

### Shared Components
- `components/shared/seo.json` - SEO component
  - Fields: metaTitle, metaDescription, keywords, metaImage, canonicalURL, ogTitle, ogDescription, ogImage, twitterCard, robots

## Usage

These schema files can be copied to your Strapi project:

1. Copy `services/schema.json` to `src/api/services/content-types/service/schema.json`
2. Copy `testimonials/schema.json` to `src/api/testimonials/content-types/testimonial/schema.json`
3. Copy `testimonials/groups-schema.json` to `src/api/testimonial-groups/content-types/testimonial-group/schema.json`
4. Copy `faqs/schema.json` to `src/api/faqs/content-types/faq/schema.json`
5. Copy `faqs/groups-schema.json` to `src/api/faq-groups/content-types/faq-group/schema.json`
6. Copy `components/shared/seo.json` to `src/components/shared/seo.json`

## Notes

- All schemas use `draftAndPublish: true` for content management
- Relations are properly defined between groups and their items
- Categories are defined as enumerations with predefined values
- SEO component is reusable across different content types
- Order fields use JSON type for flexible ordering
- Usage paths track where groups are used on the website
