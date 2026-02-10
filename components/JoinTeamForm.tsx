"use client";

import { useState } from "react";
import { ui } from "@/lib/ui";
import { useRouter } from "next/navigation";

export default function JoinTeamForm() {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState("");
  const [teamRole, setTeamRole] = useState("Team Member");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/join-venture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode, teamRole }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to join");

      router.push("/game");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.card}>
      <div className={ui.h1}>Join a team</div>
      <div className={ui.p}>Enter the join code from your team captain.</div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <div className={ui.label}>Join code</div>
          <input
            className={ui.input}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="e.g., 8KQ2M7P"
          />
        </div>

        <div>
          <div className={ui.label}>Your role (optional)</div>
          <input className={ui.input} value={teamRole} onChange={(e) => setTeamRole(e.target.value)} />
        </div>

        <button className={ui.button} disabled={loading || inviteCode.trim().length < 4}>
          {loading ? "Joining…" : "Join team"}
        </button>

        {error && <div className={ui.error}>{error}</div>}
      </form>
    </div>
  );
}
