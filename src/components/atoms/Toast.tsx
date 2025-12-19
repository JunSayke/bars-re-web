"use client";
import React, { useEffect } from "react";

type ToastProps = {
  open: boolean;
  message: string;
  variant?: "success" | "error" | "info";
  duration?: number; // ms
  onClose?: () => void;
  className?: string;
};

const Toast: React.FC<ToastProps> = ({ open, message, variant = "success", duration = 3000, onClose, className = "" }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  // Ensure toast has a reasonable minimum width and doesn't wrap short messages
  const base = "flex items-center gap-3 px-6 py-3 min-w-[280px] max-w-[90vw] rounded-full text-white shadow-2xl border backdrop-blur-md";
  const variantClasses =
    variant === "success"
      ? "bg-green-600 dark:bg-green-700 shadow-green-900/20 border-green-500 dark:border-green-600"
      : variant === "error"
      ? "bg-red-600 dark:bg-red-700 shadow-red-900/20 border-red-500 dark:border-red-600"
      : "bg-blue-600 dark:bg-blue-700 shadow-blue-900/20 border-blue-500 dark:border-blue-600";

  return (
    <div role="status" aria-live="polite" className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 ${className}`}>
      <div className={`${base} ${variantClasses}`}>
        <span className="material-symbols-outlined text-[22px]">{variant === "success" ? "check_circle" : variant === "error" ? "error" : "info"}</span>
        {/* Truncate long messages and keep short ones on one line */}
        <span className="text-sm font-semibold tracking-wide truncate max-w-[60vw]">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
