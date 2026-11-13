import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { CHALLENGES } from "../data/challenges";
import { CATEGORY_BY_ID, DIFFICULTY_ACCENT } from "../data/categories";
import { X, Terminal, BookOpen, CheckCircle, ArrowRight, Lightbulb } from "lucide-react";
import CodeArtifact from "./CodeArtifact";
import FlagForm from "./FlagForm";

export default function ChallengeModal({ challengeId, onClose, onSolved }) {
  const { isSolved } = useAuth();
  const [view, setView] = useState("briefing"); // briefing | playing
  const [hintOpen, setHintOpen] = useState(false);

  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  const solved = isSolved(challengeId);

  if (!challenge) return null;

  const accent = DIFFICULTY_ACCENT[challenge.difficulty] || "#22d3ee";
  const category = CATEGORY_BY_ID[challenge.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-cyber-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{ background: `${accent}14`, borderColor: `${accent}33` }}
            >
              <Terminal className="w-5 h-5" style={{ color: accent }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-md border"
                  style={{ color: accent, borderColor: `${accent}44`, background: `${accent}12` }}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-[11px] text-cyber-muted">{category?.name}</span>
                <span className="text-[11px] text-cyber-muted">·</span>
                <span className="text-[11px] text-cyber-dim font-medium tabular-nums">
                  {challenge.points} pts
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight truncate">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cyber-muted hover:text-white hover:bg-white/5 transition shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Segmented tabs */}
        <div className="px-5 md:px-6 pt-4">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.03] border border-cyber-border">
            {[
              { id: "briefing", label: "Briefing", Icon: BookOpen },
              { id: "playing", label: "Challenge", Icon: Terminal },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                  view === id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-cyber-dim hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 md:p-6 flex-1">
          {view === "briefing" && (
            <div className="space-y-6 animate-fade-in">
              <Section title="Scenario">
                <p className="text-cyber-dim text-sm leading-relaxed">{challenge.backstory}</p>
              </Section>

              <Section title="Objective">
                <div
                  className="text-white text-sm leading-relaxed rounded-xl px-4 py-3 border-l-2"
                  style={{ borderColor: accent, background: `${accent}0d` }}
                >
                  {challenge.objective}
                </div>
              </Section>

              <button
                onClick={() => setView("playing")}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                Enter challenge <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {view === "playing" && (
            <div className="space-y-6 animate-fade-in">
              <Section title="Artifacts">
                {challenge.artifacts.map((a, i) => (
                  <CodeArtifact key={i} artifact={a} />
                ))}
              </Section>

              <div className="surface-flat p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-cyber-amber" />
                    <h3 className="text-sm font-semibold text-white">Hint</h3>
                  </div>
                  <button
                    onClick={() => setHintOpen((o) => !o)}
                    className="text-xs font-medium text-cyber-cyan hover:text-accent-soft transition"
                  >
                    {hintOpen ? "Hide" : "Reveal"}
                  </button>
                </div>
                {hintOpen && (
                  <p className="mt-3 text-cyber-dim text-sm leading-relaxed animate-fade-in">
                    {challenge.hint}
                  </p>
                )}
              </div>

              <FlagForm challenge={challenge} onSolved={onSolved} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-cyber-border px-5 md:px-6 py-3.5 flex justify-between items-center">
          <span className="text-[10px] text-cyber-muted tracking-[0.14em] uppercase">
            RyzuLab Engine v1.0
          </span>
          <div className="flex items-center gap-3">
            {solved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-green">
                <CheckCircle className="w-3.5 h-3.5" /> Solved
              </span>
            )}
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="label-caps mb-2.5">{title}</h3>
      {children}
    </div>
  );
}
