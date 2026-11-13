import { useState, useMemo } from "react";
import { useAuth } from "../store/useAuth";
import { CATEGORIES, DIFFICULTIES, CATEGORY_BY_ID } from "../data/categories";
import { CHALLENGES } from "../data/challenges";
import { SlidersHorizontal, BookOpen, Trophy } from "lucide-react";
import CategoryCard from "./CategoryCard";
import ChallengeCard from "./ChallengeCard";
import GlobalLeaderboard from "./GlobalLeaderboard";

const DIFF_ACTIVE = {
  Easy: "bg-cyber-green/20 border-cyber-green text-cyber-green",
  Medium: "bg-cyber-amber/20 border-cyber-amber text-cyber-amber",
  Hard: "bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta",
  Insane: "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan",
};

export default function Dashboard({ onChallengeSelect }) {
  const { solved, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const totalChallenges = CHALLENGES.length;
  const totalSolved = Object.keys(solved).length;

  const filtered = useMemo(() => {
    return CHALLENGES.filter((c) => {
      const byCat = selectedCategory === "all" || c.category === selectedCategory;
      const byDiff = selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
      return byCat && byDiff;
    });
  }, [selectedCategory, selectedDifficulty]);

  const solvedIds = Object.keys(solved);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">TOTAL SCORE</p>
            <p className="text-3xl font-bold text-white font-mono">{(profile?.total_score ?? 0).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 text-cyber-cyan font-mono">
            <span>{profile?.total_score ?? 0}</span> <span className="text-cyber-dim text-xs">pts</span>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">SOLVED CHALLENGES</p>
            <p className="text-3xl font-bold text-white font-mono">{totalSolved}</p>
          </div>
          <div className="w-full md:w-auto h-2 bg-cyber-border rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-green shadow-cyber-green"
              style={{ width: `${Math.round((totalSolved / totalChallenges) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-cyber-dim font-mono">
            {totalSolved}/{totalChallenges}
          </span>
        </div>
        <div className="glass-panel rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">DAILY STREAK</p>
            <p className="text-3xl font-bold text-white font-mono">{profile?.streak ?? 0}</p>
          </div>
          <div className="flex items-center gap-1 text-cyber-amber font-mono">
            <span>{profile?.streak ?? 0}</span> <span className="text-cyber-dim text-xs">days</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyber-dim" />
          <span className="text-xs text-cyber-dim font-mono uppercase">FILTER</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
              selectedCategory === "all"
                ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                : "border-cyber-border text-cyber-dim hover:border-cyber-cyan"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
                selectedCategory === cat.id
                  ? "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan"
                  : "border-cyber-border text-cyber-dim hover:border-cyber-cyan"
              }`}
            >
              {cat.short}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 ml-auto">
          <button
            onClick={() => setSelectedDifficulty("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
              selectedDifficulty === "all"
                ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                : "border-cyber-border text-cyber-dim hover:border-cyber-cyan"
            }`}
          >
            All Difficulty
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDifficulty(d.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
                selectedDifficulty === d.id
                  ? DIFF_ACTIVE[d.id]
                  : "border-cyber-border text-cyber-dim hover:border-cyber-cyan"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-cyber-dim font-mono ml-auto">
          {filtered.length} challenge{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {CATEGORIES.map((cat) => {
          const catChallenges = CHALLENGES.filter((c) => c.category === cat.id);
          const catSolved = catChallenges.filter((c) => solved[c.id]).length;
          const matchesFilter =
            selectedCategory === "all" || selectedCategory === cat.id;
          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              solved={catSolved}
              total={catChallenges.length}
              matchesFilter={matchesFilter}
              onClick={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </div>

      {/* Challenge grid */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyber-cyan" />
            <h2 className="text-lg font-bold text-white font-mono">
              {selectedCategory === "all"
                ? "All Challenges"
                : CATEGORY_BY_ID[selectedCategory]?.name}
            </h2>
          </div>
          <span className="text-xs text-cyber-dim font-mono">
            {filtered.filter((c) => !solved[c.id]).length} unsolved
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl">
            <BookOpen className="w-12 h-12 mx-auto text-cyber-dim mb-3 opacity-50" />
            <p className="text-cyber-dim text-sm font-mono">
              No challenges match this filter.
            </p>
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
      </div>

      {/* Global leaderboard */}
      <GlobalLeaderboard />
    </div>
  );
}
