import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { USERNAME_RULE } from "../lib/supabase";
import { Terminal, User, KeyRound, ShieldAlert, Zap, Loader2 } from "lucide-react";

export default function AuthScreen() {
  const { signIn, signUp, authBusy } = useAuth();
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === "register" && password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    const res =
      mode === "login"
        ? await signIn(username, password)
        : await signUp(username, password);
    if (!res.ok) setError(res.error);
    else if (mode === "register") setInfo("Account created. Logging you in…");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-lg border border-cyber-cyan flex items-center justify-center bg-cyber-cyan/10 shadow-cyber-cyan mb-4">
            <Zap className="w-8 h-8 text-cyber-cyan" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            RYZULAB<span className="text-cyber-cyan">.ENGINE</span>
          </h1>
          <p className="text-xs text-cyber-dim font-mono uppercase tracking-widest mt-1">
            CTF Training Platform
          </p>
        </div>

        <div className="glass-panel rounded-xl border border-cyber-border p-6 shadow-cyber-cyan-strong">
          {/* Tabs */}
          <div className="flex border border-cyber-border rounded-md overflow-hidden mb-6">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setInfo(null);
                }}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition ${
                  mode === m
                    ? "bg-cyber-cyan/20 text-cyber-cyan"
                    : "text-cyber-dim hover:text-white"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-cyber-dim font-mono uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyber-dim absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="commander"
                  autoComplete="username"
                  className="input-terminal w-full pl-10 pr-3 py-3 rounded-md"
                  disabled={authBusy}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-cyber-dim font-mono uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-cyber-dim absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="input-terminal w-full pl-10 pr-3 py-3 rounded-md"
                  disabled={authBusy}
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-[10px] text-cyber-dim font-mono uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-cyber-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="input-terminal w-full pl-10 pr-3 py-3 rounded-md"
                    disabled={authBusy}
                    required
                  />
                </div>
                <p className="text-[10px] text-cyber-dim font-mono mt-1.5">{USERNAME_RULE}</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-xs text-cyber-magenta font-mono bg-cyber-magenta/10 border border-cyber-magenta/40 rounded-md p-3">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="text-xs text-cyber-green font-mono bg-cyber-green/10 border border-cyber-green/40 rounded-md p-3">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={authBusy}
              className="btn-primary w-full py-3 rounded-md font-mono flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Terminal className="w-4 h-4" />
              )}
              <span>
                {authBusy
                  ? "Please wait"
                  : mode === "login"
                  ? "Access Terminal"
                  : "Create Account"}
              </span>
            </button>
          </form>

          <p className="text-[10px] text-cyber-dim font-mono text-center mt-5 leading-relaxed">
            No email required. Your username and password are your keys to the lab.
          </p>
        </div>
      </div>
    </div>
  );
}
