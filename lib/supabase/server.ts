import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function supabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.https://fuqpqwvvhpqteoiwlxcr.supabase.co!,
    process.env.sb_publishable_DRTqL7IXk4X-g6FrsKGlmw_hKeKNN0j!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // Expire the cookie
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}

