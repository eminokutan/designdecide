-- =========================
-- WEEK 1 SEED (3 tracks)
-- =========================

insert into public.weeks (id, title, entry_node_id)
values (1, 'Week 1 — Setup, Framing, First Moves', null)
on conflict (id) do update
set title = excluded.title,
    entry_node_id = excluded.entry_node_id;

with
p_intro as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'product_lighting', 'W1_PRODUCT_INTRO',
   'Week 1 — Lighting Startup: Your first week',
   'You are building a **lighting product** startup.\n\nThis week is about: defining the problem, validating assumptions, and deciding what to prototype first.\n\nYour team has limited time and budget. Decisions will shape your next scenario.')
  returning id
),
p_q1 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'product_lighting', 'W1_PRODUCT_Q1',
   'Decision 1/3 — What problem do you commit to?',
   'You can’t design “a lamp.” You must commit to a **specific job-to-be-done**.\n\nPick your primary problem framing.')
  returning id
),
p_q2 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'product_lighting', 'W1_PRODUCT_Q2',
   'Decision 2/3 — How do you validate quickly?',
   'You need evidence before building.\n\nChoose your validation approach for the next 5 days.')
  returning id
),
p_q3 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'product_lighting', 'W1_PRODUCT_Q3',
   'Decision 3/3 — What prototype do you build first?',
   'You have time for one primary prototype sprint.\n\nPick the first prototype focus.')
  returning id
),
p_end as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'product_lighting', 'W1_PRODUCT_END',
   'Week 1 Summary — Lighting Startup',
   'Week 1 complete.\n\n**What you achieved:**\n- You framed a design problem\n- You chose a validation method\n- You built a first prototype direction\n\nNext week you will face trade-offs around cost, manufacturability, and user feedback.')
  returning id
),
p_c_q1 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    p_q1.id,
    c.choice_key,
    c.label,
    c.description,
    p_q2.id,
    c.effects::jsonb
  from p_q1, p_q2,
  (values
    ('A', 'Focus on mood & ambience', 'Design for emotional experience: “Make spaces feel calmer / warmer.”', '{"reputation": 3, "risk": 2}'),
    ('B', 'Focus on task lighting', 'Design for performance: “Help people work/see better in real settings.”', '{"reputation": 2, "risk": 1}'),
    ('C', 'Focus on energy efficiency', 'Design for sustainability & bills: “Reduce energy use without sacrificing quality.”', '{"reputation": 1, "risk": 1, "budget": 2}')
  ) as c(choice_key, label, description, effects)
  returning id
),
p_c_q2 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    p_q2.id,
    c.choice_key,
    c.label,
    c.description,
    p_q3.id,
    c.effects::jsonb
  from p_q2, p_q3,
  (values
    ('A', 'User interviews (8–10)', 'Talk to users in context; capture pains, triggers, constraints.', '{"reputation": 3, "budget": -2, "risk": -2}'),
    ('B', 'Competitive teardown', 'Buy/inspect competitors; map features, price, assembly, materials.', '{"reputation": 1, "budget": -3, "risk": -1}'),
    ('C', 'Landing page + preorder test', 'Message test + interest signal before building.', '{"reputation": 2, "budget": -1, "risk": -2}')
  ) as c(choice_key, label, description, effects)
  returning id
),
p_c_q3 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    p_q3.id,
    c.choice_key,
    c.label,
    c.description,
    p_end.id,
    c.effects::jsonb
  from p_q3, p_end,
  (values
    ('A', 'Form & interaction prototype', 'Size/shape/controls to test usability and desirability.', '{"reputation": 3, "budget": -4, "risk": -1}'),
    ('B', 'Optics & lighting quality prototype', 'LED + diffuser + beam quality to test performance.', '{"reputation": 2, "budget": -5, "risk": -2}'),
    ('C', 'Manufacturing feasibility mock', 'Materials, assembly, cost model, suppliers.', '{"reputation": 1, "budget": -2, "risk": -3}')
  ) as c(choice_key, label, description, effects)
  returning id
),
s_intro as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'service_care', 'W1_SERVICE_INTRO',
   'Week 1 — Care Economy Service: Your first week',
   'You are building a **care economy service**.\n\nThis week is about: defining the service promise, understanding stakeholders, and choosing how you pilot safely.\n\nDecisions will affect trust, risk, and operational complexity.')
  returning id
),
s_q1 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'service_care', 'W1_SERVICE_Q1',
   'Decision 1/3 — Who is your primary user?',
   'Care services often have **multiple stakeholders**.\n\nPick the primary user you optimize for first.')
  returning id
),
s_q2 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'service_care', 'W1_SERVICE_Q2',
   'Decision 2/3 — What is your trust mechanism?',
   'Trust is everything in care.\n\nChoose the primary mechanism you build first.')
  returning id
),
s_q3 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'service_care', 'W1_SERVICE_Q3',
   'Decision 3/3 — How do you pilot?',
   'You must pilot in a way that is ethical and manageable.\n\nChoose your pilot approach.')
  returning id
),
s_end as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'service_care', 'W1_SERVICE_END',
   'Week 1 Summary — Care Economy Service',
   'Week 1 complete.\n\n**What you achieved:**\n- You chose a primary user\n- You defined a trust mechanism\n- You planned an ethical pilot\n\nNext week you will face decisions about pricing, service blueprint details, and failure handling.')
  returning id
),
s_c_q1 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    s_q1.id,
    c.choice_key,
    c.label,
    c.description,
    s_q2.id,
    c.effects::jsonb
  from s_q1, s_q2,
  (values
    ('A', 'Care recipient', 'Optimize experience for the person receiving care.', '{"reputation": 3, "risk": 2}'),
    ('B', 'Family decision-maker', 'Optimize for the person choosing/paying for care.', '{"reputation": 2, "risk": 1}'),
    ('C', 'Care provider', 'Optimize for the worker delivering care.', '{"reputation": 2, "risk": 1, "budget": -1}')
  ) as c(choice_key, label, description, effects)
  returning id
),
s_c_q2 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    s_q2.id,
    c.choice_key,
    c.label,
    c.description,
    s_q3.id,
    c.effects::jsonb
  from s_q2, s_q3,
  (values
    ('A', 'Verification + training', 'Identity checks + basic skills training for providers.', '{"reputation": 3, "budget": -3, "risk": -2}'),
    ('B', 'Ratings & reviews', 'Marketplace-style feedback loop and transparency.', '{"reputation": 2, "budget": -1, "risk": -1}'),
    ('C', 'Matching + mediation', 'Strong matching + clear dispute resolution process.', '{"reputation": 2, "budget": -2, "risk": -2}')
  ) as c(choice_key, label, description, effects)
  returning id
),
s_c_q3 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    s_q3.id,
    c.choice_key,
    c.label,
    c.description,
    s_end.id,
    c.effects::jsonb
  from s_q3, s_end,
  (values
    ('A', 'Small local pilot (10 clients)', 'Control quality and learn deeply before scaling.', '{"reputation": 3, "budget": -2, "risk": -2}'),
    ('B', 'Partner with a clinic/NGO', 'Borrow trust and access, but accept constraints.', '{"reputation": 2, "budget": -1, "risk": -1}'),
    ('C', 'Open signups fast', 'Scale learning quickly but risk service inconsistency.', '{"reputation": 1, "budget": 1, "risk": 3}')
  ) as c(choice_key, label, description, effects)
  returning id
),
u_intro as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'sustainability_reuse', 'W1_REUSE_INTRO',
   'Week 1 — Reusability Startup: Your first week',
   'You are building a **reusability/circular** startup.\n\nThis week is about: selecting the reuse system, aligning incentives, and planning your first pilot.\n\nYour decisions will influence feasibility, adoption, and operational risk.')
  returning id
),
u_q1 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'sustainability_reuse', 'W1_REUSE_Q1',
   'Decision 1/3 — What is your reuse model?',
   'Reusability can be product, system, or behavior.\n\nChoose your primary reuse model.')
  returning id
),
u_q2 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'sustainability_reuse', 'W1_REUSE_Q2',
   'Decision 2/3 — What incentive drives returns?',
   'Your system fails if items don’t come back.\n\nChoose the main incentive you design first.')
  returning id
),
u_q3 as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'sustainability_reuse', 'W1_REUSE_Q3',
   'Decision 3/3 — What pilot scope do you run?',
   'Pilots must balance learning with operational complexity.\n\nChoose the pilot scope.')
  returning id
),
u_end as (
  insert into public.scenario_nodes (week_id, track, node_key, title, body)
  values
  (1, 'sustainability_reuse', 'W1_REUSE_END',
   'Week 1 Summary — Reusability Startup',
   'Week 1 complete.\n\n**What you achieved:**\n- You chose a reuse model\n- You designed a return incentive\n- You scoped a pilot\n\nNext week you will face decisions about logistics, cleaning/quality, and growth constraints.')
  returning id
),
u_c_q1 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    u_q1.id,
    c.choice_key,
    c.label,
    c.description,
    u_q2.id,
    c.effects::jsonb
  from u_q1, u_q2,
  (values
    ('A', 'Refill/return packaging', 'Reusable containers for daily goods.', '{"reputation": 2, "risk": 1}'),
    ('B', 'Reusable product-as-a-service', 'Users access items; ownership stays with you.', '{"reputation": 2, "risk": 2}'),
    ('C', 'Shared reuse infrastructure', 'Stations/lockers + standardized returns.', '{"reputation": 1, "risk": 3, "budget": -2}')
  ) as c(choice_key, label, description, effects)
  returning id
),
u_c_q2 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    u_q2.id,
    c.choice_key,
    c.label,
    c.description,
    u_q3.id,
    c.effects::jsonb
  from u_q2, u_q3,
  (values
    ('A', 'Deposit system', 'Simple: pay extra, get money back on return.', '{"reputation": 2, "budget": 1, "risk": -1}'),
    ('B', 'Rewards/points', 'Gamify returns; partner perks possible.', '{"reputation": 2, "budget": -1, "risk": 0}'),
    ('C', 'Convenience-first', 'Make returns effortless; minimize steps and friction.', '{"reputation": 3, "budget": -2, "risk": -1}')
  ) as c(choice_key, label, description, effects)
  returning id
),
u_c_q3 as (
  insert into public.scenario_choices (node_id, choice_key, label, description, next_node_id, effects)
  select
    u_q3.id,
    c.choice_key,
    c.label,
    c.description,
    u_end.id,
    c.effects::jsonb
  from u_q3, u_end,
  (values
    ('A', 'Single neighborhood pilot', 'Low logistics complexity; tight feedback loop.', '{"reputation": 3, "budget": -1, "risk": -2}'),
    ('B', 'One partner venue pilot', 'Café/store partner as a controlled environment.', '{"reputation": 2, "budget": -1, "risk": -1}'),
    ('C', 'City-wide pilot', 'Fast learning, high operational complexity.', '{"reputation": 1, "budget": 1, "risk": 4}')
  ) as c(choice_key, label, description, effects)
  returning id
)

select 'Week 1 seeded: nodes + choices inserted.' as result;
