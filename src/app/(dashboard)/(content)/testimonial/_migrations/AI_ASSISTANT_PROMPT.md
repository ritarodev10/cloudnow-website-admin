# AI Assistant Prompt Template

Copy and paste this prompt to your AI assistant (Cursor, Claude, ChatGPT, etc.) to apply Supabase migrations.

---

## Basic Prompt

```
I need to apply a Supabase database migration. Please help me:

**My Information:**
- Project Reference ID: [PASTE_YOUR_PROJECT_REF_ID_HERE]
- Access Token: [PASTE_YOUR_ACCESS_TOKEN_HERE]
- Migration file: src/app/(dashboard)/(content)/testimonial/_migrations/[MIGRATION_FILE_NAME].sql

**What I need:**
1. Install Supabase CLI if needed (I'm on macOS)
2. Set the access token as environment variable
3. Link to my Supabase project using the project reference ID
4. Copy the migration file to supabase/migrations/ directory with proper timestamp format (YYYYMMDDHHMMSS_description.sql)
5. Apply the migration using: supabase db push --linked
6. Verify the migration was applied successfully
7. Clean up the temporary timestamped file after success

**Requirements:**
- Use non-interactive flags where possible
- Handle errors gracefully
- Show me what you're doing at each step
- Ask if you need any clarification

Please proceed step by step and let me know if you encounter any issues.
```

---

## Alternative: Step-by-Step Prompt

If you prefer to do it step by step:

```
Step 1: I need to install Supabase CLI. I'm on macOS. Please install it using Homebrew.

Step 2: I have my Supabase credentials:
- Project Reference ID: [YOUR_PROJECT_REF]
- Access Token: [YOUR_ACCESS_TOKEN]

Please set the access token and link to my project.

Step 3: I need to apply this migration file:
src/app/(dashboard)/(content)/testimonial/_migrations/[MIGRATION_FILE].sql

Please copy it to the migrations directory with a timestamp and apply it.
```

---

## What to Replace

In the prompts above, replace:

- `[PASTE_YOUR_PROJECT_REF_ID_HERE]` → Your actual project reference ID
- `[PASTE_YOUR_ACCESS_TOKEN_HERE]` → Your actual access token
- `[MIGRATION_FILE_NAME]` → The migration file you want to apply (e.g., `001_create_testimonials.sql`)
- Full path example: `src/app/(dashboard)/(content)/testimonial/_migrations/001_create_testimonials.sql`

---

## Example with Real Values

```
I need to apply a Supabase database migration. Please help me:

**My Information:**
- Project Reference ID: eulbmopenrdcghbcowxf
- Access Token: sbp_ea094a3b799c5de4d242ae9e982707dd2a309a22
- Migration file: src/app/(dashboard)/(content)/testimonial/_migrations/009_combined_category_update.sql

**What I need:**
1. Install Supabase CLI if needed (I'm on macOS)
2. Set the access token as environment variable
3. Link to my Supabase project using the project reference ID
4. Copy the migration file to supabase/migrations/ directory with proper timestamp format
5. Apply the migration using: supabase db push --linked
6. Verify the migration was applied successfully
7. Clean up the temporary timestamped file after success

Please proceed step by step.
```

---

## What AI Will Do

The AI assistant will:

1. ✅ Check if Supabase CLI is installed
2. ✅ Install it if needed: `brew install supabase/tap/supabase`
3. ✅ Set your access token: `export SUPABASE_ACCESS_TOKEN=...`
4. ✅ Link to project: `supabase link --project-ref [YOUR_REF]`
5. ✅ Generate timestamp: `date +"%Y%m%d%H%M%S"`
6. ✅ Copy migration file: `cp src/app/(dashboard)/(content)/testimonial/_migrations/[FILE].sql supabase/migrations/[TIMESTAMP]_[NAME].sql`
7. ✅ Apply migration: `supabase db push --linked`
8. ✅ Verify success: Check output or run verification query
9. ✅ Clean up: `rm supabase/migrations/[TIMESTAMP]_[NAME].sql`

---

## Getting Your Credentials

**Project Reference ID:**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: Settings → General
4. Copy the "Reference ID"

**Access Token:**

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a name (e.g., "Migration Token")
4. Copy the token immediately (you won't see it again!)

---

## Troubleshooting Tips for AI

If the AI gets stuck, you can clarify:

**If AI asks about migration file location:**

- "The file is in: src/app/(dashboard)/(content)/testimonial/\_migrations/[FILE_NAME].sql"

**If AI asks about timestamp format:**

- "Use format: YYYYMMDDHHMMSS (year, month, day, hour, minute, second)"

**If AI asks about which command to use:**

- "Use: supabase db push --linked"

**If AI needs project reference:**

- "My project reference ID is: [YOUR_PROJECT_REF]"

---

## Safety Reminder

Before the AI applies migrations:

1. ✅ Make sure you've backed up your database
2. ✅ Verify the migration file is correct
3. ✅ Test in a development environment first if possible

You can add this to your prompt:

```
Before applying, please remind me to backup my database. I'll confirm when ready.
```

---

## Quick Copy-Paste Template

```plaintext
I need to apply Supabase migration: src/app/(dashboard)/(content)/testimonial/_migrations/[FILE_NAME].sql

Project Reference ID: [YOUR_PROJECT_REF]
Access Token: [YOUR_TOKEN]

Please install CLI if needed, link project, apply migration, verify, and clean up.
```

Replace the placeholders and send to your AI assistant!
