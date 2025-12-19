"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info";
export type ToastItem = { id: string; message: string; variant?: ToastVariant; duration?: number };

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (t: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, variant = "info", duration = 3000 }: Omit<ToastItem, "id">) => {
    const id = (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2));
    const toast: ToastItem = { id, message, variant, duration };
    setToasts((s) => [...s, toast]);
    if (duration && duration > 0) {
      setTimeout(() => removeToast(id), duration + 50);
    }
    return id;
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => addToast({ message, variant: "success", duration }), [addToast]);
  const error = useCallback((message: string, duration?: number) => addToast({ message, variant: "error", duration }), [addToast]);
  const info = useCallback((message: string, duration?: number) => addToast({ message, variant: "info", duration }), [addToast]);

  const value = useMemo(() => ({ toasts, addToast, removeToast, success, error, info }), [toasts, addToast, removeToast, success, error, info]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
