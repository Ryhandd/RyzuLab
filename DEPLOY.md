# RyzuLab — setup & deploy checklist

One-time steps to take the code from `D:\Rayhand\Cyber` to a live
**https://RyzuLabs.vercel.app**.

---

## A. Credentials

`.env` (git-ignored, never committed) holds the Supabase config:

```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

`src/lib/supabase.js` reads those two variables and throws a clear error if
either is missing — there are no hardcoded secrets in the source anymore.

Get both values from Supabase → **Project Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

> Never put the `service_role` key in `.env` for this app. It bypasses RLS and
> must stay server-side only.

---

## B. Create the database tables (REQUIRED — do this first)

The app shows *"Could not load your profile"* until the tables exist.

1. Supabase Dashboard → **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql` and click **Run**.

Or run these commands in the SQL editor, in order:

### B1. Tables

```sql
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    username    text unique not null,
    total_score integer not null default 0,
    streak      integer not null default 0,
    last_solve  date,
    is_admin    boolean not null default false,
    created_at  timestamptz not null default now()
);

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
```

### B2. Auto-create a profile on signup

```sql
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
```

### B3. Server-side scoring RPC

```sql
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
    v_rowcount   int;
    v_new_streak int;
    v_total      int;
begin
    if v_uid is null then
        return json_build_object('ok', false, 'error', 'not_authenticated');
    end if;

    insert into public.solves (user_id, challenge_id, points)
    values (v_uid, p_challenge_id, p_points)
    on conflict (user_id, challenge_id) do nothing;

    get diagnostics v_rowcount = row_count;

    if v_rowcount = 0 then
        select total_score, streak into v_total, v_new_streak
        from public.profiles where id = v_uid;
        return json_build_object('ok', true, 'awarded', false,
            'total_score', v_total, 'streak', v_new_streak);
    end if;

    select
        case
            when last_solve = v_today then streak
            when last_solve = v_today - 1 then streak + 1
            else 1
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
```

### B4. Row Level Security (per-user isolation)

```sql
alter table public.profiles enable row level security;
alter table public.solves   enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "profiles_select_own" on public.profiles for select
    using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
    using (id = auth.uid() or public.is_admin())
    with check (id = auth.uid() or public.is_admin());
create policy "profiles_insert_own" on public.profiles for insert
    with check (id = auth.uid());

create policy "solves_select_own" on public.solves for select
    using (user_id = auth.uid() or public.is_admin());
create policy "solves_insert_own" on public.solves for insert
    with check (user_id = auth.uid());
```

### B5. Global leaderboard RPC

Plain selects can't build a global board because RLS hides other users' rows.
This `SECURITY DEFINER` function returns only non-sensitive aggregates.

```sql
create or replace function public.get_leaderboard(p_limit integer default 10)
returns table (
    username     text,
    total_score  integer,
    streak       integer,
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
```

### B6. Verify

```sql
select count(*) from public.profiles;   -- must return 0, not an error
```

### B7. Turn off email confirmation

Supabase → **Authentication → Providers → Email** → disable *Confirm email*.
Username-only signup needs this off to get a session immediately.

### B8. Make yourself admin

1. Register an account in the app (e.g. `commander`).
2. In SQL Editor:

```sql
update public.profiles set is_admin = true where username = 'commander';
```

Reload the app — the **Admin** button appears in the header.

---

## C. GitHub

- Repo: **https://github.com/Ryhandd/RyzuLab** (public, branch `main`)
- Single clean commit; `.env` is git-ignored and never committed.

```powershell
git add -A
git commit -m "your message"
git push
```

---

## D. Vercel

1. **https://vercel.com/new** → *Import Git Repository* → **Ryhandd/RyzuLab**.
2. Framework: **Vite** (auto-detected). Build `npm run build`, output `dist`.
3. **Environment Variables** — add exactly these two (Production, Preview, Development):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://wleskcynzdtwujrxpwtr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(anon public key from Supabase → Settings → API)* |

4. **Deploy**.

> The build fails with *"Missing Supabase config"* if those env vars are absent —
> that is intentional, so secrets are never baked into source.

### Domain

- **Settings → General → Project Name** → `RyzuLabs`
- Result: **https://RyzuLabs.vercel.app**

---

## E. Verify the live app

1. Open **https://RyzuLabs.vercel.app** → login screen.
2. **Register** username + password → dashboard.
3. Solve Web · Easy · *Login Bypass* → score **100**, appears in Activity Feed.
4. Reload → score persists (stored in Supabase).
5. Leaderboard shows your account.
6. Promote to admin (B8) → **Admin** button → user table with sorting.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Could not load your profile` | schema not applied | run `supabase/schema.sql` |
| Register → "email confirmation is still enabled" | Confirm email ON | turn it off (B7) |
| Admin dashboard error / empty | not admin | run the `is_admin` SQL (B8) |
| Leaderboard empty | no solves, or `get_leaderboard` missing | re-run B5; solve a challenge |
| Build: `Missing Supabase config` | env vars absent | add them in Vercel (section D) |
| "Wrong username or password" on fresh account | account made before Confirm-email was off | delete user in Supabase → Auth → Users, register again |
