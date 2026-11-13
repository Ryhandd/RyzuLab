import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { Trophy, Crown, RefreshCw } from "lucide-react";

export default function GlobalLeaderboard({ limit = 10 }) {
  const { fetchLeaderboard, profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [err, setErr] = useState(null);

  const load = async () => {
    setState("loading");
    const { data, error } = await fetchLeaderboard(limit);
    if (error) {
      setErr(error);
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

  const medal = (i) =>
    i === 0 ? "text-cyber-amber" : i === 1 ? "text-cyber-dim" : i === 2 ? "text-cyber-magenta" : "text-cyber-dim";

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-cyber-amber" />
          <h3 className="text-sm font-bold text-white font-mono">Global Leaderboard</h3>
        </div>
        <button
          onClick={load}
          className="text-cyber-dim hover:text-cyber-cyan transition"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
        </button>
      </div>

      {state === "error" && (
        <p className="text-xs text-cyber-magenta font-mono">Could not load leaderboard.</p>
      )}

      {state === "ready" && rows.length === 0 && (
        <p className="text-xs text-cyber-dim font-mono">No players yet. Be the first.</p>
      )}

      <div className="space-y-2">
        {rows.map((r, i) => {
          const isMe = r.username === profile?.username;
          return (
            <div
              key={r.username + i}
              className={`flex items-center justify-between px-3 py-2 rounded border transition ${
                isMe
                  ? "border-cyber-cyan/60 bg-cyber-cyan/10"
                  : "border-cyber-border/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-xs font-mono font-bold w-5 ${medal(i)}`}>
                  {i === 0 ? <Crown className="w-3.5 h-3.5" /> : `#${i + 1}`}
                </span>
                <span className={`text-xs font-mono truncate ${isMe ? "text-cyber-cyan" : "text-white"}`}>
                  {r.username}
                  {isMe && <span className="text-cyber-dim"> (you)</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-cyber-amber font-mono">{r.streak}d</span>
                <span className="text-xs font-mono font-bold text-white">
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
