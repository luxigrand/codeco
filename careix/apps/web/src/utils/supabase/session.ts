import { createClient } from "./client";

/**
 * Next.js middleware yerine: uygulama açılışında oturumu okur ve
 * token yenilemelerini dinler (@supabase/ssr cookie yönetimi).
 */
export async function initSupabaseSession(): Promise<void> {
  const supabase = createClient();

  await supabase.auth.getSession();

  supabase.auth.onAuthStateChange((_event, _session) => {
    // SSR paketi cookie'leri günceller; ek işlem gerekmez.
  });
}
