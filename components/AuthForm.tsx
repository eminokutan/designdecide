"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ui } from "@/lib/ui";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fn =
        mode === "signup" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
      const { error } = await fn({ email, password });
      if (error) throw error;

      router.push("/onboarding");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.card}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={ui.h1}>{mode === "signup" ? "Create account" : "Log in"}</div>
          <div className={ui.p}>Use your school email if possible.</div>
        </div>

        <button
          type="button"
          className={ui.buttonGhost}
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          Switch to {mode === "signup" ? "Log in" : "Sign up"}
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <div className={ui.label}>Email</div>
          <input className={ui.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <div className={ui.label}>Password</div>
          <input
            className={ui.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={ui.button} disabled={loading || !email || !password}>
          {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
        </button>

        {error && <div className={ui.error}>{error}</div>}
      </form>
    </div>
  );
}
