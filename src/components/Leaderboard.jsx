import { useAuth, getRankForScore } from "../store/useAuth";
import { Flame, ShieldCheck } from "lucide-react";

export default function Leaderboard() {
  const { profile } = useAuth();
  const score = profile?.total_score ?? 0;
  const streak = profile?.streak ?? 0;
  const rank = getRankForScore(score);

  return (
    <div className="surface p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Your stats</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-cyber-border px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-cyber-muted">Rank</p>
              <p className="text-sm font-semibold text-white">{rank}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-white tabular-nums">{score.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-cyber-border px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-cyber-amber" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-cyber-muted">Streak</p>
              <p className="text-sm font-semibold text-white">{streak} day{streak === 1 ? "" : "s"}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-cyber-green">{streak > 0 ? "Active" : "Start"}</p>
        </div>
      </div>

      {/* Scoring reference */}
      <div className="mt-5 pt-4 border-t border-cyber-border">
        <p className="label-caps mb-3">Scoring</p>
        <div className="space-y-1.5">
          {[
            { d: "Easy", p: 100, c: "#34d399" },
            { d: "Medium", p: 300, c: "#fbbf24" },
            { d: "Hard", p: 500, c: "#f472b6" },
            { d: "Insane", p: 1000, c: "#22d3ee" },
          ].map((s) => (
            <div key={s.d} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-2 text-cyber-dim">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.c }} />
                {s.d}
              </span>
              <span className="text-cyber-muted tabular-nums">{s.p} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
