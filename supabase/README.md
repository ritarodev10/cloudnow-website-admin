# Supabase Migrations

This directory contains database migration files and instructions for applying them.

## Quick Start

**🚀 Easiest Way:** See [`MIGRATION_INSTRUCTIONS.md`](./MIGRATION_INSTRUCTIONS.md)

Two simple options:
1. **AI Assistant Method** - Let AI do it (Cursor/Claude/ChatGPT)
2. **Dashboard Method** - Copy/paste SQL (no CLI needed)

---

## Documentation Files

### Main Guides

- **`MIGRATION_INSTRUCTIONS.md`** ⭐ **START HERE**
  - Simple, step-by-step guide
  - Works for any project/client
  - AI Assistant and Dashboard methods

- **`CLI_MIGRATION_GUIDE.md`**
  - Detailed CLI reference
  - Advanced troubleshooting
  - Project-specific customization

- **`MIGRATION_GUIDE.md`**
  - Original dashboard-focused guide
  - Good for first-time setup

### Testimonials Migrations

- **`migrations/testimonials/README.md`**
  - Migration file descriptions
  - Which migration to use when
  - Quick reference

- **`migrations/testimonials/AI_ASSISTANT_PROMPT.md`**
  - Ready-to-use AI prompts
  - Copy/paste templates
  - Examples included

### Helper Scripts

- **`migrations/.migration-template.sh`**
  - Automated migration helper
  - Interactive mode
  - For advanced users

---

## Directory Structure

```
supabase/
├── README.md (this file)
├── MIGRATION_INSTRUCTIONS.md ⭐ Main guide
├── CLI_MIGRATION_GUIDE.md (advanced)
├── MIGRATION_GUIDE.md (original)
└── migrations/
    ├── README.md (directory overview)
    ├── .migration-template.sh (helper script)
    └── testimonials/ (feature migrations)
        ├── README.md
        ├── AI_ASSISTANT_PROMPT.md
        ├── 000_apply_all_migrations.sql
        ├── 001_create_testimonials.sql
        ├── 002_create_testimonial_groups.sql
        ├── 004_setup_rls_policies.sql
        ├── 005_seed_testimonials.sql
        ├── 006_seed_testimonial_groups.sql
        ├── 007_replace_groups_with_categories.sql
        ├── 008_add_category_validation.sql
        └── 009_combined_category_update.sql
```

---

## Which Guide to Use?

### First Time? New Client?

→ **Read:** [`MIGRATION_INSTRUCTIONS.md`](./MIGRATION_INSTRUCTIONS.md)

### Using AI Assistant?

→ **Read:** [`migrations/testimonials/AI_ASSISTANT_PROMPT.md`](./migrations/testimonials/AI_ASSISTANT_PROMPT.md)

### Want Dashboard Method?

→ **Read:** [`MIGRATION_INSTRUCTIONS.md`](./MIGRATION_INSTRUCTIONS.md) - Section 2

### Need Advanced CLI Help?

→ **Read:** [`CLI_MIGRATION_GUIDE.md`](./CLI_MIGRATION_GUIDE.md)

---

## Common Tasks

### Apply Initial Setup
**File:** `migrations/testimonials/000_apply_all_migrations.sql`
**Method:** See `MIGRATION_INSTRUCTIONS.md`

### Update Categories Only
**File:** `migrations/testimonials/009_combined_category_update.sql`
**Method:** See `MIGRATION_INSTRUCTIONS.md`

### Apply Individual Migration
**Files:** `migrations/testimonials/001-008_*.sql`
**Order:** Apply in numerical order
**Method:** See `MIGRATION_INSTRUCTIONS.md`

---

## What You Need

**For AI Assistant Method:**
- Project Reference ID (Dashboard → Settings → General)
- Access Token (Dashboard → Account → Access Tokens)
- Migration file name

**For Dashboard Method:**
- Access to Supabase Dashboard
- Migration file content

---

## Tips

1. **Always backup** before applying migrations
2. **Start with** `MIGRATION_INSTRUCTIONS.md` - it's the simplest
3. **Use AI method** if you're comfortable with AI assistants
4. **Use Dashboard** if you prefer manual control
5. **Read migration files** to understand what they do

---

## Need Help?

1. Check `MIGRATION_INSTRUCTIONS.md` first
2. Look at troubleshooting sections in guides
3. Check Supabase Dashboard → Database → Logs for errors

---

**Last Updated:** November 2024

