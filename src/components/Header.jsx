import { useState } from "react";
import { useAuth, getRankForScore } from "../store/useAuth";
import { Zap, User, Flame, ShieldAlert, LogOut, Gauge } from "lucide-react";

const RANK_COLORS = {
  "Script Kiddie": "text-cyber-dim border-cyber-border",
  "Cyber Ninja": "text-cyber-green border-cyber-green",
  "Elite Hacker": "text-cyber-cyan border-cyber-cyan",
  Grandmaster: "text-cyber-magenta border-cyber-magenta",
};

export default function Header({ onOpenAdmin, adminView }) {
  const { profile, signOut } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const score = profile?.total_score ?? 0;
  const streak = profile?.streak ?? 0;
  const rank = getRankForScore(score);
  const rankColor = RANK_COLORS[rank] || RANK_COLORS["Script Kiddie"];

  return (
    <header className="sticky top-0 z-40 border-b border-cyber-border bg-cyber-panel/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowAbout(!showAbout)}>
          <div className="w-8 h-8 rounded border border-cyber-cyan flex items-center justify-center bg-cyber-cyan/10 shadow-cyber-cyan">
            <Zap className="w-5 h-5 text-cyber-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono neonshift">
              RYZULAB<span className="text-cyber-cyan">.ENGINE</span>
            </h1>
            <p className="text-xs text-cyber-dim font-mono uppercase tracking-widest">
              CTF Training Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm font-mono font-bold text-white">
                {score.toLocaleString()}
              </span>
              <span className="text-[10px] text-cyber-dim font-mono uppercase">TOTAL SCORE</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyber-amber" />
              <span className="text-sm font-mono font-bold text-white">{streak}</span>
              <span className="text-[10px] text-cyber-dim font-mono uppercase">DAY STREAK</span>
            </div>
          </div>

          <div className={`rank-badge ${rankColor}`}>
            <User className="w-3 h-3" />
            {rank}
          </div>

          {profile?.is_admin && (
            <button
              onClick={onOpenAdmin}
              title="Admin dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition ${
                adminView
                  ? "bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta"
                  : "border-cyber-border text-cyber-dim hover:border-cyber-magenta hover:text-cyber-magenta"
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyber-dim">
            <span className="text-cyber-cyan">@{profile?.username}</span>
          </div>

          <button
            onClick={signOut}
            title="Sign out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-cyber-border text-cyber-dim hover:border-cyber-magenta hover:text-cyber-magenta transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      {showAbout && (
        <div className="px-6 pb-3 border-t border-cyber-border text-cyber-dim text-sm font-mono">
          Score: Easy 100 · Medium 300 · Hard 500 · Insane 1000. Progress saved to your account.
        </div>
      )}
    </header>
  );
}
