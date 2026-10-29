import React, { useEffect, useRef, useState } from "react";
import { Check, X, Info, CircleAlert } from "lucide-react";

const DURATION = 3000;

export default function Toast({
  title,
  message,
  type = "success",
  isVisible = false,
  onClose,
}) {
  const [mounted, setMounted] = useState(isVisible);
  const [show, setShow] = useState(false);
  const secondFrameRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !message) {
      setShow(false);
      return;
    }

    setMounted(true);
    setShow(false);

    let frame2;

    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setShow(true);
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [isVisible, message]);

  useEffect(() => {
    if (!isVisible || !message) return;

    const timer = window.setTimeout(() => {
      setShow(false);
      onClose?.();
    }, DURATION);

    return () => window.clearTimeout(timer);
  }, [isVisible, message, onClose]);

  if (!mounted || !message) return null;

  const styles = {
    success: {
      tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
      icon: "bg-emerald-100 text-emerald-700",
      progress: "bg-emerald-500",
      Icon: Check,
    },
    info: {
      tone: "border-sky-200 bg-sky-50 text-sky-900",
      icon: "bg-sky-100 text-sky-700",
      progress: "bg-sky-500",
      Icon: Info,
    },
    error: {
      tone: "border-rose-200 bg-rose-50 text-rose-900",
      icon: "bg-rose-100 text-rose-700",
      progress: "bg-rose-500",
      Icon: CircleAlert,
    },
  };

  const style = styles[type] ?? styles.success;
  const Icon = style.Icon;

  return (
    <div
      className={`
        fixed right-0 top-5 left-0 px-4 md:right-4 md:left-auto md:px-0 z-50 w-full
        md:w-[calc(100%-2rem)] md:max-w-sm
        transition-all duration-300 ease-out
        ${
          show
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }
      `}
    >
      <div
        role={type === "error" ? "alert" : "status"}
        aria-live={type === "error" ? "assertive" : "polite"}
        className={`
          relative overflow-hidden rounded-2xl border
          bg-white shadow-xl
          ${style.tone}
        `}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={`
              grid size-11 shrink-0 place-items-center
              rounded-xl ${style.icon}
            `}
          >
            <Icon size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            aria-label="Dismiss notification"
            className="
              rounded-md p-1 text-slate-400
              hover:bg-slate-100 hover:text-slate-700
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Countdown progress line */}
        <div className="h-1 w-full bg-slate-100" aria-hidden="true">
          <div
            key={`${title}-${message}-${isVisible}`}
            className={`
              h-full origin-left ${style.progress}
              ${show ? "toast-countdown" : "w-0"}
            `}
          />
        </div>
      </div>
    </div>
  );
}
