# Supabase CLI Migration Guide

This guide explains how to apply database migrations to your Supabase project using the CLI.

**Note:** For simpler instructions, see `MIGRATION_INSTRUCTIONS.md`

## Quick Reference

**Get your Project Reference ID:** Dashboard → Settings → General → Reference ID  
**Get your Access Token:** Dashboard → Account → Access Tokens

---

## Prerequisites

1. **Supabase CLI installed**

   ```bash
   brew install supabase/tap/supabase
   ```

2. **Supabase Access Token**

   - Get from: https://supabase.com/dashboard/account/tokens
   - Create a new token if needed
   - Keep it secure (never commit to git)

3. **Project linked** (one-time setup)

---

## Method 1: Using Access Token (Recommended)

### Step 1: Set Access Token

```bash
export SUPABASE_ACCESS_TOKEN=your_access_token_here
```

**Note:** Get your access token from: https://supabase.com/dashboard/account/tokens

### Step 2: Link Project (First Time Only)

```bash
cd cloudnow-website-admin
supabase link --project-ref eulbmopenrdcghbcowxf
```

### Step 3: Apply Migration

```bash
# Navigate to project root
cd cloudnow-website-admin

# Copy migration file to migrations directory (CLI expects specific location)
cp supabase/migrations/testimonials/[MIGRATION_FILE].sql supabase/migrations/[TIMESTAMP]_[description].sql

# Apply migration
supabase db push --linked
```

**Example:**

```bash
cp supabase/migrations/testimonials/009_combined_category_update.sql \
   supabase/migrations/20241103190000_combined_category_update.sql

supabase db push --linked
```

### Step 4: Clean Up

After successful migration, remove the temporary file:

```bash
rm supabase/migrations/[TIMESTAMP]_[description].sql
```

---

## Method 2: Using Interactive Login

### Step 1: Login

```bash
supabase login
```

This will open your browser to authenticate. Complete the login process.

### Step 2: Link Project (First Time Only)

```bash
cd cloudnow-website-admin
supabase link --project-ref eulbmopenrdcghbcowxf
```

### Step 3: Apply Migration

Same as Method 1, Step 3.

---

## Migration File Naming Convention

The CLI expects migration files to be in `supabase/migrations/` with this format:

```
[TIMESTAMP]_[description].sql
```

**Example:**

```
20241103190000_combined_category_update.sql
20241104080000_add_new_feature.sql
```

**Timestamp format:** `YYYYMMDDHHMMSS` (Year, Month, Day, Hour, Minute, Second)

---

## Applying Multiple Migrations

If you have multiple migration files:

1. Copy all files to `supabase/migrations/` with proper timestamps
2. Ensure timestamps are in chronological order
3. Run `supabase db push --linked` once - it will apply all pending migrations

**Example:**

```bash
cp migrations/testimonials/007_file.sql supabase/migrations/20241103180000_description.sql
cp migrations/testimonials/008_file.sql supabase/migrations/20241103190000_description.sql
supabase db push --linked
```

---

## Verifying Migrations

### Check Applied Migrations

```bash
supabase migration list --linked
```

### Check Database Schema

```bash
supabase db pull --linked
```

### View Migration History

Go to Supabase Dashboard → Database → Migrations to see applied migrations.

---

## Troubleshooting

### Error: "Access token not provided"

**Solution:**

```bash
export SUPABASE_ACCESS_TOKEN=your_token_here
# Or use: supabase login
```

### Error: "Project not linked"

**Solution:**

```bash
supabase link --project-ref eulbmopenrdcghbcowxf
```

### Error: "Command not found: supabase"

**Solution:**

```bash
# Install via Homebrew (macOS)
brew install supabase/tap/supabase

# Or install locally in project
npm install supabase --save-dev
# Then use: npx supabase [command]
```

### Error: "Migration file not found"

**Solution:**

- Ensure migration file is in `supabase/migrations/` directory
- Check file naming: `[TIMESTAMP]_[description].sql`
- Verify you're in the project root directory

### Error: "Unknown shorthand flag: 'f'"

**Solution:**
The `db execute -f` command doesn't exist. Use `db push` instead:

```bash
# Copy file to migrations directory first
cp path/to/migration.sql supabase/migrations/20241103190000_name.sql
supabase db push --linked
```

### Migration Already Applied

If a migration was already applied, you'll see a message. The CLI tracks applied migrations automatically.

---

## Alternative: Using Supabase Dashboard

If CLI doesn't work, use the Dashboard SQL Editor:

1. Go to: https://supabase.com/dashboard/project/eulbmopenrdcghbcowxf/sql/new
2. Copy SQL content from migration file
3. Paste into SQL Editor
4. Click "Run"

**Note:** Dashboard method doesn't track migration history automatically.

---

## Best Practices

1. **Always backup** before applying migrations (use Supabase Dashboard → Database → Backups)
2. **Test locally first** if possible (requires local Supabase setup)
3. **Use descriptive migration names** with timestamps
4. **Keep migrations idempotent** (can be run multiple times safely)
5. **Verify after applying** by checking tables/schema
6. **Clean up temporary files** after successful migration

---

## Required Information Checklist

Before running migrations, ensure you have:

- [ ] Supabase CLI installed
- [ ] Access token OR ability to run `supabase login`
- [ ] Project reference ID: `eulbmopenrdcghbcowxf`
- [ ] Migration SQL file ready
- [ ] Project linked (or ready to link)

---

## Example: Complete Workflow

```bash
# 1. Set credentials
export SUPABASE_ACCESS_TOKEN=sbp_xxxxx

# 2. Navigate to project
cd cloudnow-website-admin

# 3. Link project (first time only)
supabase link --project-ref eulbmopenrdcghbcowxf

# 4. Copy migration file
cp supabase/migrations/testimonials/009_combined_category_update.sql \
   supabase/migrations/20241103190000_combined_category_update.sql

# 5. Apply migration
supabase db push --linked

# 6. Clean up
rm supabase/migrations/20241103190000_combined_category_update.sql

# 7. Verify (optional)
supabase migration list --linked
```

---

## Project-Specific Details

**Get your Project Reference ID:** Dashboard → Settings → General → Reference ID  
**Get your Project URL:** Dashboard → Settings → API → Project URL

**Migration File Locations:**

- Source files: `supabase/migrations/testimonials/`
- CLI target: `supabase/migrations/` (root migrations folder)

**Access Token Location:**

- Dashboard: https://supabase.com/dashboard/account/tokens
- Keep secure, never commit to git

---

## Quick Commands Reference

```bash
# Login
supabase login

# Link project
supabase link --project-ref eulbmopenrdcghbcowxf

# Apply migrations
supabase db push --linked

# Check status
supabase migration list --linked

# Pull schema
supabase db pull --linked

# Check version
supabase --version
```

---

## Need Help?

- Supabase CLI Docs: https://supabase.com/docs/reference/cli
- Migration Docs: https://supabase.com/docs/guides/cli/local-development#database-migrations
- Dashboard SQL Editor: https://supabase.com/dashboard/project/eulbmopenrdcghbcowxf/sql/new

---

**Last Updated:** November 3, 2024  
**For simpler instructions:** See `MIGRATION_INSTRUCTIONS.md`
