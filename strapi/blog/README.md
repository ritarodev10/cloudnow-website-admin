# Blog Module Schema

This folder contains Strapi CMS schema definitions for the blog module of the CloudNow website.

## Schema Files

### Core Collections

1. **`posts-schema.json`** - Blog posts with rich content
   - Fields: title, slug, excerpt, content (richtext), featuredImage, gallery, status, publishedAt, scheduledAt
   - SEO: seoTitle, seoDescription, seoKeywords, seo component
   - Analytics: readingTime, viewCount, likeCount, shareCount, commentCount
   - Relations: author, category, tags, relatedPosts, comments
   - Features: allowComments, isFeatured, isPinned, customFields

2. **`categories-schema.json`** - Blog categories
   - Fields: name, slug, description, color, icon, isActive, sortOrder
   - Relations: posts (one-to-many)
   - SEO: seo component

3. **`tags-schema.json`** - Blog tags
   - Fields: name, slug, description, color, isActive, usageCount
   - Relations: posts (many-to-many)
   - SEO: seo component

4. **`authors-schema.json`** - Blog authors
   - Fields: name, email, bio, avatar, socialLinks, isActive, role, postCount
   - Relations: posts (one-to-many)
   - Roles: author, editor, admin
   - SEO: seo component

5. **`comments-schema.json`** - Blog comments
   - Fields: author, email, content, status, isSpam, ipAddress, userAgent
   - Relations: post, parentComment, replies
   - Moderation: likes, dislikes, isEdited, editedAt, moderationNotes
   - Status: pending, approved, rejected, spam

## Relations

```
BlogPost (1) ←→ (M) BlogAuthor
BlogPost (1) ←→ (M) BlogCategory  
BlogPost (M) ←→ (M) BlogTag
BlogPost (1) ←→ (M) BlogComment
BlogPost (M) ←→ (M) BlogPost (relatedPosts)
BlogComment (1) ←→ (M) BlogComment (replies)
```

## Usage

Copy these schema files to your Strapi project:

```bash
# Blog Posts
cp posts-schema.json src/api/blog-post/content-types/blog-post/schema.json

# Categories
cp categories-schema.json src/api/blog-category/content-types/blog-category/schema.json

# Tags
cp tags-schema.json src/api/blog-tag/content-types/blog-tag/schema.json

# Authors
cp authors-schema.json src/api/blog-author/content-types/blog-author/schema.json

# Comments
cp comments-schema.json src/api/blog-comment/content-types/blog-comment/schema.json
```

## Features

- **Rich Content**: Rich text editor support for blog content
- **Media Management**: Featured images and galleries
- **SEO Optimization**: Built-in SEO fields and component
- **Content Scheduling**: Draft/publish with scheduling
- **Comment System**: Full comment management with moderation
- **Social Features**: Likes, shares, view counts
- **Content Organization**: Categories, tags, and related posts
- **Author Management**: Multi-author support with roles
- **Custom Fields**: Extensible JSON fields for custom data
- **Analytics**: Reading time, view counts, engagement metrics

## Content Workflow

1. **Authors** create and manage their profiles
2. **Categories** and **Tags** organize content
3. **Posts** are created with rich content and media
4. **Comments** are moderated and managed
5. **SEO** is optimized for each piece of content
6. **Analytics** track engagement and performance
