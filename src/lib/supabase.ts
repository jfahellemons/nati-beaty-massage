import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let client: SupabaseClient<Database> | null | undefined;

/**
 * Server-only Supabase client with the secret key (shared database with nataly-beheer).
 * Returns null when Supabase isn't configured (local development without credentials).
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  client = url && key ? createClient<Database>(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
