import {
  Globe,
  LockKeyhole,
  Bug,
  Microscope,
  Zap,
  Search,
  Hammer,
  Sparkles,
} from "lucide-react";

// Each category carries a lucide icon component plus its accent token.
// `accent` is a hex value used for tints so the UI stays consistent.
export const CATEGORIES = [
  { id: "web", name: "Web Exploitation", short: "Web", Icon: Globe, accent: "#22d3ee" },
  { id: "crypto", name: "Cryptography", short: "Crypto", Icon: LockKeyhole, accent: "#5eead4" },
  { id: "forensics", name: "Forensics", short: "Forensics", Icon: Bug, accent: "#818cf8" },
  { id: "reverse", name: "Reverse Engineering", short: "Reverse", Icon: Microscope, accent: "#fbbf24" },
  { id: "pwn", name: "Binary Exploitation / Pwn", short: "Pwn", Icon: Zap, accent: "#f472b6" },
  { id: "osint", name: "OSINT", short: "OSINT", Icon: Search, accent: "#34d399" },
  { id: "misc", name: "Miscellaneous", short: "Misc", Icon: Hammer, accent: "#a78bfa" },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const DIFFICULTIES = [
  { id: "Easy", label: "Easy", points: 100, accent: "#34d399" },
  { id: "Medium", label: "Medium", points: 300, accent: "#fbbf24" },
  { id: "Hard", label: "Hard", points: 500, accent: "#f472b6" },
  { id: "Insane", label: "Insane", points: 1000, accent: "#22d3ee" },
];

export const DIFFICULTY_POINTS = {
  Easy: 100,
  Medium: 300,
  Hard: 500,
  Insane: 1000,
};

export const DIFFICULTY_ACCENT = Object.fromEntries(
  DIFFICULTIES.map((d) => [d.id, d.accent])
);

export const RANK_THRESHOLDS = [
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

export const MISC_ICON = Sparkles;
