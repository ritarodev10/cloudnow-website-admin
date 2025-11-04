# Supabase Migrations

This directory contains database migration files for the CloudNow Solutions admin website.

## Directory Structure

Migrations follow a **feature-based structure**, organized alongside their feature code:

```
src/app/(dashboard)/(content)/
├── testimonial/
│   ├── _components/
│   ├── _hooks/
│   ├── _migrations/              ← Feature migrations live here
│   │   ├── README.md
│   │   ├── 000_apply_all_migrations.sql
│   │   ├── 001_create_testimonials.sql
│   │   ├── 002_create_testimonial_groups.sql
│   │   └── ...
│   └── page.tsx
└── [other-feature]/
    └── _migrations/

supabase/
└── migrations/
    ├── README.md (this file)
    ├── .migration-template.sh (helper script)
    └── [timestamp]_[description].sql (temporary files for CLI only)
```

**Note:** The `supabase/migrations/` directory only contains temporary timestamped files during CLI operations. All source migrations live in feature `_migrations/` directories.

## Quick Start

### Option 1: Using Helper Script

```bash
# Make script executable (first time only)
chmod +x supabase/migrations/.migration-template.sh

# Run migration (interactive - will show features and migrations)
./supabase/migrations/.migration-template.sh

# Or specify file directly (multiple formats supported)
./supabase/migrations/.migration-template.sh testimonial/_migrations/001_create_testimonials.sql
./supabase/migrations/.migration-template.sh src/app/(dashboard)/(content)/testimonial/_migrations/001_create_testimonials.sql
./supabase/migrations/.migration-template.sh 001_create_testimonials.sql  # searches all features
```

### Option 2: Manual CLI

```bash
# Set access token
export SUPABASE_ACCESS_TOKEN=your_token_here

# Link project (first time only)
supabase link --project-ref eulbmopenrdcghbcowxf

# Copy migration from feature _migrations directory to migrations root
cp src/app/(dashboard)/(content)/testimonial/_migrations/[file].sql \
   supabase/migrations/[timestamp]_[description].sql

# Apply migration
supabase db push --linked

# Clean up temporary file
rm supabase/migrations/[timestamp]_[description].sql
```

### Option 3: Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/eulbmopenrdcghbcowxf/sql/new
2. Copy SQL from migration file
3. Paste and run

## Migration Naming Convention

**Source files (in `_migrations` directories):**

- Format: `###_description.sql`
- Example: `001_create_testimonials.sql`
- Location: `src/app/(dashboard)/(content)/[feature]/_migrations/`

**CLI migration files (temporary):**

- Format: `[YYYYMMDDHHMMSS]_description.sql`
- Example: `20241103190000_combined_category_update.sql`
- Location: `supabase/migrations/` (root, temporary only)

## Important Notes

1. **Never commit CLI migration files** (the timestamped ones in `supabase/migrations/`)
2. **Always backup** before applying migrations
3. **Test migrations** in a development environment first if possible
4. **Feature-based structure**: Each feature's migrations live in `src/app/(dashboard)/(content)/[feature]/_migrations/`
5. **Follow naming pattern**: Use `_migrations` directory name (with underscore) to match `_components` and `_hooks` pattern

## Documentation

- **Detailed Guide:** See `../CLI_MIGRATION_GUIDE.md`
- **General Migration Guide:** See `../MIGRATION_GUIDE.md`
- **Feature-specific docs:** See `src/app/(dashboard)/(content)/[feature]/_migrations/README.md`

## Troubleshooting

See `../CLI_MIGRATION_GUIDE.md` for troubleshooting steps.

## Helper Script Usage

The `.migration-template.sh` script provides:

- ✅ Automatic requirement checking
- ✅ Timestamp generation
- ✅ Interactive file selection
- ✅ Automatic cleanup options
- ✅ Color-coded output

**Usage:**

```bash
./supabase/migrations/.migration-template.sh [migration-file.sql]
```

If no file specified, runs in interactive mode where you can:

1. Select a feature from the list
2. Select a migration file from that feature
3. The script automatically handles the rest
