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
    <div className="mb-4">
      {artifact.label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-cyber-dim font-mono uppercase tracking-wider">
            {artifact.label}
          </span>
        </div>
      )}
      <div className="code-block">
        <pre className="p-3 font-mono text-xs overflow-x-auto text-cyber-green select-text">
          {artifact.content}
        </pre>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copied ? "text-cyber-green" : ""}`}
          title="Copy"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
