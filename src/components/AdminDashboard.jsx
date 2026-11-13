import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../store/useAuth";
import {
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
  UserRound,
  AlertCircle,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const cfg = SORTS.find((s) => s.id === sort) || SORTS[0];
    const q = query.trim().toLowerCase();
    let rows = users;
    if (q) rows = rows.filter((u) => u.username.toLowerCase().includes(q));
    return [...rows].sort((a, b) => {
      const av = a[cfg.key];
      const bv = b[cfg.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (cfg.dir) return av > bv ? 1 : av < bv ? -1 : 0;
      return av < bv ? 1 : av > bv ? -1 : 0;
    });
  }, [users, query, sort]);

  const totals = useMemo(() => {
    const score = users.reduce((s, u) => s + (u.total_score || 0), 0);
    const active = users.filter((u) => (u.streak || 0) > 0).length;
    return { count: users.length, score, active };
  }, [users]);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent-deep/15 border border-accent-deep/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent-deep" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Admin dashboard</h1>
            <p className="text-xs text-cyber-dim">Monitoring all players · signed in as @{profile?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-secondary px-3.5 py-2 text-xs font-medium flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${state === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={onBack} className="btn-secondary px-3.5 py-2 text-xs font-medium flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total users" value={totals.count} accent="#22d3ee" />
        <StatCard icon={Trophy} label="Combined score" value={totals.score.toLocaleString()} accent="#fbbf24" />
        <StatCard icon={Flame} label="Active streaks" value={totals.active} accent="#34d399" />
      </div>

      {/* Controls */}
      <div className="surface-flat p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username…"
            className="input-terminal w-full pl-10 pr-3 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {SORTS.map((s) => {
            const Icon = s.icon;
            const active = sort === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`chip ${active ? "chip-active" : ""} whitespace-nowrap`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="surface overflow-hidden">
        {state === "error" ? (
          <div className="p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyber-magenta shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-cyber-magenta font-medium">Failed to load users: {err}</p>
              <p className="text-xs text-cyber-dim mt-1.5 leading-relaxed">
                Make sure the schema SQL was applied and your account has <code className="text-cyber-cyan">is_admin = true</code>.
              </p>
            </div>
          </div>
        ) : state === "loading" && users.length === 0 ? (
          <div className="p-10 flex items-center justify-center text-cyber-dim text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading users…
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 flex flex-col items-center gap-2 text-cyber-muted text-sm">
            <UserRound className="w-7 h-7" />
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyber-border">
                  {["#", "Username", "Score", "Streak", "Last solve", "Joined", "Role"].map((h, i) => (
                    <th
                      key={h}
                      className={`label-caps px-4 py-3 ${i === 2 || i === 3 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((u, i) => {
                  const isMe = u.username === profile?.username;
                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-cyber-border/60 transition hover:bg-white/[0.03] ${
                        isMe ? "bg-accent/[0.06]" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-cyber-muted tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-soft to-accent-deep flex items-center justify-center text-[11px] font-bold text-ink-950 shrink-0">
                            {u.username?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className={`text-sm ${isMe ? "text-cyber-cyan font-semibold" : "text-white"}`}>
                            {u.username}
                            {isMe && <span className="text-cyber-muted font-normal"> (you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-white tabular-nums">
                        {(u.total_score ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-cyber-amber tabular-nums">
                        {u.streak ?? 0}d
                      </td>
                      <td className="px-4 py-3 text-xs text-cyber-dim">{fmtDate(u.last_solve)}</td>
                      <td className="px-4 py-3 text-xs text-cyber-dim">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        {u.is_admin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-deep bg-accent-deep/12 border border-accent-deep/30 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="text-[10px] text-cyber-muted border border-cyber-border px-2 py-0.5 rounded-md uppercase tracking-wide">
                            User
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

      <p className="text-[11px] text-cyber-muted">
        Showing {visible.length} of {users.length} users · live from Supabase
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="surface p-5 flex items-center justify-between">
      <div>
        <p className="label-caps">{label}</p>
        <p className="text-2xl font-bold text-white tabular-nums mt-1.5">{value}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border"
        style={{ background: `${accent}14`, borderColor: `${accent}33` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
    </div>
  );
}
