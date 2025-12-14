"use client";

import React from "react";

type Props = { count: number };

export default function SyllableCount({ count }: Props) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-lighter/20 border border-white/5" title="Total Syllables">
      <span className="material-symbols-outlined text-[12px] text-primary-300">graphic_eq</span>
      <span className="text-[11px] font-bold text-white">{count}</span>
    </div>
  );
}
