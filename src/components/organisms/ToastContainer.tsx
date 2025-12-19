"use client";
import React from "react";
import Toast from "../atoms/Toast";
import { useToast } from "@/contexts/toast";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  if (!toasts?.length) return null;
  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast open={true} message={t.message} variant={t.variant} duration={t.duration} onClose={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
