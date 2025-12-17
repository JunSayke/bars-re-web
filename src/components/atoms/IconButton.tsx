import React from "react";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  size?: number;
  variant?: "ghost" | "solid";
};

export const IconButton: React.FC<IconButtonProps> = ({ label, size = 36, variant = "ghost", className = "", children, ...props }) => {
  const base = `inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-0 ${className}`;
  const variants: Record<string, string> = {
    ghost: "bg-transparent",
    solid: "bg-[#2a1938]",
  };

  return (
    <button aria-label={label} title={label} className={`${base} ${variants[variant]}`} style={{ width: size, height: size }} {...props}>
      {children}
    </button>
  );
};

export default IconButton;
