import { ExternalLink, Download, FlaskConical, MonitorPlay, FileDown } from "lucide-react";
import { getLab } from "../data/labs";

/**
 * Renders the runnable part of a challenge: a real openable lab page and/or
 * real downloadable evidence files. Challenges without assets show nothing.
 */
export default function LabPanel({ challenge }) {
  const lab = getLab(challenge.id);
  if (!lab || lab.kind === "inline") return null;

  const hasWeb = lab.kind === "web" && lab.url;
  const files = lab.files || [];

  return (
    <div className="surface-flat p-4 border border-accent/25">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent/12 border border-accent/30">
          <FlaskConical className="w-3.5 h-3.5 text-cyber-cyan" />
        </div>
        <h3 className="text-sm font-semibold text-white">Interactive lab</h3>
        <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-cyber-muted">
          live environment
        </span>
      </div>

      {lab.intro && (
        <p className="text-xs text-cyber-dim leading-relaxed mb-3.5">{lab.intro}</p>
      )}

      {hasWeb && (
        <a
          href={lab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full py-2.5 text-sm inline-flex items-center justify-center gap-2 mb-3"
        >
          <MonitorPlay className="w-4 h-4" />
          {lab.label || "Open lab"}
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <a
              key={f.href}
              href={f.href}
              download
              className="flex items-center justify-between gap-3 rounded-xl border border-cyber-border bg-white/[0.03] hover:border-accent/40 hover:bg-white/[0.05] transition px-3.5 py-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileDown className="w-4 h-4 shrink-0 text-cyber-cyan" />
                <div className="min-w-0">
                  <p className="text-xs font-mono text-white truncate">{f.name}</p>
                  {f.desc && (
                    <p className="text-[11px] text-cyber-muted leading-snug">{f.desc}</p>
                  )}
                </div>
              </div>
              <Download className="w-4 h-4 shrink-0 text-cyber-muted group-hover:text-cyber-cyan transition" />
            </a>
          ))}
        </div>
      )}

      {lab.steps?.length > 0 && (
        <div className="mt-3.5 pt-3.5 border-t border-cyber-border">
          <p className="label-caps mb-2">Suggested approach</p>
          <ol className="space-y-1.5">
            {lab.steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[11px] text-cyber-dim leading-relaxed">
                <span className="text-cyber-muted tabular-nums shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
