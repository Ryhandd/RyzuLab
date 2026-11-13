import { useAuth } from "../store/useAuth";
import { DIFFICULTY_ACCENT } from "../data/categories";
import { Check, ArrowUpRight } from "lucide-react";

export default function ChallengeCard({ challenge, onClick }) {
  const { isSolved } = useAuth();
  const done = isSolved(challenge.id);
  const accent = DIFFICULTY_ACCENT[challenge.difficulty] || "#22d3ee";

  return (
    <button
      onClick={onClick}
      className="challenge-card surface p-4 text-left group relative overflow-hidden w-full"
      style={{ borderColor: done ? "rgba(52,211,153,0.35)" : undefined }}
    >
      {done && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/[0.06] to-transparent pointer-events-none" />
      )}

      <div className="relative flex justify-between items-start mb-3">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-md border"
          style={{ color: accent, borderColor: `${accent}44`, background: `${accent}12` }}
        >
          {challenge.difficulty}
        </span>
        <span className="text-[11px] text-cyber-muted tabular-nums font-medium">
          {challenge.points} pts
        </span>
      </div>

      <h3 className="relative text-[15px] font-semibold text-white mb-1.5 tracking-tight group-hover:text-cyber-cyan transition-colors">
        {challenge.title}
      </h3>
      <p className="relative text-xs text-cyber-dim leading-relaxed line-clamp-2 mb-4">
        {challenge.backstory.slice(0, 130)}…
      </p>

      <div className="relative flex items-center justify-between">
        {done ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-green">
            <Check className="w-3.5 h-3.5" /> Solved
          </span>
        ) : (
          <span className="text-xs font-medium text-cyber-dim group-hover:text-cyber-cyan transition-colors">
            Start challenge
          </span>
        )}
        <ArrowUpRight className="w-4 h-4 text-cyber-muted group-hover:text-cyber-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
      </div>
    </button>
  );
}
