import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, toasts, remove };
}

export function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className="pointer-events-auto glass-panel rounded-lg px-4 py-3 border-l-4 min-w-[260px] animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                t.type === "success" ? "bg-cyber-green" : t.type === "error" ? "bg-cyber-magenta" : "bg-cyber-cyan"
              }`}
            />
            <span className="text-sm font-mono text-white">{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
