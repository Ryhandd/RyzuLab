import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { CHALLENGES } from "../data/challenges";
import { X, RefreshCw, Terminal, Play, BookOpen, CheckCircle } from "lucide-react";
import CodeArtifact from "./CodeArtifact";
import FlagForm from "./FlagForm";

export default function ChallengeModal({ challengeId, onClose, onSolved }) {
  const { isSolved } = useAuth();
  const [view, setView] = useState("briefing"); // briefing | playing
  const [hintOpen, setHintOpen] = useState(false);

  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  const solved = isSolved(challengeId);

  if (!challenge) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-xl border border-cyber-border w-full max-w-3xl md:max-w-5xl max-h-[90vh] flex flex-col shadow-cyber-cyan-strong"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-cyber-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan shadow-cyber-cyan">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan">
                  {challenge.difficulty}
                </span>
                <span className="text-[10px] text-cyber-dim border border-cyber-border/50 px-2 py-0.5 rounded">
                  {challenge.points} pts
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-mono mt-1">{challenge.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-cyber-dim hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cyber-border p-1">
          <button
            onClick={() => setView("briefing")}
            className={`flex-1 py-2 text-xs font-mono border-b-2 transition ${
              view === "briefing"
                ? "border-cyber-cyan text-white bg-cyber-cyan/5"
                : "border-transparent text-cyber-dim hover:text-white"
            }`}
          >
            <Play className="w-3 h-3 mr-1" /> Briefing
          </button>
          <button
            onClick={() => setView("playing")}
            className={`flex-1 py-2 text-xs font-mono border-b-2 transition ${
              view === "playing"
                ? "border-cyber-green text-white bg-cyber-green/5"
                : "border-transparent text-cyber-dim hover:text-white"
            }`}
          >
            <BookOpen className="w-3 h-3 mr-1" /> Challenge
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex-1">
          {view === "briefing" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-cyber-dim uppercase tracking-wider mb-2">
                  Scenario
                </h3>
                <p className="text-cyber-dim text-sm leading-relaxed font-mono">
                  {challenge.backstory}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyber-dim uppercase tracking-wider mb-2">
                  Objective
                </h3>
                <p className="text-white text-sm leading-relaxed font-mono border-l-2 border-cyber-cyan pl-3 py-2 bg-cyber-cyan/5">
                  {challenge.objective}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setView("playing")}
                  className="btn-secondary px-4 py-2 rounded-md text-xs font-mono hover:text-cyber-cyan hover:border-cyber-cyan"
                >
                  <RefreshCw className="w-3 h-3 mr-2" /> Enter Challenge
                </button>
              </div>
            </div>
          )}

          {view === "playing" && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <h3 className="text-sm font-bold text-cyber-dim uppercase tracking-wider mb-2">
                  Artifacts
                </h3>
                {challenge.artifacts.map((a, i) => (
                  <CodeArtifact key={i} artifact={a} />
                ))}
              </div>

              <div className="border border-cyber-border/50 rounded-lg p-4 bg-black/30">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-cyber-dim uppercase tracking-wider">
                    Hint
                  </h3>
                  <button
                    onClick={() => setHintOpen((o) => !o)}
                    className="text-xs font-mono text-cyber-cyan hover:text-cyber-green transition"
                  >
                    {hintOpen ? "Hide Hint" : "Show Hint"}
                  </button>
                </div>
                {hintOpen && (
                  <p className="text-cyber-dim text-sm leading-relaxed font-mono bg-black/40 rounded p-3 border border-cyber-border/30">
                    {challenge.hint}
                  </p>
                )}
              </div>

              <FlagForm challenge={challenge} onSolved={onSolved} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-cyber-border p-4 flex justify-between items-center">
          <div className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">
            RyzuLab Engine v1.0
          </div>
          <div className="flex items-center gap-3">
            {solved && (
              <span className="flex items-center gap-2 text-cyber-green text-xs font-mono font-bold">
                <CheckCircle className="w-3 h-3" /> SOLVED
              </span>
            )}
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-md text-xs font-mono hover:text-cyber-cyan hover:border-cyber-cyan"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
