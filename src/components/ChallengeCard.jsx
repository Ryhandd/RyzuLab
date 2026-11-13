import { useAuth } from "../store/useAuth";
import { DIFFICULTY_POINTS } from "../data/categories";
import { Lock, Play, CheckCircle } from "lucide-react";

const DIFF_STYLE = {
  Easy: "border-cyber-green text-cyber-green",
  Medium: "border-cyber-amber text-cyber-amber",
  Hard: "border-cyber-magenta text-cyber-magenta",
  Insane: "border-cyber-cyan text-cyber-cyan",
};

export default function ChallengeCard({ challenge, onClick }) {
  const { isSolved } = useAuth();
  const done = isSolved(challenge.id);
  const style = DIFF_STYLE[challenge.difficulty] || DIFF_STYLE.Easy;

  return (
    <div
      className={`challenge-card glass-panel rounded-xl p-4 cursor-pointer group relative overflow-hidden ${done ? "border-cyber-green bg-cyber-green/5" : "border-cyber-border"}`}
      onClick={onClick}
    >
      {done && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyber-green flex items-center justify-center text-[10px] font-bold text-cyber-black shadow-cyber-green">
          <CheckCircle className="w-3 h-3" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${style}`}>
          {challenge.difficulty}
        </span>
        <span className="text-xs text-cyber-dim font-mono">
          {DIFFICULTY_POINTS[challenge.difficulty]} pts
        </span>
      </div>
      <h3 className="text-base font-bold text-white font-mono mb-1 group-hover:text-cyber-cyan transition">
        {challenge.title}
      </h3>
      <p className="text-xs text-cyber-dim line-clamp-2 mb-3">{challenge.backstory.slice(0, 140)}...</p>
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-cyber-cyan" />
        <span className="text-xs text-white font-mono">Start Challenge</span>
      </div>
    </div>
  );
}
