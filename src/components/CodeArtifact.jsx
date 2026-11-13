import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "./useToast";

export default function CodeArtifact({ artifact }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content).then(() => {
      setCopied(true);
      toast("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="mb-3 last:mb-0">
      {artifact.label && (
        <div className="mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.12em] text-cyber-muted">
            {artifact.label}
          </span>
        </div>
      )}
      <div className="code-block">
        <pre className="select-text">{artifact.content}</pre>
        <button onClick={handleCopy} className="copy-btn" title="Copy">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-cyber-green" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
