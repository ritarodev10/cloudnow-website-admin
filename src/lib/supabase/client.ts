/**
 * @deprecated This project uses server-only Supabase access.
 * Client components should fetch user data from /api/auth/user instead.
 *
 * This file is kept for potential future use but is currently unused.
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * @deprecated Use server-side Supabase client or /api/auth/user API route instead
 */
export function createClient() {
  throw new Error(
    "Client-side Supabase access is disabled. This project uses server-only Supabase access. " +
      "Use the /api/auth/user API route to fetch user data from client components."
  );
}
