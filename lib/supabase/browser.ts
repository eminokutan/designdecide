import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  if (typeof window === "undefined") {
    throw new Error("supabaseBrowser() was called on the server. Use supabaseServer() instead.");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
