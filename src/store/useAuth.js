import { create } from "zustand";
import {
  supabase,
  usernameToEmail,
  validateUsername,
  validatePassword,
} from "../lib/supabase";

const RANK_THRESHOLDS = [
  { score: 0, title: "Script Kiddie" },
  { score: 500, title: "Cyber Ninja" },
  { score: 1500, title: "Elite Hacker" },
  { score: 4000, title: "Grandmaster" },
];

export function getRankForScore(score) {
  let rank = RANK_THRESHOLDS[0].title;
  for (const t of RANK_THRESHOLDS) {
    if (score >= t.score) rank = t.title;
  }
  return rank;
}

export const useAuth = create((set, get) => ({
  session: null,
  profile: null, // { id, username, total_score, streak, is_admin }
  solved: {}, // { challengeId: true }
  activity: [], // [{ challenge_id, points, solved_at }]
  loading: true, // initial session bootstrap
  authError: null,
  authBusy: false,

  get rank() {
    return getRankForScore(get().profile?.total_score ?? 0);
  },

  async bootstrap() {
    set({ loading: true });
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        set({ session: data.session });
        await get().loadProfile();
      }
    } catch (e) {
      console.warn("RyzuLab auth bootstrap failed", e);
    } finally {
      set({ loading: false });
    }

    // Keep session in sync on refresh / sign-out elsewhere
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        set({ session: null, profile: null, solved: {}, activity: [] });
      } else if (event === "SIGNED_IN" && session && !get().profile) {
        set({ session });
        await get().loadProfile();
      }
    });
  },

  async loadProfile() {
    const session = get().session;
    if (!session) return;
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, username, total_score, streak, is_admin, last_solve")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;

      // A failed solves query must not blank the whole profile — the profile
      // itself loaded, so render the app and just start with no solves.
      let rows = [];
      try {
        const { data: solveRows, error: solveErr } = await supabase
          .from("solves")
          .select("challenge_id, points, solved_at")
          .eq("user_id", session.user.id)
          .order("solved_at", { ascending: false });
        if (solveErr) throw solveErr;
        rows = solveRows || [];
      } catch (solveError) {
        console.warn("RyzuLab: failed to load solves", solveError);
      }

      const solved = {};
      for (const r of rows) solved[r.challenge_id] = true;

      set({ profile, solved, activity: rows, authError: null });
    } catch (e) {
      console.warn("RyzuLab: failed to load profile", e);
      set({ authError: "Could not load your profile." });
    }
  },

  async signUp(username, password) {
    const uErr = validateUsername(username);
    if (uErr) return { ok: false, error: uErr };
    const pErr = validatePassword(password);
    if (pErr) return { ok: false, error: pErr };

    set({ authBusy: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: usernameToEmail(username),
        password,
        options: { data: { username: username.trim() } },
      });
      if (error) return { ok: false, error: error.message };

      // Auto-confirm is disabled in this project, so a session may not exist yet.
      if (!data.session) {
        return {
          ok: false,
          error:
            "Account created, but email confirmation is still enabled on the server. Ask the admin to disable 'Confirm email' in Supabase → Authentication → Providers → Email.",
        };
      }

      set({ session: data.session });
      await get().loadProfile();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Sign up failed." };
    } finally {
      set({ authBusy: false });
    }
  },

  async signIn(username, password) {
    const uErr = validateUsername(username);
    if (uErr) return { ok: false, error: uErr };

    set({ authBusy: true, authError: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usernameToEmail(username),
        password,
      });
      if (error) {
        const msg =
          /confirm/i.test(error.message)
            ? "Account not confirmed. Ask the admin to disable 'Confirm email' in Supabase."
            : /invalid/i.test(error.message)
            ? "Wrong username or password."
            : error.message;
        return { ok: false, error: msg };
      }
      set({ session: data.session });
      await get().loadProfile();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Sign in failed." };
    } finally {
      set({ authBusy: false });
    }
  },

  async signOut() {
    await supabase.auth.signOut();
    set({ session: null, profile: null, solved: {}, activity: [] });
  },

  isSolved(challengeId) {
    return !!get().solved[challengeId];
  },

  async solveChallenge(challengeId, points) {
    if (!get().session) return { ok: false, error: "not_authenticated" };
    if (get().solved[challengeId]) return { ok: true, awarded: false };

    try {
      const { data, error } = await supabase.rpc("record_solve", {
        p_challenge_id: challengeId,
        p_points: points,
      });
      if (error) throw error;
      if (!data?.ok) return { ok: false, error: data?.error || "unknown" };

      // Optimistically sync local state from the RPC result
      const profile = get().profile;
      if (profile && data.awarded) {
        set({
          profile: {
            ...profile,
            total_score: data.total_score,
            streak: data.streak,
          },
          solved: { ...get().solved, [challengeId]: true },
          activity: [
            { challenge_id: challengeId, points, solved_at: new Date().toISOString() },
            ...get().activity,
          ],
        });
      }
      return data;
    } catch (e) {
      // If the RPC is unavailable (schema not applied), fall back with a clear error.
      return { ok: false, error: e.message || "Failed to record solve." };
    }
  },

  async fetchLeaderboard(limit = 10) {
    // profiles RLS hides other users' rows, so the board is served by a
    // SECURITY DEFINER RPC that exposes only username/score/streak.
    const { data, error } = await supabase.rpc("get_leaderboard", {
      p_limit: limit,
    });
    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  },
}));
