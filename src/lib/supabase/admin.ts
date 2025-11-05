import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client with service_role key.
 * This client bypasses Row Level Security (RLS) and can perform admin operations.
 * 
 * Use this for operations that require elevated privileges, such as:
 * - Auto-confirming user emails
 * - Updating user metadata
 * - Bypassing RLS policies
 * 
 * SECURITY WARNING: Never expose the service_role key to the client side.
 * This should only be used in server-side API routes.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file. " +
        "Get these values from: https://supabase.com/dashboard/project/_/settings/api"
    );
  }

  // Validate URL format
  if (
    supabaseUrl === "your-project-url-here" ||
    !supabaseUrl.startsWith("http")
  ) {
    throw new Error(
      `Invalid SUPABASE_URL: Please replace the placeholder "${supabaseUrl}" with your actual Supabase project URL.\n\n` +
        `The URL should look like: https://xxxxxxxxxxxxx.supabase.co\n\n` +
        `Get your Supabase credentials from: https://supabase.com/dashboard/project/_/settings/api\n\n` +
        `Update your .env.local file with the actual values.`
    );
  }

  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(
      `Invalid SUPABASE_URL: "${supabaseUrl}" must be a valid HTTP or HTTPS URL.\n\n` +
        `The URL should look like: https://xxxxxxxxxxxxx.supabase.co\n\n` +
        `Get the correct value from: https://supabase.com/dashboard/project/_/settings/api`
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

