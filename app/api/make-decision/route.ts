import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ventureId, choiceId } = body as { ventureId: string; choiceId: string };

  if (!ventureId || !choiceId) return NextResponse.json({ error: "Missing ventureId or choiceId" }, { status: 400 });

  // 1) Load venture_state
  const { data: state, error: stateErr } = await supabase
    .from("venture_state")
    .select("venture_id, current_week, current_node_id, variables")
    .eq("venture_id", ventureId)
    .single();

  if (stateErr) return NextResponse.json({ error: stateErr.message }, { status: 400 });
  if (!state.current_node_id) return NextResponse.json({ error: "No active node" }, { status: 400 });

  // 2) Load choice and next node
  const { data: choice, error: choiceErr } = await supabase
    .from("scenario_choices")
    .select("id, choice_key, next_node_id, effects, node_id")
    .eq("id", choiceId)
    .single();

  if (choiceErr) return NextResponse.json({ error: choiceErr.message }, { status: 400 });
  if (choice.node_id !== state.current_node_id) {
    return NextResponse.json({ error: "Choice does not belong to current node" }, { status: 400 });
  }

  const before = state.variables ?? {};
  const effects = (choice.effects ?? {}) as Record<string, any>;

  // 3) Apply effects (simple numeric add)
  const after: Record<string, any> = { ...before };
  for (const [k, v] of Object.entries(effects)) {
    if (typeof v === "number") after[k] = (typeof after[k] === "number" ? after[k] : 0) + v;
    else after[k] = v;
  }

  // 4) Insert decision log
  const { error: logErr } = await supabase.from("decision_log").insert({
    venture_id: ventureId,
    week_id: state.current_week,
    node_id: state.current_node_id,
    choice_id: choice.id,
    choice_key: choice.choice_key,
    made_by: user.id,
    snapshot_before: before,
    snapshot_after: after,
  });

  if (logErr) return NextResponse.json({ error: logErr.message }, { status: 400 });

  // 5) Advance state
  const { error: updErr } = await supabase
    .from("venture_state")
    .update({
      current_node_id: choice.next_node_id,
      variables: after,
      updated_at: new Date().toISOString(),
    })
    .eq("venture_id", ventureId);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  return NextResponse.json({ ok: true, nextNodeId: choice.next_node_id, variables: after });
}
