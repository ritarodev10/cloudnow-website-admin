# Blog Tags Database Migrations

This directory contains all database migrations for the blog tags feature.

## Migration Files (Apply in Order)

1. `001_create_blog_tags.sql` - Creates blog_tags table
2. `002_seed_blog_tags.sql` - Seeds sample tag data (optional)

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
   - You should see `blog_tags` table
   - Check that the seed data was inserted (should have 22 tags)

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
supabase db execute -f src/app/\(dashboard\)/\(content\)/blog/tags/_migrations/000_apply_all_migrations.sql
```

---

## Seed Data

The seed data includes 22 common blog tags organized into categories:

### Technology Stack
- React
- Next.js
- TypeScript

### Cloud Platforms
- AWS
- Azure
- Google Cloud

### DevOps & Infrastructure
- Docker
- Kubernetes
- DevOps
- CI/CD

### Security
- Security
- Cloud Security

### Business & Strategy
- Cloud Migration
- Digital Transformation
- IT Consulting

### Technology Categories
- Web Development
- API Development
- Database
- Microservices

### Best Practices & Guides
- Best Practices
- Tutorial
- Case Study

---

## Usage

After running the migrations:

1. The `blog_tags` table will be created with all necessary indexes and triggers
2. Row Level Security (RLS) policies will be set up
3. 22 sample tags will be seeded into the database
4. All tags start with `usage_count = 0` (will be updated when used in blog posts)

---

## Next Steps

To track tag usage in blog posts:

1. Create a `blog_posts` table with a `tags` JSONB or TEXT[] column
2. Create triggers or functions to update `usage_count` when posts are created/updated/deleted
3. Or maintain `usage_count` manually through application logic when posts are saved

---

## Troubleshooting

### Error: "relation 'blog_tags' does not exist"
- Make sure you've run the migration file to create the table

### Error: "duplicate key value violates unique constraint"
- The seed data uses `WHERE NOT EXISTS` to prevent duplicates
- If you see this error, the tags may already exist in your database

### Tags not showing in the admin panel
- Verify the table was created successfully
- Check that RLS policies allow your user to read tags
- Ensure the API routes are correctly configured



