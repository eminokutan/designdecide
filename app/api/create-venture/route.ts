import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function makeCode(len = 7) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

type Track = "product_lighting" | "service_care" | "sustainability_reuse";

function entryKeyForTrack(track: Track) {
  if (track === "product_lighting") return "W1_PRODUCT_INTRO";
  if (track === "service_care") return "W1_SERVICE_INTRO";
  return "W1_REUSE_INTRO";
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { track, ventureName, captainRole } = body as {
    track: Track;
    ventureName: string;
    captainRole?: string;
  };

  if (!track || !ventureName?.trim()) {
    return NextResponse.json({ error: "Missing track or ventureName" }, { status: 400 });
  }

  // Ensure profile exists
  const { error: profErr } = await supabase.from("profiles").upsert({ id: user.id });
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

  // Track-specific entry node for Week 1
  const { data: entryNode, error: enErr } = await supabase
    .from("scenario_nodes")
    .select("id")
    .eq("week_id", 1)
    .eq("track", track)
    .eq("node_key", entryKeyForTrack(track))
    .single();

  if (enErr) return NextResponse.json({ error: `Missing Week 1 content: ${enErr.message}` }, { status: 400 });
  const entryNodeId = entryNode.id;

  // Create venture
  const { data: venture, error: ventureErr } = await supabase
    .from("ventures")
    .insert({
      track,
      venture_name: ventureName.trim(),
      created_by: user.id,
    })
    .select("id")
    .single();

  if (ventureErr) return NextResponse.json({ error: ventureErr.message }, { status: 400 });

  // Add captain as admin member
  const { error: memberErr } = await supabase.from("venture_members").insert({
    venture_id: venture.id,
    user_id: user.id,
    team_role: captainRole ?? null,
    permission: "admin",
  });

  if (memberErr) return NextResponse.json({ error: memberErr.message }, { status: 400 });

  // Create venture state
  const { error: stateErr } = await supabase.from("venture_state").insert({
    venture_id: venture.id,
    current_week: 1,
    current_node_id: entryNodeId,
    variables: { budget: 100, reputation: 50, risk: 20 },
  });

  if (stateErr) return NextResponse.json({ error: stateErr.message }, { status: 400 });

  // Create reusable invite code
  let inviteCode = makeCode(7);
  for (let i = 0; i < 6; i++) {
    const { data: existing } = await supabase
      .from("venture_invites")
      .select("id")
      .eq("invite_code", inviteCode)
      .maybeSingle();

    if (!existing) break;
    inviteCode = makeCode(7);
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error: inviteErr } = await supabase.from("venture_invites").insert({
    venture_id: venture.id,
    invite_code: inviteCode,
    permission: "member",
    expires_at: expiresAt,
    created_by: user.id,
  });

  if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 400 });

  return NextResponse.json({ ventureId: venture.id, inviteCode });
}
