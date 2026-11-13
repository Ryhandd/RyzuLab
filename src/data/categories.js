export const CATEGORIES = [
  { id: "web", name: "Web Exploitation", short: "Web", icon: "Globe", color: "text-cyber-cyan", border: "border-cyber-cyan" },
  { id: "crypto", name: "Cryptography", short: "Crypto", icon: "LockKeyhole", color: "text-cyber-green", border: "border-cyber-green" },
  { id: "forensics", name: "Forensics", short: "Forensics", icon: "Bug", color: "text-cyber-magenta", border: "border-cyber-magenta" },
  { id: "reverse", name: "Reverse Engineering", short: "Reverse", icon: "Microscope", color: "text-cyber-amber", border: "border-cyber-amber" },
  { id: "pwn", name: "Binary Exploitation / Pwn", short: "Pwn", icon: "Zap", color: "text-cyber-cyan", border: "border-cyber-cyan" },
  { id: "osint", name: "OSINT", short: "OSINT", icon: "Search", color: "text-cyber-green", border: "border-cyber-green" },
  { id: "misc", name: "Miscellaneous", short: "Misc", icon: "Hammer", color: "text-cyber-magenta", border: "border-cyber-magenta" },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const DIFFICULTIES = [
  { id: "Easy", label: "Easy", points: 100, color: "text-cyber-green" },
  { id: "Medium", label: "Medium", points: 300, color: "text-cyber-amber" },
  { id: "Hard", label: "Hard", points: 500, color: "text-cyber-magenta" },
  { id: "Insane", label: "Insane", points: 1000, color: "text-cyber-cyan" },
];

export const DIFFICULTY_POINTS = {
  Easy: 100,
  Medium: 300,
  Hard: 500,
  Insane: 1000,
};

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
