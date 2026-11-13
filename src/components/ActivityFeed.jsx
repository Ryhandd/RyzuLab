import { useAuth } from "../store/useAuth";
import { Activity, Clock } from "lucide-react";
import { CHALLENGES } from "../data/challenges";

const TITLE_BY_ID = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.title]));

export default function ActivityFeed() {
  const { activity } = useAuth();

  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-cyber-cyan" />
        <h3 className="text-sm font-semibold text-white">Activity</h3>
      </div>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Clock className="w-8 h-8 text-cyber-muted mb-2.5" />
          <p className="text-xs text-cyber-muted leading-relaxed">
            No solves yet.
            <br />
            Pick a challenge to begin.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {activity.slice(0, 8).map((entry, i) => {
            const date = new Date(entry.solved_at || entry.timestamp);
            const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <div
                key={i}
                className="flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{TITLE_BY_ID[entry.challenge_id] || "Challenge"}</p>
                  <p className="text-[10px] text-cyber-muted mt-0.5">
                    <span className="text-cyber-green">+{entry.points} pts</span> · {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
