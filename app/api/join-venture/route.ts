import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { inviteCode, teamRole } = body as { inviteCode: string; teamRole?: string };

  if (!inviteCode?.trim()) return NextResponse.json({ error: "Missing invite code" }, { status: 400 });

  const { error: profErr } = await supabase.from("profiles").upsert({ id: user.id });
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

  const code = inviteCode.trim().toUpperCase();

  const { data: invite, error: invErr } = await supabase
    .from("venture_invites")
    .select("id, venture_id, expires_at, permission")
    .eq("invite_code", code)
    .single();

  if (invErr) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  // Upsert membership
  const { error: memErr } = await supabase.from("venture_members").upsert({
    venture_id: invite.venture_id,
    user_id: user.id,
    team_role: teamRole ?? null,
    permission: invite.permission, // typically "member"
  });

  if (memErr) return NextResponse.json({ error: memErr.message }, { status: 400 });

  return NextResponse.json({ ventureId: invite.venture_id });
}
