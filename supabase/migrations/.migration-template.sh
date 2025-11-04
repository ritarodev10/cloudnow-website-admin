#!/bin/bash
# Migration Helper Script
# Usage: ./migration-template.sh [migration-file.sql]
#
# This script helps apply migrations to Supabase using the CLI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_REF="eulbmopenrdcghbcowxf"
MIGRATIONS_DIR="supabase/migrations"
FEATURES_DIR="src/app/(dashboard)/(content)"

# Functions
print_error() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

check_requirements() {
    print_info "Checking requirements..."
    
    # Check if supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not found. Install with: brew install supabase/tap/supabase"
        exit 1
    fi
    
    print_success "Supabase CLI found: $(supabase --version)"
    
    # Check if access token is set
    if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
        print_info "Access token not set. You may need to run 'supabase login' or set SUPABASE_ACCESS_TOKEN"
    else
        print_success "Access token is set"
    fi
    
    # Check if we're in the right directory
    if [ ! -d "$FEATURES_DIR" ]; then
        print_error "Not in project root or features directory not found: $FEATURES_DIR"
        exit 1
    fi
    
    print_success "All requirements met"
}

# Find all _migrations directories in features
find_migration_dirs() {
    find "$FEATURES_DIR" -type d -name "_migrations" 2>/dev/null | sort
}

# Get feature name from migration directory path
get_feature_name() {
    local migration_dir=$1
    local feature_path=$(dirname "$migration_dir")
    basename "$feature_path"
}

# List available features with migrations
list_features() {
    local features=()
    local dirs=($(find_migration_dirs))
    
    if [ ${#dirs[@]} -eq 0 ]; then
        print_error "No _migrations directories found in $FEATURES_DIR"
        exit 1
    fi
    
    local i=1
    for dir in "${dirs[@]}"; do
        local feature=$(get_feature_name "$dir")
        echo "$i) $feature"
        features[$i]="$dir"
        ((i++))
    done
    
    echo "${features[@]}"
}

generate_timestamp() {
    date +"%Y%m%d%H%M%S"
}

apply_migration() {
    local source_file=$1
    local description=$2
    
    if [ ! -f "$source_file" ]; then
        print_error "Migration file not found: $source_file"
        exit 1
    fi
    
    # Generate timestamp and target filename
    local timestamp=$(generate_timestamp)
    local target_file="$MIGRATIONS_DIR/${timestamp}_${description}.sql"
    
    print_info "Applying migration..."
    print_info "Source: $source_file"
    print_info "Target: $target_file"
    
    # Copy file to migrations directory
    cp "$source_file" "$target_file"
    print_success "Migration file copied"
    
    # Apply migration
    print_info "Pushing migration to Supabase..."
    if supabase db push --linked; then
        print_success "Migration applied successfully!"
        
        # Ask if user wants to clean up
        read -p "Remove temporary migration file? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$target_file"
            print_success "Temporary file removed"
        else
            print_info "Temporary file kept at: $target_file"
        fi
    else
        print_error "Migration failed!"
        print_info "Temporary file kept at: $target_file for debugging"
        exit 1
    fi
}

# Main execution
main() {
    echo "=========================================="
    echo "  Supabase Migration Helper"
    echo "=========================================="
    echo ""
    
    check_requirements
    echo ""
    
    # If migration file provided as argument
    if [ -n "$1" ]; then
        source_file="$1"
        
        # Get description from filename (remove path and extension)
        description=$(basename "$source_file" .sql | sed 's/^[0-9]*_//' | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
        
        # Handle different path formats
        if [[ "$source_file" == /* ]]; then
            # Absolute path - use as is
            if [ ! -f "$source_file" ]; then
                print_error "File not found: $source_file"
                exit 1
            fi
        elif [[ "$source_file" == *"/_migrations/"* ]]; then
            # Path like "testimonial/_migrations/file.sql" - check if relative or in features dir
            if [ -f "$source_file" ]; then
                # Already a valid path
                :
            elif [ -f "$FEATURES_DIR/$source_file" ]; then
                source_file="$FEATURES_DIR/$source_file"
            else
                print_error "File not found: $source_file"
                exit 1
            fi
        elif [[ "$source_file" == *".sql" ]]; then
            # Just filename - search in all _migrations directories
            local found=""
            for dir in $(find_migration_dirs); do
                if [ -f "$dir/$source_file" ]; then
                    source_file="$dir/$source_file"
                    found="yes"
                    break
                fi
            done
            if [ -z "$found" ]; then
                print_error "Migration file not found in any _migrations directory: $source_file"
                exit 1
            fi
        else
            # Try as-is first, then search
            if [ -f "$source_file" ]; then
                # Already valid
                :
            else
                local found=""
                for dir in $(find_migration_dirs); do
                    if [ -f "$dir/$source_file" ]; then
                        source_file="$dir/$source_file"
                        found="yes"
                        break
                    fi
                done
                if [ -z "$found" ]; then
                    print_error "Migration file not found: $source_file"
                    exit 1
                fi
            fi
        fi
        
        apply_migration "$source_file" "$description"
    else
        # Interactive mode
        print_info "Interactive mode"
        echo ""
        
        # List features
        local dirs=($(find_migration_dirs))
        if [ ${#dirs[@]} -eq 0 ]; then
            print_error "No _migrations directories found in $FEATURES_DIR"
            exit 1
        fi
        
        echo "Available features:"
        local i=1
        declare -A feature_dirs
        for dir in "${dirs[@]}"; do
            local feature=$(get_feature_name "$dir")
            echo "  $i) $feature"
            feature_dirs[$i]="$dir"
            ((i++))
        done
        echo ""
        
        read -p "Select feature (1-${#dirs[@]}): " feature_choice
        
        if [ -z "$feature_choice" ] || ! [[ "$feature_choice" =~ ^[0-9]+$ ]] || [ "$feature_choice" -lt 1 ] || [ "$feature_choice" -gt ${#dirs[@]} ]; then
            print_error "Invalid selection"
            exit 1
        fi
        
        local selected_dir="${feature_dirs[$feature_choice]}"
        local feature=$(get_feature_name "$selected_dir")
        
        echo ""
        echo "Available migration files for '$feature':"
        local migrations=($(ls -1 "$selected_dir"/*.sql 2>/dev/null | xargs -n1 basename))
        
        if [ ${#migrations[@]} -eq 0 ]; then
            print_error "No migration files found in $selected_dir"
            exit 1
        fi
        
        local j=1
        for mig in "${migrations[@]}"; do
            echo "  $j) $mig"
            ((j++))
        done
        echo ""
        
        read -p "Select migration file (1-${#migrations[@]}) or enter filename/path: " migration_input
        
        if [ -z "$migration_input" ]; then
            print_error "No migration file specified"
            exit 1
        fi
        
        # Check if it's a number selection
        if [[ "$migration_input" =~ ^[0-9]+$ ]] && [ "$migration_input" -ge 1 ] && [ "$migration_input" -le ${#migrations[@]} ]; then
            local selected_migration="${migrations[$((migration_input-1))]}"
            source_file="$selected_dir/$selected_migration"
        elif [ -f "$migration_input" ]; then
            # Full path provided
            source_file="$migration_input"
        elif [ -f "$selected_dir/$migration_input" ]; then
            # Filename in selected feature directory
            source_file="$selected_dir/$migration_input"
        else
            print_error "File not found: $migration_input"
            exit 1
        fi
        
        # Auto-generate description from filename
        description=$(basename "$source_file" .sql | sed 's/^[0-9]*_//' | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
        
        apply_migration "$source_file" "$description"
    fi
}

# Run main function
main "$@"

