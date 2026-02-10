"use client";

import { useState } from "react";
import TrackCards, { Track } from "@/components/TrackCards";
import { ui } from "@/lib/ui";
import { useRouter } from "next/navigation";

export default function CreateVentureForm() {
  const router = useRouter();

  const [track, setTrack] = useState<Track | null>(null);
  const [ventureName, setVentureName] = useState("");
  const [captainRole, setCaptainRole] = useState("Team Captain");

  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!track) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/create-venture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, ventureName, captainRole }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to create venture");

      setInviteCode(json.inviteCode);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.card}>
      <div className={ui.h1}>Create your team venture</div>
      <div className={ui.p}>You’ll get a join code to share with teammates.</div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <div className={ui.label}>Choose a track</div>
          <div className="mt-2">
            <TrackCards value={track} onChange={setTrack} />
          </div>
        </div>

        <div>
          <div className={ui.label}>Venture name</div>
          <input
            className={ui.input}
            placeholder="e.g., LumaLoop, CareNest, ReBox"
            value={ventureName}
            onChange={(e) => setVentureName(e.target.value)}
          />
        </div>

        <div>
          <div className={ui.label}>Your role (optional)</div>
          <input className={ui.input} value={captainRole} onChange={(e) => setCaptainRole(e.target.value)} />
        </div>

        <button className={ui.button} disabled={loading || !track || !ventureName.trim()}>
          {loading ? "Creating…" : "Create team & get code"}
        </button>

        {error && <div className={ui.error}>{error}</div>}

        {inviteCode && (
          <div className={ui.success}>
            <div className="font-semibold">Team join code</div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="rounded-lg border bg-white px-3 py-2 text-base">{inviteCode}</code>
              <button type="button" className={ui.buttonGhost} onClick={() => navigator.clipboard.writeText(inviteCode)}>
                Copy
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={ui.button} onClick={() => router.push("/game")}>
                Go to game
              </button>
              <button type="button" className={ui.buttonGhost} onClick={() => router.push("/join")}>
                Test join flow
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
