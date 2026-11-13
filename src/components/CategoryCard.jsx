import { ChevronRight } from "lucide-react";

export default function CategoryCard({ category, solved, total, matchesFilter, onClick }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  const { Icon, accent } = category;

  return (
    <button
      onClick={onClick}
      className="category-card surface p-5 text-left group relative overflow-hidden w-full"
      style={{
        borderColor: matchesFilter ? `${accent}44` : undefined,
      }}
    >
      {/* accent glow */}
      <div
        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{ background: accent }}
      />

      <div className="relative flex justify-between items-start mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{ background: `${accent}14`, borderColor: `${accent}33` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <ChevronRight className="w-4 h-4 text-cyber-muted group-hover:text-white group-hover:translate-x-0.5 transition" />
      </div>

      <h3 className="relative text-base font-semibold text-white mb-1 tracking-tight">
        {category.name}
      </h3>
      <p className="relative text-xs text-cyber-muted mb-5">
        {solved} of {total} solved
      </p>

      <div className="relative">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}aa)` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-cyber-muted tracking-wide uppercase">
            {pct === 100 ? "Mastered" : `${pct}% complete`}
          </span>
          {pct === 100 && (
            <span className="text-[10px] font-semibold" style={{ color: accent }}>
              ✓
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
