import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  if (typeof window === "undefined") {
    throw new Error("supabaseBrowser() called on the server");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
