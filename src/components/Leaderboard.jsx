import { useAuth } from "../store/useAuth";
import { Trophy, Flame, ShieldAlert } from "lucide-react";
import { getRankForScore } from "../store/useAuth";

export default function Leaderboard() {
  const { profile } = useAuth();
  const score = profile?.total_score ?? 0;
  const streak = profile?.streak ?? 0;
  const rank = getRankForScore(score);

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-cyber-amber" />
        <h3 className="text-sm font-bold text-white font-mono">Leaderboard</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded bg-cyber-cyan/5 border border-cyber-border/30">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-cyber-dim" />
            <div>
              <p className="text-xs text-white font-mono font-bold">Rank</p>
              <p className="text-xs text-cyber-cyan font-mono">{rank}</p>
            </div>
          </div>
          <p className="text-sm text-white font-mono">{score.toLocaleString()} pts</p>
        </div>
        <div className="flex items-center justify-between p-3 rounded bg-cyber-amber/5 border border-cyber-border/30">
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 text-cyber-dim" />
            <div>
              <p className="text-xs text-white font-mono font-bold">Streak</p>
              <p className="text-xs text-cyber-amber font-mono">{streak} days</p>
            </div>
          </div>
          <p className="text-sm text-white font-mono">Active</p>
        </div>
      </div>
    </div>
  );
}
