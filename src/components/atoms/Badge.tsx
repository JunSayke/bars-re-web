import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "muted" | "primary" | "accent";
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "muted", className = "" }) => {
  const base = "text-[10px] font-mono font-medium px-2 py-0.5 rounded";
  const styles =
    variant === "primary"
      ? "bg-primary/10 text-primary"
      : variant === "accent"
      ? "bg-indigo-500/10 text-indigo-400"
      : "bg-slate-200 dark:bg-[#1c2a38] text-slate-400 dark:text-slate-300";

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
};

export default Badge;

