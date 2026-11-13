# RyzuLab — setup & deploy checklist

One-time steps to take the code from `D:\Rayhand\Cyber` to a live
**https://RyzuLabs.vercel.app**.

---

## A. Apply the database schema (REQUIRED — do this first)

The app will show *"Could not load your profile"* / a red error on the admin
dashboard until the tables exist.

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql`.
3. Paste and click **Run**. You should see *Success. No rows returned*.
4. Sanity check — run this and confirm you get **no rows** (not an error):

   ```sql
   select count(*) from public.profiles;
   ```

### Turn off email confirmation

Supabase Dashboard → **Authentication → Providers → Email** → disable
*Confirm email*. (Our username-only signup returns a session immediately, which
only works while this is off.)

### Make yourself admin

1. Open the deployed app and **register** a normal account (e.g. `commander`).
2. Back in SQL Editor:

   ```sql
   update public.profiles set is_admin = true where username = 'commander';
   ```

3. Reload the app — the **Admin** button appears in the header.

---

## B. GitHub (DONE)

- Repo: **https://github.com/Ryhandd/RyzuLab** (public, branch `main`)
- Initial commit pushed: *"feat: RyzuLab CTF platform with Supabase auth,
  per-user progress, leaderboard and admin dashboard"*

To push future changes:

```powershell
git add -A
git commit -m "your message"
git push
```

---

## C. Vercel

1. Go to **https://vercel.com/new** → *Import Git Repository*.
2. Choose **Ryhandd/RyzuLab** (authorize GitHub if prompted).
3. Vercel auto-detects **Vite**; leave the defaults
   (build `npm run build`, output `dist` — also pinned in `vercel.json`).
4. *(Optional)* **Environment Variables** — add both so the project isn't tied
   to the baked-in fallback values:
   - `VITE_SUPABASE_URL` = `https://wleskcynzdtwujrxpwtr.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(the anon key from `.env.example`)*
5. Click **Deploy**.

### Set the domain to RyzuLabs.vercel.app

- Vercel → your project → **Settings → General → Project Name** → set to
  `RyzuLabs` (the subdomain becomes `<name>.vercel.app`).
- Or **Settings → Domains** → the default `*.vercel.app` domain, rename/adjust.

---

## D. Verify the live app

1. Open **https://RyzuLabs.vercel.app** → login screen appears.
2. **Register** a username + password → you land on the dashboard.
3. Solve an easy challenge (e.g. Web · Easy · *Login Bypass*) → score ticks
   to **100** and the solve appears in the Activity Feed.
4. Reload → score persists (it's in Supabase now, not localStorage).
5. Open **Leaderboard** → your account shows with its score.
6. Promote yourself to admin (step A) → **Admin** button → user table with
   sorting.

If registration says *"email confirmation is still enabled"*, redo the
**Confirm email** toggle in section A.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Could not load your profile` | schema not applied | run `supabase/schema.sql` |
| Register → "…email confirmation is still enabled" | Confirm email ON | turn it off (section A) |
| Admin dashboard shows an error / empty | you're not admin | run the `update profiles set is_admin` SQL |
| Leaderboard empty | no solves yet, or `get_leaderboard` RPC missing | re-run schema; solve a challenge |
| "Wrong username or password" on a fresh account | account created before Confirm-email was off | delete the user in Supabase → Auth → Users, register again |
