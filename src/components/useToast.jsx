import { useState, useCallback } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, toasts, remove };
}

const TOAST_STYLE = {
  success: { color: "#34d399", Icon: CheckCircle },
  error: { color: "#fb7185", Icon: AlertCircle },
  info: { color: "#22d3ee", Icon: Info },
};

export function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[60] pointer-events-none items-center">
      {toasts.map((t) => {
        const { color, Icon } = TOAST_STYLE[t.type] || TOAST_STYLE.info;
        return (
          <button
            key={t.id}
            onClick={() => remove(t.id)}
            className="toast pointer-events-auto surface flex items-center gap-2.5 px-4 py-2.5 max-w-[90vw]"
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color }} />
            <span className="text-sm text-white">{t.message}</span>
          </button>
        );
      })}
    </div>
  );
}
