import { ChevronRight } from "lucide-react";

export default function CategoryCard({ category, solved, total, matchesFilter, onClick }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  const borderClass = matchesFilter ? category.border : "border-cyber-border";

  return (
    <div
      className={`category-card glass-panel rounded-xl p-5 cursor-pointer group ${borderClass}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`flex w-8 h-8 items-center justify-center rounded-lg ${category.color.replace("text-", "bg-")}/10 border ${category.color.replace("text-", "border-")}`}>
          <span className="text-xs">{category.icon}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-cyber-dim group-hover:text-cyber-cyan transition" />
      </div>
      <h3 className="text-lg font-bold text-white font-mono mb-1">{category.name}</h3>
      <p className="text-xs text-cyber-dim font-mono mb-4">{category.short} challenges</p>

      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white">{solved}</span>
        <span className="text-cyber-dim">{total}</span>
      </div>
      <div className="progress-track mt-2">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-cyber-dim mt-1 text-right">
        {pct}% complete
      </p>
    </div>
  );
}
