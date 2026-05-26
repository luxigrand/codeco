/**
 * Next.js Server Components için — Careix şu an Vite kullanıyor.
 * Next.js'e geçersen bu dosyayı kullan; şimdilik client + session yeterli.
 */
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: object) => void;
};

export const createClient = (cookieStore: CookieStore) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_* ortam değişkenleri gerekli.");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component'ten çağrıldığında yok sayılabilir (middleware yeniler).
        }
      },
    },
  });
};
