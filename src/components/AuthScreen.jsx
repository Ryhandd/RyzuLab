import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { USERNAME_RULE } from "../lib/supabase";
import LogoMark from "./LogoMark";
import { User, KeyRound, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const { signIn, signUp, authBusy } = useAuth();
  const [mode, setMode] = useState("login");
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
    else if (mode === "register") setInfo("Account created. Signing you in…");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* ambient */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[5%] w-[420px] h-[420px] rounded-full bg-accent-deep/[0.08] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative animate-slide-up">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <LogoMark className="w-14 h-14 mb-4" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RyzuLab<span className="text-cyber-cyan">.</span>
          </h1>
          <p className="text-xs text-cyber-muted tracking-[0.18em] uppercase mt-1">
            CTF Training Platform
          </p>
        </div>

        <div className="surface p-6">
          {/* Segmented control */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.03] border border-cyber-border mb-6">
            {[
              { id: "login", label: "Sign in" },
              { id: "register", label: "Create account" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setMode(t.id);
                  setError(null);
                  setInfo(null);
                }}
                className={`py-2 rounded-lg text-sm font-medium transition ${
                  mode === t.id ? "bg-white/10 text-white shadow-sm" : "text-cyber-dim hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Username" icon={User}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="commander"
                autoComplete="username"
                className="input-terminal w-full pl-10 pr-3 py-2.5 text-sm"
                disabled={authBusy}
                required
              />
            </Field>

            <Field label="Password" icon={KeyRound}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="input-terminal w-full pl-10 pr-3 py-2.5 text-sm"
                disabled={authBusy}
                required
              />
            </Field>

            {mode === "register" && (
              <Field label="Confirm password" icon={KeyRound}>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="input-terminal w-full pl-10 pr-3 py-2.5 text-sm"
                  disabled={authBusy}
                  required
                />
              </Field>
            )}

            {mode === "register" && (
              <p className="text-[11px] text-cyber-muted leading-relaxed">{USERNAME_RULE}</p>
            )}

            {error && (
              <div className="flex items-start gap-2 text-xs text-cyber-magenta bg-cyber-magenta/10 border border-cyber-magenta/25 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
            {info && (
              <div className="text-xs text-cyber-green bg-cyber-green/10 border border-cyber-green/25 rounded-lg px-3 py-2.5">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={authBusy}
              className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {authBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-cyber-muted text-center mt-5 leading-relaxed">
            No email required. Your username and password are your keys.
          </p>
        </div>

        <p className="text-[10px] text-cyber-muted text-center tracking-[0.14em] uppercase mt-6">
          Secure · Isolated · Server-side scoring
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-cyber-dim mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-cyber-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
