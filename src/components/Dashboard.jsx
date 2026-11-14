import { useState, useMemo } from "react";
import { useAuth, getRankForScore } from "../store/useAuth";
import { CATEGORIES, CATEGORY_BY_ID, DIFFICULTY_ACCENT } from "../data/categories";
import { CHALLENGES } from "../data/challenges";
import { SearchX, Sparkles, X } from "lucide-react";
import CategoryCard from "./CategoryCard";
import ChallengeCard from "./ChallengeCard";
import GlobalLeaderboard from "./GlobalLeaderboard";

export default function Dashboard({ onChallengeSelect }) {
  const { solved, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Filtering must not move the page — only opening a challenge does. The
  // challenge list updates in place, and the header tells the user which
  // filter is active.
  const applyFilter = (nextCategory, nextDifficulty) => {
    if (nextCategory !== undefined) setSelectedCategory(nextCategory);
    if (nextDifficulty !== undefined) setSelectedDifficulty(nextDifficulty);
  };

  const totalChallenges = CHALLENGES.length;
  const totalSolved = Object.keys(solved).length;
  const score = profile?.total_score ?? 0;
  const streak = profile?.streak ?? 0;
  const rank = getRankForScore(score);
  const overallPct = Math.round((totalSolved / totalChallenges) * 100);

  const filtered = useMemo(() => {
    return CHALLENGES.filter((c) => {
      const byCat = selectedCategory === "all" || c.category === selectedCategory;
      const byDiff = selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
      return byCat && byDiff;
    });
  }, [selectedCategory, selectedDifficulty]);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-7">
      {/* Hero */}
      <section className="surface p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="label-caps mb-2">Welcome back</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
              @{profile?.username}
            </h2>
            <p className="text-sm text-cyber-dim">
              You're <span className="text-cyber-cyan font-medium">{rank}</span>
              {streak > 0 && <> · on a <span className="text-cyber-amber font-medium">{streak}-day streak</span></>}
            </p>
          </div>

          <div className="flex gap-3">
            <OnboardStat value={score.toLocaleString()} label="Total score" hint="pts" accent="#22d3ee" />
            <OnboardStat value={`${totalSolved}/${totalChallenges}`} label="Solved" hint={`${overallPct}%`} accent="#34d399" />
          </div>
        </div>

        {/* Overall progress */}
        <div className="relative mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="label-caps">Overall progress</span>
            <span className="text-xs text-cyber-dim tabular-nums">{overallPct}%</span>
          </div>
          <div className="progress-track h-2">
            <div className="progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-caps mr-1">Categories</span>
          <FilterChip active={selectedCategory === "all"} onClick={() => applyFilter("all", selectedDifficulty)}>
            All
          </FilterChip>
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              active={selectedCategory === cat.id}
              accent={cat.accent}
              onClick={() => applyFilter(selectedCategory === cat.id ? "all" : cat.id, selectedDifficulty)}
            >
              {cat.short}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label-caps mr-1">Difficulty</span>
          <FilterChip active={selectedDifficulty === "all"} onClick={() => applyFilter(selectedCategory, "all")}>
            All
          </FilterChip>
          {[
            { id: "Easy", accent: "#34d399" },
            { id: "Medium", accent: "#fbbf24" },
            { id: "Hard", accent: "#f472b6" },
            { id: "Insane", accent: "#22d3ee" },
          ].map((d) => (
            <FilterChip
              key={d.id}
              active={selectedDifficulty === d.id}
              accent={d.accent}
              onClick={() => applyFilter(selectedCategory, selectedDifficulty === d.id ? "all" : d.id)}
            >
              {d.id}
            </FilterChip>
          ))}
          <span className="ml-auto text-xs text-cyber-muted tabular-nums">
            {filtered.length} challenge{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Category grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const catChallenges = CHALLENGES.filter((c) => c.category === cat.id);
          const catSolved = catChallenges.filter((c) => solved[c.id]).length;
          const matchesFilter = selectedCategory === "all" || selectedCategory === cat.id;
          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              solved={catSolved}
              total={catChallenges.length}
              matchesFilter={matchesFilter}
              onClick={() => applyFilter(selectedCategory === cat.id ? "all" : cat.id, selectedDifficulty)}
            />
          );
        })}
        {/* filler keeps the last row balanced when 7 cards on a 4-col grid */}
        <div className="hidden xl:block surface p-5 flex flex-col justify-between bg-white/[0.015] border-dashed">
          <div>
            <div className="w-11 h-11 rounded-xl border border-cyber-border flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-cyber-muted" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1 tracking-tight">All categories</h3>
            <p className="text-xs text-cyber-muted mb-5">Clear the filter to see everything</p>
          </div>
          <button
            onClick={() => applyFilter("all", "all")}
            className="btn-secondary w-full py-2 text-xs font-medium"
          >
            Show all
          </button>
        </div>
      </section>

      {/* Challenge grid */}
      <section className="scroll-mt-20">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <h2 className="text-lg font-semibold text-white tracking-tight truncate">
              {selectedCategory === "all"
                ? "All challenges"
                : CATEGORY_BY_ID[selectedCategory]?.name}
            </h2>
            {selectedDifficulty !== "all" && (
              <span
                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-md border"
                style={{ color: DIFFICULTY_ACCENT[selectedDifficulty], borderColor: `${DIFFICULTY_ACCENT[selectedDifficulty]}44`, background: `${DIFFICULTY_ACCENT[selectedDifficulty]}12` }}
              >
                {selectedDifficulty}
              </span>
            )}
            {(selectedCategory !== "all" || selectedDifficulty !== "all") && (
              <button
                onClick={() => applyFilter("all", "all")}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] text-cyber-muted hover:text-white transition"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <span className="text-xs text-cyber-muted">
            {filtered.filter((c) => !solved[c.id]).length} unsolved
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="surface p-12 flex flex-col items-center text-center">
            <SearchX className="w-9 h-9 text-cyber-muted mb-3" />
            <p className="text-cyber-dim text-sm">No challenges match this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => onChallengeSelect(challenge.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Global leaderboard */}
      <section>
        <GlobalLeaderboard />
      </section>
    </div>
  );
}

function OnboardStat({ value, label, hint, accent }) {
  return (
    <div className="surface-flat px-4 py-3 min-w-[104px]">
      <div className="text-xl font-bold text-white tabular-nums leading-none">{value}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: accent }}>
          {label}
        </span>
        <span className="text-[10px] text-cyber-muted">{hint}</span>
      </div>
    </div>
  );
}

function FilterChip({ active, accent, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`chip ${active ? "chip-active" : ""}`}
      style={
        active && accent
          ? { color: accent, borderColor: `${accent}66`, background: `${accent}14` }
          : undefined
      }
    >
      {children}
    </button>
  );
}
