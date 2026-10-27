import React, { useEffect } from "react";
import { Check, X } from "lucide-react";

export default function Toast({
  title,
  message,
  type = "success",
  isVisible = false,
  onClose,
}) {
  useEffect(() => {
    if (!isVisible || !onClose) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible || !message) {
    return null;
  }

  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900",
    info: "border-sky-200 bg-sky-50 text-sky-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  const tone = styles[type] ?? styles.success;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        role="status"
        aria-live="polite"
        className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ${tone}`}
      >
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
          <Check size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>

        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
