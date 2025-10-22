# Testimonials Module Schema

This folder contains Strapi CMS schema definitions for the testimonials module of the CloudNow website.

## Schema Files

### Core Collections

1. **`testimonials/schema.json`** - Individual testimonials
   - Fields: name, title, company, testimony, image, rating, categories, isVisible
   - Analytics: viewCount, lastEditedBy
   - Relations: group (many-to-one), lastEditedBy (user)
   - Categories: Customer Success, Product Review, Service Quality, Technical Support, Implementation, Partnership, General Feedback
   - Features: 1-5 star rating system, visibility control, image support

2. **`testimonials/groups-schema.json`** - Testimonial groups
   - Fields: name, description, testimonials (relation), order, isActive, usagePaths
   - Analytics: viewCount, lastEditedBy
   - Relations: testimonials (one-to-many), lastEditedBy (user)
   - Features: Custom ordering, usage path tracking, active/inactive status

## Relations

```
Testimonial (M) ←→ (1) TestimonialGroup
Testimonial (M) ←→ (1) User (lastEditedBy)
TestimonialGroup (1) ←→ (M) Testimonial
TestimonialGroup (1) ←→ (1) User (lastEditedBy)
```

## Testimonial Categories

- **Customer Success**: Success stories and positive outcomes
- **Product Review**: Product-specific feedback and reviews
- **Service Quality**: Service excellence and satisfaction
- **Technical Support**: Technical assistance and support quality
- **Implementation**: Project implementation and deployment
- **Partnership**: Long-term partnership and collaboration
- **General Feedback**: General comments and feedback

## Features

### Testimonials
- **Rich Content**: Detailed testimonial text with character limits
- **Rating System**: 1-5 star rating for each testimonial
- **Image Support**: Optional profile images for testimonial authors
- **Category System**: Multiple categories per testimonial
- **Visibility Control**: Show/hide testimonials as needed
- **Analytics**: View counts and editor tracking
- **SEO**: Built-in SEO component support

### Testimonial Groups
- **Grouping**: Organize testimonials into logical groups
- **Custom Ordering**: Control the order of testimonials within groups
- **Usage Tracking**: Track where groups are used across the website
- **Active Status**: Enable/disable groups as needed
- **Analytics**: View counts and editor tracking
- **SEO**: Built-in SEO component support

## Usage

Copy these schema files to your Strapi project:

```bash
# Testimonials
cp testimonials/schema.json src/api/testimonial/content-types/testimonial/schema.json

# Testimonial Groups
cp testimonials/groups-schema.json src/api/testimonial-group/content-types/testimonial-group/schema.json
```

## Content Workflow

1. **Testimonials** are created with customer information and feedback
2. **Groups** organize testimonials by theme or service
3. **Ordering** controls display sequence within groups
4. **Usage Tracking** monitors where groups appear on the website
5. **Analytics** track views and engagement
6. **SEO** optimization for each testimonial and group

## Testimonial Data Structure

```json
{
  "name": "Sarah Johnson",
  "title": "CTO",
  "company": "TechCorp Solutions",
  "testimony": "CloudNow's cloud migration service was exceptional...",
  "image": "https://example.com/profile.jpg",
  "rating": 5,
  "categories": ["Customer Success", "Implementation"],
  "isVisible": true,
  "viewCount": 0
}
```

## Group Data Structure

```json
{
  "name": "Customer Success Stories",
  "description": "Testimonials highlighting successful implementations",
  "testimonials": ["testimonial_1", "testimonial_2"],
  "order": ["testimonial_1", "testimonial_2"],
  "isActive": true,
  "usagePaths": ["/services/cloud-migration", "/services/cloud-consulting"],
  "viewCount": 0
}
```

## Integration with Services

Testimonial groups can be used in:
- Service pages (via page builder blocks)
- Landing pages
- Case study pages
- About us pages
- Homepage testimonials section

The `usagePaths` field tracks where each group is used, enabling automatic `isActive` status based on actual usage.
