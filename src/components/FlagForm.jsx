import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { useToast } from "./useToast";
import { CornerDownLeft, AlertCircle, CheckCircle } from "lucide-react";

const FLAG_REGEX = /^RYZU\{.*\}$/;

export default function FlagForm({ challenge, onSolved }) {
  const { isSolved, solveChallenge } = useAuth();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const alreadySolved = isSolved(challenge.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadySolved || busy) return;
    const trimmed = value.trim();
    if (!FLAG_REGEX.test(trimmed)) {
      setStatus("error");
      setShake(true);
      toast("Flag must be in RYZU{...} format", "error");
      setTimeout(() => setShake(false), 400);
      return;
    }
    const correct = trimmed === challenge.flag;
    if (correct) {
      setBusy(true);
      const res = await solveChallenge(challenge.id, challenge.points);
      setBusy(false);
      if (res.ok) {
        setStatus("success");
        toast(
          res.awarded === false
            ? "Already solved this challenge"
            : `+${challenge.points} pts — Challenge solved!`,
          res.awarded === false ? "info" : "success"
        );
        onSolved?.();
      } else {
        setStatus("error");
        toast(`Save failed: ${res.error}`, "error");
      }
    } else {
      setStatus("error");
      setShake(true);
      toast("Incorrect flag — try again", "error");
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-cyber-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Submit Flag
        </h3>
        <span className="text-xs text-cyber-dim font-mono">RYZU&#123;...&#125;</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="RYZU{...}"
          className="input-terminal flex-1 px-4 py-3 rounded-md pl-10 pr-3"
          disabled={alreadySolved || busy}
        />
        <button
          type="submit"
          disabled={alreadySolved || busy}
          className="btn-primary px-6 py-3 rounded-md font-mono disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {alreadySolved ? <CheckCircle className="w-4 h-4" /> : <CornerDownLeft className="w-4 h-4" />}
          <span>{alreadySolved ? "SOLVED" : busy ? "Saving" : "Submit"}</span>
        </button>
      </form>
      {status && (
        <div
          className={`mt-3 flex items-center gap-2 animate-${
            status === "error" ? "shake" : "fade-in"
          }`}
        >
          {status === "success" ? (
            <>
              <CheckCircle className="w-4 h-4 text-cyber-green" />
              <span className="text-sm text-cyber-green font-mono font-bold">
                Correct! Flag accepted.
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-cyber-magenta" />
              <span className="text-sm text-cyber-magenta font-mono">
                Incorrect flag. Try again.
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
