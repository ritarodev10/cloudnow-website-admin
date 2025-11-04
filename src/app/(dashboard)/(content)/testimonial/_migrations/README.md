# Testimonials Database Migrations

This directory contains all database migrations for the testimonials feature.

## Migration Files (Apply in Order)

1. `001_create_testimonials.sql` - Creates testimonials table
2. `002_create_testimonial_groups.sql` - Creates testimonial_groups table
3. `004_setup_rls_policies.sql` - Sets up Row Level Security policies
4. `005_seed_testimonials.sql` - Seeds sample testimonial data (optional)
5. `006_seed_testimonial_groups.sql` - Seeds sample group data (optional)

**OR use combined migration:**

- `000_apply_all_migrations.sql` - Applies all migrations in correct order (recommended for new setup)

---

## How to Apply Migrations

### Method 1: Using AI Assistant (Cursor/Claude/ChatGPT)

**What to provide to AI:**

```
I need to apply database migrations to Supabase. Here's what I need:

1. My Supabase project reference ID: [YOUR_PROJECT_REF_ID]
2. My Supabase access token: [YOUR_ACCESS_TOKEN]
3. Migration file location: src/app/(dashboard)/(content)/testimonial/_migrations/[MIGRATION_FILE].sql

Please help me apply this migration using Supabase CLI.

Requirements:
- Install Supabase CLI if needed (I'm on macOS)
- Link to my project
- Apply the migration
- Verify it worked
```

**AI will execute:**

```bash
# Install CLI (if needed)
brew install supabase/tap/supabase

# Set credentials
export SUPABASE_ACCESS_TOKEN=[YOUR_TOKEN]
supabase link --project-ref [YOUR_PROJECT_REF]

# Copy and apply migration
cp src/app/(dashboard)/(content)/testimonial/_migrations/[FILE].sql supabase/migrations/[TIMESTAMP]_[NAME].sql
supabase db push --linked
rm supabase/migrations/[TIMESTAMP]_[NAME].sql
```

---

### Method 2: Using Supabase Dashboard (Manual)

1. **Go to SQL Editor**

   - Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]/sql/new
   - Or: Dashboard → SQL Editor → New query

2. **Copy Migration SQL**

   - Open the migration file (e.g., `001_create_testimonials.sql`)
   - Copy entire contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)

3. **Paste and Run**

   - Paste into SQL Editor
   - Click "Run" (or Cmd/Ctrl + Enter)

4. **Verify**
   - Check Table Editor to see new tables
   - Or run: `SELECT * FROM testimonials LIMIT 1;`

---

## Migration Details

### Initial Setup (New Database)

Run this once to set up everything:

- **File:** `000_apply_all_migrations.sql`
- **Includes:** Tables, policies, seed data, validation trigger

### Individual Migrations

Apply files in numerical order for custom setup:

1. Create tables (001, 002)
2. Set up security (004)
3. Seed data (005, 006) - optional

---

## What You Need

**For AI Assistant Method:**

- [ ] Supabase project reference ID
- [ ] Supabase access token (get from: Account → Access Tokens)
- [ ] Migration file path

**For Dashboard Method:**

- [ ] Access to Supabase Dashboard
- [ ] Migration file content

---

## Quick Reference

**Get Project Reference ID:**

- Dashboard → Settings → General → Reference ID

**Get Access Token:**

- Dashboard → Account → Access Tokens → Create new token

**Verify Migration:**

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('testimonials', 'testimonial_groups');

-- Check groups were created
SELECT name, is_active FROM testimonial_groups ORDER BY name;
```

---

## Troubleshooting

**"Table already exists"**

- Some migrations use `CREATE TABLE IF NOT EXISTS` - safe to run again
- Delete tables manually if needed: `DROP TABLE IF EXISTS testimonials CASCADE;`

**"Migration failed"**

- Check SQL syntax errors
- Verify you have proper permissions
- Check Supabase logs in Dashboard

**"Access denied"**

- Verify access token is valid
- Check RLS policies if querying data

---

## Notes

- Always backup your database before applying migrations
- Seed data (005, 006) is optional - skip if you want empty tables
- The combined migration (000) includes everything in correct order
