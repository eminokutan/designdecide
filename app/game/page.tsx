"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ui } from "@/lib/ui";
import { ScenarioNode } from "@/components/ScenarioNode";
import ChoiceButtons, { Choice } from "@/components/ChoiceButtons";
import Link from "next/link";

type VentureMemberRow = { venture_id: string };
type VentureStateRow = {
  venture_id: string;
  current_node_id: string | null;
  current_week: number;
  variables: any;
};

export default function GamePage() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [ventureId, setVentureId] = useState<string | null>(null);
  const [state, setState] = useState<VentureStateRow | null>(null);
  const [node, setNode] = useState<{ id: string; title: string; body: string } | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      // 1) Ensure logged in
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.href = "/login";
        return;
      }

      // 2) Find a venture via membership (v1: first one)
      const { data: memberships, error: memErr } = await supabase
        .from("venture_members")
        .select("venture_id")
        .limit(1);

      if (memErr) throw memErr;
      const vId = (memberships as VentureMemberRow[] | null)?.[0]?.venture_id;

      if (!vId) {
        setVentureId(null);
        setState(null);
        setNode(null);
        setChoices([]);
        return;
      }
      setVentureId(vId);

      // 3) Load venture state
      const { data: vs, error: vsErr } = await supabase
        .from("venture_state")
        .select("venture_id, current_node_id, current_week, variables")
        .eq("venture_id", vId)
        .single();

      if (vsErr) throw vsErr;
      setState(vs as VentureStateRow);

      if (!vs?.current_node_id) {
        setNode({
          id: "none",
          title: "No active scenario yet",
          body: "Ask your instructor to seed Week 1 content, then refresh.",
        });
        setChoices([]);
        return;
      }

      // 4) Load node
      const { data: n, error: nErr } = await supabase
        .from("scenario_nodes")
        .select("id, title, body")
        .eq("id", vs.current_node_id)
        .single();

      if (nErr) throw nErr;
      setNode(n);

      // 5) Load choices for node
      const { data: ch, error: chErr } = await supabase
        .from("scenario_choices")
        .select("id, choice_key, label, description")
        .eq("node_id", n.id)
        .order("choice_key", { ascending: true });

      if (chErr) throw chErr;
      setChoices((ch ?? []) as Choice[]);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load game");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={ui.container}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className={ui.h2}>Game</div>
          <div className={ui.p}>{state ? `Week ${state.current_week}` : "Not in a team yet"}</div>
        </div>
        <div className="flex gap-2">
          <Link className={ui.buttonGhost} href="/onboarding">
            Onboarding
          </Link>
          <button className={ui.buttonGhost} onClick={load} disabled={loading}>
            Refresh
          </button>
          <button className={ui.buttonGhost} onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {error && <div className={ui.error}>{error}</div>}

      {!ventureId && !loading && (
        <div className={ui.card}>
          <div className={ui.h1}>You’re not in a team yet</div>
          <div className={ui.p}>Create a team or join with a code.</div>
          <div className="mt-4 flex gap-2">
            <Link className={ui.button} href="/create-venture">
              Create team
            </Link>
            <Link className={ui.buttonGhost} href="/join">
              Join team
            </Link>
          </div>
        </div>
      )}

      {loading && <div className={ui.p}>Loading…</div>}

      {node && (
        <>
          <ScenarioNode title={node.title} body={node.body} />
          {ventureId && choices.length > 0 && (
            <ChoiceButtons ventureId={ventureId} choices={choices} onAdvanced={load} />
          )}
          {ventureId && !loading && choices.length === 0 && (
            <div className="mt-3 text-sm text-gray-600">No choices found for this node.</div>
          )}
        </>
      )}
    </main>
  );
}
