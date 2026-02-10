# Product Development Case Game (Next.js + Supabase)

Team-based branching case-study game for design students.

## 1) Setup
```bash
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## 2) Supabase prerequisites
Create the database schema and RLS policies (from your earlier SQL).

Then seed Week 1 content:

- Open Supabase Dashboard → SQL Editor
- Paste and run: `supabase/seed-week1.sql`

## 3) Flow
- /login → create account or login
- /onboarding → choose create or join
- Captain: /create-venture → gets a join code
- Teammates: /join → enter join code
- /game → reads venture_state.current_node_id and renders node + choices

## Notes
- This MVP assumes each user is in at most 1 venture; /game picks the first membership row.
- Single shared decision: any member can click; decision is logged with `made_by`.
