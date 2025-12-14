"use client";

import React from "react";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
};

export default function TimestampInput({ value = "00:00", onChange }: Props) {
  return (
    <div className="pt-2 shrink-0">
      <div className="relative">
        <input
          className="w-12 bg-transparent text-[#a492c9]/70 text-xs font-mono text-right border-b border-transparent hover:border-surface-lighter focus:border-primary focus:outline-none transition-colors p-0.5"
          placeholder="00:00"
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
