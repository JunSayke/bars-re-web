import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "purple" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "rounded-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center gap-3";
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary to-purple-400 text-white hover:opacity-95 shadow-2xl",
    ghost: "bg-transparent text-white/90 hover:bg-white/5 border border-transparent",
    subtle: "bg-[#20142b] text-white/90 hover:bg-[#2a1938]",
    purple: "bg-gradient-to-r from-[#6b21a8] to-[#5b13ec] text-white hover:opacity-95 shadow-lg",
    outline: "bg-transparent border border-[#2a2130] text-slate-200 hover:border-[#5b13ec] hover:text-slate-200 dark:bg-transparent dark:border-[#2a2130]",
  };
  const sizes: Record<string, string> = {
    sm: "h-10 px-3 text-sm",
    md: "h-12 px-4",
    lg: "h-14 px-8",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
