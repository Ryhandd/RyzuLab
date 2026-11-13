import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase config. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example), and set the same variables in Vercel."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Supabase Auth needs an email, but RyzuLab logins are username + password.
// We map username -> deterministic pseudo-email, never shown to the user.
const EMAIL_DOMAIN = "ryzulab.local";

export function usernameToEmail(username) {
  const clean = username.trim().toLowerCase();
  // Keep it valid as an email local-part; slashes/at-signs are disallowed.
  const safe = clean.replace(/[^a-z0-9._-]/g, "");
  return `${safe}@${EMAIL_DOMAIN}`;
}

export const USERNAME_RULE =
  "3-24 characters. Letters, numbers, dot, underscore, hyphen only.";
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,24}$/;

export function validateUsername(username) {
  if (!USERNAME_REGEX.test(username)) return USERNAME_RULE;
  return null;
}

export function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}
