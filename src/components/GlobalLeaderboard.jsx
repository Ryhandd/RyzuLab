import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { Trophy, Crown, RefreshCw, Medal } from "lucide-react";

const MEDAL_ACCENT = ["#fbbf24", "#cbd5e1", "#f0a97c"];

export default function GlobalLeaderboard({ limit = 10 }) {
  const { fetchLeaderboard, profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("loading");

  const load = async () => {
    setState("loading");
    const { data, error } = await fetchLeaderboard(limit);
    if (error) {
      setState("error");
      return;
    }
    setRows(data);
    setState("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.total_score]);

  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-cyber-amber" />
          <h3 className="text-sm font-semibold text-white">Global leaderboard</h3>
        </div>
        <button
          onClick={load}
          className="p-1.5 rounded-lg text-cyber-muted hover:text-cyber-cyan hover:bg-white/5 transition"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
        </button>
      </div>

      {state === "error" && (
        <p className="text-xs text-cyber-magenta">Could not load leaderboard.</p>
      )}
      {state === "ready" && rows.length === 0 && (
        <p className="text-xs text-cyber-muted">No players yet — be the first.</p>
      )}
      {state === "loading" && rows.length === 0 && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-white/[0.025] animate-pulse" />
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const isMe = r.username === profile?.username;
          const medal = MEDAL_ACCENT[i];
          return (
            <div
              key={r.username + i}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                isMe ? "bg-accent/10 ring-1 ring-accent/30" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 flex justify-center shrink-0">
                  {i < 3 ? (
                    <Medal className="w-4 h-4" style={{ color: medal }} />
                  ) : (
                    <span className="text-xs text-cyber-muted tabular-nums">{i + 1}</span>
                  )}
                </span>
                <span
                  className={`text-xs truncate ${isMe ? "text-cyber-cyan font-semibold" : "text-white"}`}
                >
                  {r.username}
                  {isMe && <span className="text-cyber-muted font-normal"> (you)</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.streak > 0 && (
                  <span className="text-[10px] text-cyber-amber tabular-nums">{r.streak}d</span>
                )}
                <span className="text-xs font-semibold text-white tabular-nums">
                  {(r.total_score ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
