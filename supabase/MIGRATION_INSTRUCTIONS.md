# Database Migration Instructions

Simple guide for applying Supabase migrations to any project.

---

## Quick Start

Choose one method:

1. **[AI Assistant Method](#ai-assistant-method)** ← Recommended (Cursor/Claude/ChatGPT)
2. **[Manual Dashboard Method](#manual-dashboard-method)** ← No CLI needed

---

## AI Assistant Method

### Step 1: Get Your Credentials

You need two things:

1. **Project Reference ID**
   - Go to: Supabase Dashboard → Settings → General
   - Copy the "Reference ID" (looks like: `abcdefghijklmnop`)

2. **Access Token**
   - Go to: Supabase Dashboard → Account → Access Tokens
   - Click "Generate new token"
   - Copy the token (starts with `sbp_`)

### Step 2: Ask AI Assistant

**Copy and paste this prompt to your AI assistant (Cursor/Claude/ChatGPT):**

```
I need to apply a Supabase database migration. Please help me:

1. Project Reference ID: [PASTE_YOUR_PROJECT_REF_ID_HERE]
2. Access Token: [PASTE_YOUR_ACCESS_TOKEN_HERE]
3. Migration file: supabase/migrations/testimonials/[MIGRATION_FILE_NAME].sql

Please:
- Install Supabase CLI if needed (I'm on macOS)
- Set the access token
- Link to my Supabase project
- Copy the migration file to the migrations directory with proper timestamp
- Apply the migration using: supabase db push --linked
- Clean up the temporary file after success
- Verify the migration was applied

If you need any additional information, ask me.
```

### Step 3: AI Will Do the Work

The AI will:
1. Install Supabase CLI (if needed)
2. Set your credentials
3. Link to your project
4. Apply the migration
5. Verify it worked
6. Clean up

**You just need to provide the credentials when asked!**

---

## Manual Dashboard Method

### Step 1: Open SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

### Step 2: Copy Migration SQL

1. Open the migration file you want to apply:
   - Location: `supabase/migrations/testimonials/[FILE_NAME].sql`
   - Example: `001_create_testimonials.sql`

2. Copy entire file contents:
   - Select all (Cmd/Ctrl + A)
   - Copy (Cmd/Ctrl + C)

### Step 3: Paste and Run

1. Paste into SQL Editor (Cmd/Ctrl + V)
2. Click **"Run"** button (or press Cmd/Ctrl + Enter)
3. Wait for success message

### Step 4: Verify

1. Go to **"Table Editor"** in left sidebar
2. You should see new tables (e.g., `testimonials`, `testimonial_groups`)
3. Or run a test query:
   ```sql
   SELECT COUNT(*) FROM testimonials;
   ```

---

## Which Migration to Use?

### For New Database Setup

**File:** `supabase/migrations/testimonials/000_apply_all_migrations.sql`

This applies everything in the correct order:
- Creates all tables
- Sets up security
- Seeds sample data
- Adds validation trigger

**Use this if:** Setting up testimonials feature for the first time

### For Custom Setup

Apply migrations individually in this order:
1. `001_create_testimonials.sql`
2. `002_create_testimonial_groups.sql`
3. `004_setup_rls_policies.sql`
4. `005_seed_testimonials.sql` (optional)
5. `006_seed_testimonial_groups.sql` (optional)

---

## What Information You Need

**For AI Assistant:**
- ✅ Project Reference ID
- ✅ Access Token
- ✅ Migration file name

**For Dashboard:**
- ✅ Access to Supabase Dashboard
- ✅ Migration file content

---

## Where to Find Things

**Project Reference ID:**
- Dashboard → Settings → General → Reference ID
- Looks like: `abcdefghijklmnop`

**Access Token:**
- Dashboard → Account → Access Tokens
- Create new token if needed

**Migration Files:**
- Location: `supabase/migrations/testimonials/`
- Files are numbered in order

**SQL Editor:**
- Dashboard → SQL Editor → New query
- Or direct link: `https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]/sql/new`

---

## Common Issues

**"Table already exists"**
- Safe to ignore if using `CREATE TABLE IF NOT EXISTS`
- Or drop tables first: `DROP TABLE IF EXISTS testimonials CASCADE;`

**"Permission denied"**
- Check RLS policies after running migration 004
- Verify you're authenticated

**"Migration file not found"**
- Check file path is correct
- Ensure file exists in `supabase/migrations/testimonials/`

**"CLI not found" (AI Method)**
- AI will install it automatically
- Or install manually: `brew install supabase/tap/supabase`

---

## Safety Tips

1. **Always backup** before migrations
   - Dashboard → Database → Backups → Create backup

2. **Test in development first** if possible

3. **Read migration file** before applying to understand what it does

4. **Apply in order** if using individual migrations

5. **Verify after applying** by checking tables in Dashboard

---

## Quick Commands (For Reference)

**AI will use these commands:**

```bash
# Install CLI
brew install supabase/tap/supabase

# Set token
export SUPABASE_ACCESS_TOKEN=[YOUR_TOKEN]

# Link project
supabase link --project-ref [YOUR_PROJECT_REF]

# Apply migration
cp supabase/migrations/testimonials/[FILE].sql supabase/migrations/[TIMESTAMP]_[NAME].sql
supabase db push --linked
rm supabase/migrations/[TIMESTAMP]_[NAME].sql
```

**You don't need to run these manually if using AI method!**

---

## Summary

**Easiest way:** Use AI Assistant method - just provide credentials and migration file name.

**No CLI needed:** Use Dashboard method - just copy/paste SQL and run.

Both methods work the same, choose what's comfortable for you!

