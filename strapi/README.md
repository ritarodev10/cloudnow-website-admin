# Strapi Schema Reference

This folder contains Strapi CMS schema definitions for the CloudNow website backend.

## Schema Files

### Blog Module
- `blog/posts-schema.json` - Blog posts with rich content
  - Fields: title, slug, excerpt, content (richtext), featuredImage, gallery, status, publishedAt, scheduledAt
  - SEO: seoTitle, seoDescription, seoKeywords, seo component
  - Analytics: readingTime, viewCount, likeCount, shareCount, commentCount
  - Relations: author, category, tags, relatedPosts, comments
  - Features: allowComments, isFeatured, isPinned, customFields

- `blog/categories-schema.json` - Blog categories
  - Fields: name, slug, description, color, icon, isActive, sortOrder
  - Relations: posts (one-to-many)

- `blog/tags-schema.json` - Blog tags
  - Fields: name, slug, description, color, isActive, usageCount
  - Relations: posts (many-to-many)

- `blog/authors-schema.json` - Blog authors
  - Fields: name, email, bio, avatar, socialLinks, isActive, role, postCount
  - Relations: posts (one-to-many)
  - Roles: author, editor, admin

- `blog/comments-schema.json` - Blog comments
  - Fields: author, email, content, status, isSpam, ipAddress, userAgent
  - Relations: post, parentComment, replies
  - Moderation: likes, dislikes, isEdited, editedAt, moderationNotes

### Services Module
- `services/schema.json` - Service pages with page builder content
  - Fields: title, slug, description, category, status, featured, pageContent, template, viewCount, lastEditedBy
  - Relations: template (many-to-one), lastEditedBy (user)
  - Categories: IT Consulting, Cloud Solutions, Hosting Services, etc.

- `page-templates/schema.json` - Page templates
  - Fields: name, slug, description, category, previewImage, blocks, tags, isActive, isDefault, usageCount
  - Relations: services (one-to-many), createdBy (user)
  - Categories: business, premium, minimal, creative, ecommerce

- `page-blocks/schema.json` - Reusable page blocks
  - Fields: name, type, category, description, icon, defaultProps, requiredProps, optionalProps
  - Features: isActive, isBuiltIn, usageCount, sortOrder
  - Relations: createdBy (user)
  - Block Types: hero, features, cta, faq, testimonials, stats, pricing, text, image, contact-form, gallery, video

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

**Blog Module:**
1. Copy `blog/posts-schema.json` to `src/api/blog-post/content-types/blog-post/schema.json`
2. Copy `blog/categories-schema.json` to `src/api/blog-category/content-types/blog-category/schema.json`
3. Copy `blog/tags-schema.json` to `src/api/blog-tag/content-types/blog-tag/schema.json`
4. Copy `blog/authors-schema.json` to `src/api/blog-author/content-types/blog-author/schema.json`
5. Copy `blog/comments-schema.json` to `src/api/blog-comment/content-types/blog-comment/schema.json`

**Services Module:**
6. Copy `services/schema.json` to `src/api/service/content-types/service/schema.json`
7. Copy `page-templates/schema.json` to `src/api/page-template/content-types/page-template/schema.json`
8. Copy `page-blocks/schema.json` to `src/api/page-block/content-types/page-block/schema.json`

**Other Modules:**
9. Copy `testimonials/schema.json` to `src/api/testimonials/content-types/testimonial/schema.json`
10. Copy `testimonials/groups-schema.json` to `src/api/testimonial-groups/content-types/testimonial-group/schema.json`
11. Copy `faqs/schema.json` to `src/api/faqs/content-types/faq/schema.json`
12. Copy `faqs/groups-schema.json` to `src/api/faq-groups/content-types/faq-group/schema.json`
13. Copy `components/shared/seo.json` to `src/components/shared/seo.json`

## Notes

- All schemas use `draftAndPublish: true` for content management
- Relations are properly defined between groups and their items
- Categories are defined as enumerations with predefined values
- SEO component is reusable across different content types
- Order fields use JSON type for flexible ordering
- Usage paths track where groups are used on the website
