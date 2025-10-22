# FAQs Module Schema

This folder contains Strapi CMS schema definitions for the FAQs module of the CloudNow website.

## Schema Files

### Core Collections

1. **`faqs/schema.json`** - Individual FAQs
   - Fields: question, answer, categories, isVisible, group, order
   - Analytics: viewCount, helpfulCount, notHelpfulCount, lastEditedBy
   - Relations: group (many-to-one), lastEditedBy (user)
   - Categories: General, Cloud Services, Billing, Technical Support, Security, Implementation, Other
   - Features: Visibility control, custom ordering, helpfulness tracking

2. **`faqs/groups-schema.json`** - FAQ groups
   - Fields: name, description, faqs (relation), order, isActive, usagePaths
   - Analytics: viewCount, lastEditedBy
   - Relations: faqs (one-to-many), lastEditedBy (user)
   - Features: Custom ordering, usage path tracking, active/inactive status

## Relations

```
FAQ (M) ←→ (1) FAQGroup
FAQ (M) ←→ (1) User (lastEditedBy)
FAQGroup (1) ←→ (M) FAQ
FAQGroup (1) ←→ (1) User (lastEditedBy)
```

## FAQ Categories

- **General**: General questions and information
- **Cloud Services**: Cloud-related services and solutions
- **Billing**: Pricing, billing, and payment questions
- **Technical Support**: Technical assistance and support
- **Security**: Security measures and compliance
- **Implementation**: Project implementation and deployment
- **Other**: Miscellaneous questions

## Features

### FAQs
- **Rich Content**: Detailed questions and comprehensive answers
- **Category System**: Multiple categories per FAQ for better organization
- **Visibility Control**: Show/hide FAQs as needed
- **Custom Ordering**: Control the order of FAQs within groups
- **Analytics**: View counts and helpfulness tracking
- **User Tracking**: Track who last edited each FAQ
- **SEO**: Built-in SEO component support

### FAQ Groups
- **Grouping**: Organize FAQs into logical groups
- **Custom Ordering**: Control the order of FAQs within groups
- **Usage Tracking**: Track where groups are used across the website
- **Active Status**: Enable/disable groups as needed
- **Analytics**: View counts and editor tracking
- **SEO**: Built-in SEO component support

## Usage

Copy these schema files to your Strapi project:

```bash
# FAQs
cp faqs/schema.json src/api/faq/content-types/faq/schema.json

# FAQ Groups
cp faqs/groups-schema.json src/api/faq-group/content-types/faq-group/schema.json
```

## Content Workflow

1. **FAQ Groups** are created to organize related FAQs
2. **FAQs** are created and assigned to groups
3. **Ordering** controls display sequence within groups
4. **Usage Tracking** monitors where groups appear on the website
5. **Analytics** track views and helpfulness ratings
6. **SEO** optimization for each FAQ and group

## FAQ Data Structure

```json
{
  "question": "What cloud services does CloudNow offer?",
  "answer": "CloudNow provides comprehensive cloud solutions...",
  "categories": ["General", "Cloud Services"],
  "isVisible": true,
  "order": 0,
  "viewCount": 0,
  "helpfulCount": 0,
  "notHelpfulCount": 0
}
```

## Group Data Structure

```json
{
  "name": "Main FAQ",
  "description": "Primary FAQ group containing the most commonly asked questions",
  "faqs": ["faq_1", "faq_2", "faq_3"],
  "order": ["faq_1", "faq_2", "faq_3"],
  "isActive": true,
  "usagePaths": ["/faq", "/support"],
  "viewCount": 0
}
```

## Integration with Services

FAQ groups can be used in:
- Service pages (via page builder blocks)
- Support pages
- Help center
- Landing pages
- Homepage FAQ section

The `usagePaths` field tracks where each group is used, enabling automatic `isActive` status based on actual usage.

## Helpfulness Tracking

The FAQ system includes helpfulness tracking:
- **helpfulCount**: Number of users who found the FAQ helpful
- **notHelpfulCount**: Number of users who didn't find it helpful
- This data can be used to improve FAQ content and identify gaps

## Group Management Features

- **Combined Modal**: Edit group info and manage FAQs in one interface
- **Inline Editing**: Edit FAQs directly within the group management modal
- **Drag & Drop**: Reorder FAQs within groups
- **Bulk Operations**: Add, edit, delete multiple FAQs at once
- **Template System**: Use predefined FAQ templates for common questions
