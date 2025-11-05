# Blog Categories Database Migrations

This directory contains all database migrations for the blog categories feature.

## Migration Files (Apply in Order)

1. `001_create_blog_categories.sql` - Creates blog_categories table
2. `002_seed_blog_categories.sql` - Seeds sample category data (optional)

**OR use combined migration:**

- `000_apply_all_migrations.sql` - Applies all migrations in correct order (recommended for new setup)

---

## How to Apply Migrations

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to SQL Editor**
   - Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]/sql/new
   - Or: Dashboard → SQL Editor → New query

2. **Copy Migration SQL**
   - Open the migration file `000_apply_all_migrations.sql`
   - Copy entire contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)

3. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see `blog_categories` table
   - Check that the seed data was inserted (should have 12 categories)

### Method 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Set access token
export SUPABASE_ACCESS_TOKEN=your_token_here

# Link project (first time only)
supabase link --project-ref your-project-ref

# Copy migration from feature _migrations directory to migrations root
cp src/app/\(dashboard\)/\(content\)/blog/categories/_migrations/000_apply_all_migrations.sql \
   supabase/migrations/$(date +%Y%m%d%H%M%S)_create_blog_categories.sql

# Apply migration
supabase db push --linked

# Clean up temporary file
rm supabase/migrations/*_create_blog_categories.sql
```

Or run the SQL file directly:

```bash
supabase db execute -f src/app/\(dashboard\)/\(content\)/blog/categories/_migrations/000_apply_all_migrations.sql
```

### Method 3: Using Helper Script

If you have the migration helper script:

```bash
# Make script executable (first time only)
chmod +x supabase/migrations/.migration-template.sh

# Run migration
./supabase/migrations/.migration-template.sh blog/categories/_migrations/000_apply_all_migrations.sql
```

---

## Table Structure

The `blog_categories` table has the following structure:

- `id` (UUID, Primary Key) - Unique identifier
- `name` (VARCHAR(100), Unique) - Category display name
- `slug` (VARCHAR(100), Unique) - URL-friendly identifier
- `description` (TEXT, Optional) - Category description
- `is_active` (BOOLEAN, Default: true) - Whether category is active
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

## Seed Data

The seed file includes 12 categories:

1. **Technology** - Technology trends and innovations
2. **Business** - Business strategy and insights
3. **Cloud** - Cloud computing and infrastructure
4. **Security** - Cybersecurity and security practices
5. **DevOps** - DevOps practices and automation
6. **Cloud Migration** - Cloud migration strategies
7. **Web Development** - Web development technologies
8. **API Development** - API design and development
9. **Database** - Database design and management
10. **Best Practices** - Industry best practices
11. **Tutorials** - Step-by-step guides
12. **Case Studies** - Real-world case studies

## Post Count

Post count is calculated dynamically by querying the `posts` table where `posts.category` matches `blog_categories.name`. The count is not stored in the database but computed on-demand.

## Row Level Security (RLS)

RLS policies are set up to:
- Allow authenticated users to read all categories
- Allow service role to manage (create, update, delete) all categories

Adjust these policies based on your authentication requirements.

