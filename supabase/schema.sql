-- ============================================================
-- RyzuLab — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PROFILES
--    One row per authenticated user. Username is the login name.
--    is_admin grants access to the admin dashboard.
-- ============================================================
create table if not exists public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    username    text unique not null,
    total_score integer not null default 0,
    streak      integer not null default 0,
    last_solve  date,
    is_admin    boolean not null default false,
    created_at  timestamptz not null default now()
);

-- ============================================================
-- 2. SOLVES
--    One row per solved challenge per user. Unique(user,challenge)
--    prevents double-awarding points.
-- ============================================================
create table if not exists public.solves (
    id           bigint generated always as identity primary key,
    user_id      uuid not null references auth.users(id) on delete cascade,
    challenge_id text not null,
    points       integer not null default 0,
    solved_at    timestamptz not null default now(),
    unique (user_id, challenge_id)
);

create index if not exists solves_user_idx on public.solves(user_id);
create index if not exists profiles_score_idx on public.profiles(total_score desc);

-- ============================================================
-- 3. AUTO-CREATE PROFILE ON SIGN UP
--    Pulls the username from raw_user_meta_data.username.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, username)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ============================================================
-- 4. RPC: record_solve
--    Atomically records a solve, awards points once, and
--    updates streak + total_score. SECURITY DEFINER so it can
--    write to profiles without broad RLS policies.
-- ============================================================
create or replace function public.record_solve(
    p_challenge_id text,
    p_points integer
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid        uuid := auth.uid();
    v_today      date := current_date;
    v_inserted   boolean := false;
    v_rowcount   int;
    v_new_streak int;
    v_total      int;
begin
    if v_uid is null then
        return json_build_object('ok', false, 'error', 'not_authenticated');
    end if;

    -- Insert once (unique constraint blocks duplicates)
    insert into public.solves (user_id, challenge_id, points)
    values (v_uid, p_challenge_id, p_points)
    on conflict (user_id, challenge_id) do nothing;

    get diagnostics v_rowcount = row_count;
    v_inserted := (v_rowcount > 0);

    if not v_inserted then
        select total_score, streak into v_total, v_new_streak
        from public.profiles where id = v_uid;
        return json_build_object('ok', true, 'awarded', false,
            'total_score', v_total, 'streak', v_new_streak);
    end if;

    -- Recompute streak based on last_solve before today
    select
        case
            when last_solve = v_today then streak            -- already solved today
            when last_solve = v_today - 1 then streak + 1    -- consecutive day
            else 1                                           -- new / broken streak
        end
    into v_new_streak
    from public.profiles where id = v_uid;

    if v_new_streak is null then
        v_new_streak := 1;
    end if;

    update public.profiles
       set total_score = total_score + p_points,
           streak      = v_new_streak,
           last_solve  = v_today
     where id = v_uid
    returning total_score into v_total;

    return json_build_object('ok', true, 'awarded', true,
        'total_score', v_total, 'streak', v_new_streak, 'points', p_points);
end;
$$;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.solves   enable row level security;

-- Helper: is the caller an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ---- profiles policies ----
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
    on public.profiles for select
    using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
    on public.profiles for update
    using (id = auth.uid() or public.is_admin())
    with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
    on public.profiles for insert
    with check (id = auth.uid());

-- ---- solves policies ----
drop policy if exists "solves_select_own" on public.solves;
create policy "solves_select_own"
    on public.solves for select
    using (user_id = auth.uid() or public.is_admin());

drop policy if exists "solves_insert_own" on public.solves;
create policy "solves_insert_own"
    on public.solves for insert
    with check (user_id = auth.uid());

-- ============================================================
-- 6. LEADERBOARD
--    profiles RLS only exposes your own row (or all rows to admins),
--    so a plain select can't build a global board. This SECURITY
--    DEFINER function reads across all users but exposes ONLY
--    non-sensitive aggregate columns (username, score, streak).
-- ============================================================
create or replace function public.get_leaderboard(p_limit integer default 10)
returns table (
    username    text,
    total_score integer,
    streak      integer,
    solved_count bigint
)
language sql
security definer
set search_path = public
stable
as $$
    select
        p.username,
        p.total_score,
        p.streak,
        (select count(*) from public.solves s where s.user_id = p.id) as solved_count
    from public.profiles p
    order by p.total_score desc, p.created_at asc
    limit greatest(1, least(coalesce(p_limit, 10), 100));
$$;

grant execute on function public.get_leaderboard(integer) to authenticated, anon;

-- ============================================================
-- 7. MAKE YOURSELF ADMIN
--    After you sign up in the app, run this once with your username:
--    update public.profiles set is_admin = true where username = 'yourname';
-- ============================================================
