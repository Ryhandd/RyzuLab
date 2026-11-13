import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { useToast } from "./useToast";
import { CornerDownLeft, AlertCircle, CheckCircle } from "lucide-react";

const FLAG_REGEX = /^RYZU\{.*\}$/;

export default function FlagForm({ challenge, onSolved }) {
  const { isSolved, solveChallenge } = useAuth();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const alreadySolved = isSolved(challenge.id);

  const fail = () => {
    setStatus("error");
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadySolved || busy) return;
    const trimmed = value.trim();
    if (!FLAG_REGEX.test(trimmed)) {
      fail();
      toast("Flags look like RYZU{...}", "error");
      return;
    }
    if (trimmed !== challenge.flag) {
      fail();
      toast("Incorrect flag — try again", "error");
      return;
    }
    setBusy(true);
    const res = await solveChallenge(challenge.id, challenge.points);
    setBusy(false);
    if (res.ok) {
      setStatus("success");
      toast(
        res.awarded === false
          ? "Already solved"
          : `+${challenge.points} pts — solved`,
        res.awarded === false ? "info" : "success"
      );
      onSolved?.();
    } else {
      fail();
      toast(`Could not save: ${res.error}`, "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-white">Submit flag</h3>
        <span className="text-[11px] text-cyber-muted font-mono">RYZU&#123;...&#125;</span>
      </div>
      <form onSubmit={handleSubmit} className={`flex gap-2 ${shake ? "animate-shake" : ""}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="RYZU{...}"
          className="input-terminal flex-1 px-3.5 py-2.5 text-sm font-mono"
          disabled={alreadySolved || busy}
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={alreadySolved || busy}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {alreadySolved ? <CheckCircle className="w-4 h-4" /> : <CornerDownLeft className="w-4 h-4" />}
          <span>{alreadySolved ? "Solved" : busy ? "Saving" : "Submit"}</span>
        </button>
      </form>
      {status === "success" ? (
        <div className="mt-3 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-cyber-green" />
          <span className="text-sm text-cyber-green font-medium">Correct — flag accepted.</span>
        </div>
      ) : status === "error" ? (
        <div className="mt-3 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-cyber-magenta" />
          <span className="text-sm text-cyber-magenta">Incorrect flag. Try again.</span>
        </div>
      ) : null}
    </div>
  );
}
