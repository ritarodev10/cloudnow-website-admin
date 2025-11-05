import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env.local file. " +
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

  const cookieStore = await cookies();

  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });

  // Check user authentication (silently)
  try {
    await client.auth.getUser();
  } catch (error) {
    // Ignore errors when checking user - might be expected in some contexts
  }

  return client;
}
