import { useAuth } from "../store/useAuth";
import { Activity, Clock } from "lucide-react";
import { CHALLENGES } from "../data/challenges";

const TITLE_BY_ID = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.title]));

export default function ActivityFeed() {
  const { activity } = useAuth();

  if (activity.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-5">
        <div className="flex flex-col items-center justify-center py-8">
          <Clock className="w-10 h-10 text-cyber-dim mb-3 opacity-50" />
          <p className="text-cyber-dim text-sm font-mono">No activity yet. Solve your first challenge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-cyber-cyan" />
        <h3 className="text-sm font-bold text-white font-mono">Activity Feed</h3>
      </div>
      <div className="space-y-3">
        {activity.slice(0, 10).map((entry, i) => {
          const date = new Date(entry.solved_at || entry.timestamp);
          const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-cyber-cyan" />
              <div className="flex-1">
                <p className="text-xs text-cyber-dim font-mono truncate">
                  <span className="text-white">{TITLE_BY_ID[entry.challenge_id] || "Challenge"}</span>{" "}
                  · <span className="text-cyber-cyan">+{entry.points} pts</span>
                </p>
                <p className="text-[10px] text-cyber-dim font-mono">{time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
