# Blog Posts Database Migrations

This directory contains all database migrations for the blog posts feature.

## Migration Files (Apply in Order)

1. `001_create_blog_posts.sql` - Creates posts table
2. `002_seed_blog_posts.sql` - Seeds sample post data (optional)

**OR use combined migration:**

- `000_apply_all_migrations.sql` - Applies all migrations in correct order (recommended for new setup)

---

## How to Apply Migrations

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to SQL Editor**
   - Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]/sql/new
   - Or: Dashboard → SQL Editor → New query

2. **Copy Migration SQL**
   - Open the migration file (e.g., `000_apply_all_migrations.sql`)
   - Copy entire contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)

3. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see `posts` table
   - Check that the seed data was inserted (should have 6 posts)

### Method 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to the project directory
cd cloudnow-website-admin

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

Or run the SQL file directly:

```bash
supabase db execute -f src/app/\(dashboard\)/\(content\)/blog/posts/_migrations/000_apply_all_migrations.sql
```

---

## Seed Data

The seed data includes 6 sample blog posts:

1. **The Future of Cloud Computing in 2025** - Published, Featured
   - Category: Cloud Solutions
   - Tags: Cloud, Innovation, Technology

2. **Essential Security Practices for Remote Teams** - Published
   - Category: Cybersecurity
   - Tags: Security, Remote Work, Best Practices

3. **Digital Transformation: A Step-by-Step Guide** - Published
   - Category: IT Consulting
   - Tags: Digital Transformation, Strategy, Business

4. **Optimizing Microsoft Azure for Enterprise Workloads** - Published
   - Category: Microsoft Azure
   - Tags: Azure, Enterprise, Optimization

5. **The Business Case for Backup as a Service** - Published, Featured
   - Category: Backup Solutions
   - Tags: BaaS, Data Protection, Business Continuity

6. **Implementing Zero Trust Security in Your Organization** - Published
   - Category: Cybersecurity
   - Tags: Zero Trust, Security, Implementation

---

## Table Structure

The `posts` table includes:

- **Basic Information**: id, title, slug, excerpt, content
- **Author Information**: author_id, author_name, author_email
- **Status & Publishing**: status, published_at, scheduled_at
- **Organization**: category, tags (array)
- **Metadata**: featured_image, featured, pinned, allow_comments, views
- **Timestamps**: created_at, updated_at

---

## Notes

- The `category` field references `blog_categories.name` (string match)
- The `tags` field is a TEXT[] array that contains tag names matching `blog_tags.name`
- Category and tag seed data should be applied before posts seed data to ensure referential integrity
- The `author_id` in seed data uses a placeholder UUID - update with actual user IDs in production



