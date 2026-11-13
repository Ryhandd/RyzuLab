import { useAuth, getRankForScore } from "../store/useAuth";
import LogoMark from "./LogoMark";
import { Flame, LogOut, Gauge } from "lucide-react";

const RANK_ACCENT = {
  "Script Kiddie": "#94a3b8",
  "Cyber Ninja": "#34d399",
  "Elite Hacker": "#22d3ee",
  Grandmaster: "#818cf8",
};

export default function Header({ onOpenAdmin, adminView }) {
  const { profile, signOut } = useAuth();
  const score = profile?.total_score ?? 0;
  const streak = profile?.streak ?? 0;
  const rank = getRankForScore(score);
  const rankAccent = RANK_ACCENT[rank] || RANK_ACCENT["Script Kiddie"];

  return (
    <header className="sticky top-0 z-40 border-b border-cyber-border bg-[rgba(11,17,32,0.82)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 md:px-8 h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <LogoMark className="w-9 h-9" />
          <div className="leading-tight">
            <h1 className="text-[15px] font-bold text-white tracking-tight">
              RyzuLab
              <span className="text-cyber-cyan">.</span>
            </h1>
            <p className="text-[10px] text-cyber-muted tracking-[0.18em] uppercase">
              CTF Training
            </p>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 md:gap-3">
          <StatPill icon={Gauge} label="Score" value={score.toLocaleString()} accent="#22d3ee" />
          <StatPill icon={Flame} label="Streak" value={`${streak}d`} accent="#fbbf24" />

          <span
            className="rank-badge hidden sm:inline-flex"
            style={{ color: rankAccent, borderColor: `${rankAccent}55`, background: `${rankAccent}12` }}
          >
            {rank}
          </span>

          <div className="hidden lg:flex items-center gap-2 pl-3 ml-1 border-l border-cyber-border">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-soft to-accent-deep flex items-center justify-center text-[11px] font-bold text-ink-950">
              {profile?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-sm text-cyber-dim">@{profile?.username}</span>
          </div>

          {profile?.is_admin && (
            <button
              onClick={onOpenAdmin}
              title="Admin dashboard"
              className={`p-2 rounded-lg transition ${
                adminView
                  ? "bg-accent/15 text-cyber-cyan"
                  : "text-cyber-muted hover:text-cyber-cyan hover:bg-white/5"
              }`}
            >
              <Gauge className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={signOut}
            title="Sign out"
            className="p-2 rounded-lg text-cyber-muted hover:text-cyber-magenta hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function StatPill({ icon: Icon, label, value, accent }) {
  return (
    <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-cyber-border bg-white/[0.02]">
      <Icon className="w-4 h-4" style={{ color: accent }} />
      <div className="leading-none">
        <div className="text-[9px] uppercase tracking-[0.14em] text-cyber-muted">{label}</div>
        <div className="text-sm font-semibold text-white mt-0.5 tabular-nums">{value}</div>
      </div>
    </div>
  );
}
