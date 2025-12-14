"use client";

import React from "react";

type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  disabled?: boolean;
};

export default function LyricInput({ value = "", placeholder = "Write lyrics...", onChange, onKeyDown, autoFocus = false, disabled = false }: Props) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <input
      ref={ref}
      className="w-full bg-transparent text-white text-lg font-medium border-none focus:ring-0 p-0 placeholder-white/10 tracking-tight"
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
}
