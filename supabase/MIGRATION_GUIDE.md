# Database Migration Guide

This guide explains how to apply the Supabase migrations to set up the testimonials database tables.

## Problem

If you're seeing errors like:

```
Error: Could not find the table 'public.testimonials' in the schema cache
Error: Could not find the table 'public.testimonial_groups' in the schema cache
```

This means the database tables haven't been created yet. You need to run the migrations.

## Solution: Apply Migrations

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**

   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Combined Migration**

   - Open the file `supabase/migrations/000_apply_all_migrations.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see `testimonials` and `testimonial_groups` tables
   - Check that the seed data was inserted (should have 7 testimonials and 5 groups)

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
supabase db execute -f supabase/migrations/000_apply_all_migrations.sql
```

### Method 3: Run Individual Migrations

If you prefer to run migrations individually, run them in this order:

1. `001_create_testimonials.sql` - Creates testimonials table
2. `002_create_testimonial_groups.sql` - Creates testimonial_groups table
3. `004_setup_rls_policies.sql` - Sets up Row Level Security policies
4. `005_seed_testimonials.sql` - Seeds sample testimonials (optional)
5. `006_seed_testimonial_groups.sql` - Seeds sample groups (optional)

## After Running Migrations

1. **Refresh PostgREST Schema Cache**

   - PostgREST usually refreshes automatically within a few seconds
   - If you still see errors, wait 10-30 seconds and try again
   - You can manually refresh by running: `NOTIFY pgrst, 'reload schema';` in SQL Editor

2. **Verify Your Connection**

   - Make sure your `.env.local` has the correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Check that you're authenticated (if RLS requires authentication)

3. **Test the Application**
   - Restart your Next.js dev server: `npm run dev`
   - Navigate to `/testimonial` page
   - You should see the testimonials and groups loaded

## Troubleshooting

### Still seeing PGRST205 errors?

1. **Check table exists**: Run `SELECT * FROM testimonials LIMIT 1;` in SQL Editor
2. **Check RLS policies**: Make sure policies allow authenticated users
3. **Check authentication**: Verify you're logged in if RLS requires it
4. **Wait for cache refresh**: PostgREST may take up to 1 minute to refresh

### RLS Policy Issues

If you can't access tables even after creating them:

- Make sure you're authenticated when making requests
- Check that RLS policies allow your user role
- Verify policies were created: `SELECT * FROM pg_policies WHERE tablename IN ('testimonials', 'testimonial_groups');`

### Migration Errors

If migrations fail:

- Check for syntax errors in the SQL
- Verify you have proper permissions in Supabase
- Make sure no conflicting tables/objects exist
- Check the Supabase logs for detailed error messages

## Need Help?

- Check Supabase documentation: https://supabase.com/docs
- Review PostgREST errors: https://postgrest.org/en/stable/errors.html
- Check Next.js server logs for detailed error messages
