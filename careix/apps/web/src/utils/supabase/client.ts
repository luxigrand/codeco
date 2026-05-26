import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "VITE_SUPABASE_URL ve VITE_SUPABASE_PUBLISHABLE_KEY .env.local içinde tanımlı olmalı."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
