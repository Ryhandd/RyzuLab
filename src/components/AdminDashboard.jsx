import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../store/useAuth";
import {
  Gauge,
  Users,
  Trophy,
  Flame,
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  RefreshCw,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const SORTS = [
  { id: "score-desc", label: "Score ↓", icon: ArrowDownWideNarrow, key: "total_score", dir: false },
  { id: "score-asc", label: "Score ↑", icon: ArrowUpNarrowWide, key: "total_score", dir: true },
  { id: "streak", label: "Streak", icon: Flame, key: "streak", dir: false },
  { id: "newest", label: "Newest", icon: Users, key: "created_at", dir: false },
];

export default function AdminDashboard({ onBack }) {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [state, setState] = useState("loading");
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("score-desc");

  const load = async () => {
    setState("loading");
    setErr(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, total_score, streak, last_solve, created_at, is_admin")
      .order("total_score", { ascending: false });
    if (error) {
      setErr(error.message);
      setState("error");
      return;
    }
    setUsers(data || []);
    setState("ready");
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const cfg = SORTS.find((s) => s.id === sort) || SORTS[0];
    const q = query.trim().toLowerCase();
    let rows = users;
    if (q) rows = rows.filter((u) => u.username.toLowerCase().includes(q));
    rows = [...rows].sort((a, b) => {
      const av = a[cfg.key];
      const bv = b[cfg.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (cfg.dir) return av > bv ? 1 : av < bv ? -1 : 0;
      return av < bv ? 1 : av > bv ? -1 : 0;
    });
    return rows;
  }, [users, query, sort]);

  const totals = useMemo(() => {
    const score = users.reduce((s, u) => s + (u.total_score || 0), 0);
    const active = users.filter((u) => (u.streak || 0) > 0).length;
    return { count: users.length, score, active };
  }, [users]);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-cyber-magenta bg-cyber-magenta/10 flex items-center justify-center text-cyber-magenta">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">Admin Control</h1>
            <p className="text-xs text-cyber-dim font-mono uppercase tracking-wider">
              Monitoring · {profile?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="btn-secondary px-3 py-2 rounded-md text-xs font-mono flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={onBack}
            className="btn-secondary px-3 py-2 rounded-md text-xs font-mono flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Users" value={totals.count} color="cyan" />
        <StatCard icon={Trophy} label="Combined Score" value={totals.score.toLocaleString()} color="amber" />
        <StatCard icon={Flame} label="Active Streaks" value={totals.active} color="green" />
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyber-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username…"
            className="input-terminal w-full pl-10 pr-3 py-2.5 rounded-md text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {SORTS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono border whitespace-nowrap flex items-center gap-1.5 transition ${
                  sort === s.id
                    ? "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan"
                    : "border-cyber-border text-cyber-dim hover:border-cyber-cyan"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {state === "error" ? (
          <div className="p-6 text-sm text-cyber-magenta font-mono">
            Failed to load users: {err}
            <p className="text-cyber-dim mt-2 text-xs">
              Make sure the schema SQL was applied and your account has is_admin = true.
            </p>
          </div>
        ) : state === "loading" ? (
          <div className="p-10 flex items-center justify-center text-cyber-dim font-mono text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading users…
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center text-cyber-dim font-mono text-sm">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cyber-border text-[10px] text-cyber-dim font-mono uppercase tracking-wider">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Streak</th>
                  <th className="px-4 py-3">Last Solve</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u, i) => {
                  const isMe = u.username === profile?.username;
                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-cyber-border/40 text-sm font-mono transition hover:bg-cyber-cyan/5 ${
                        isMe ? "bg-cyber-cyan/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-cyber-dim">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className={isMe ? "text-cyber-cyan font-bold" : "text-white"}>
                          {u.username}
                        </span>
                        {isMe && <span className="text-cyber-dim text-xs"> (you)</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-bold">
                        {(u.total_score ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-cyber-amber">{u.streak ?? 0}d</td>
                      <td className="px-4 py-3 text-cyber-dim text-xs">{fmtDate(u.last_solve)}</td>
                      <td className="px-4 py-3 text-cyber-dim text-xs">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-cyber-magenta border border-cyber-magenta/50 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" /> ADMIN
                          </span>
                        ) : (
                          <span className="text-[10px] text-cyber-dim border border-cyber-border px-2 py-0.5 rounded">
                            USER
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[10px] text-cyber-dim font-mono">
        Showing {visible.length} of {users.length} users · click a column sort above · data live from Supabase.
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    cyan: "text-cyber-cyan border-cyber-cyan/40",
    amber: "text-cyber-amber border-cyber-amber/40",
    green: "text-cyber-green border-cyber-green/40",
  };
  return (
    <div className="glass-panel rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white font-mono mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
