"use client";

import React from "react";

type Props = {
  text: string;
  value?: number;
  onChange?: (n: number) => void;
};

export default function SyllableTag({ text, value = 1, onChange }: Props) {
  return (
    <div className="flex items-center bg-surface-lighter/30 rounded px-1.5 py-0.5 border border-white/5">
      <span className="text-[10px] text-[#a492c9] mr-1.5 select-none">{text}</span>
      <input
        className="w-4 bg-transparent text-center text-[10px] text-white font-mono focus:outline-none p-0 appearance-none"
        type="number"
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
    </div>
  );
}
