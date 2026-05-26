/**
 * Next.js `middleware.ts` için şablon.
 * Next kurduğunda proje köküne `middleware.ts` ekleyip `updateSession` çağır.
 *
 * Vite (Careix) → `session.ts` içindeki `initSupabaseSession()` kullanılır.
 */
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type CookieLike = { name: string; value: string };
type RequestWithCookies = {
  cookies: { getAll(): CookieLike[]; set(name: string, value: string): void };
};
type ResponseWithCookies = {
  cookies: { set(name: string, value: string, options?: object): void };
};

export function updateSession(
  request: RequestWithCookies,
  response: ResponseWithCookies
): ResponseWithCookies {
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return response;
}
