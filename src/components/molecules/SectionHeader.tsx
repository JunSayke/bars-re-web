"use client";

import React from "react";

type Props = {
  sectionName?: string;
  scheme?: string;
  onChange?: (s: { sectionName?: string; scheme?: string }) => void;
};

export default function SectionHeader({ sectionName = "Verse 1", scheme = "AABB", onChange }: Props) {
  return (
    <div className="flex items-end gap-3 mb-2 ml-14">
      <div className="relative">
        <select
          className="appearance-none bg-surface-lighter/50 hover:bg-surface-lighter text-[#d8b4fe] text-xs font-bold uppercase tracking-wider pl-3 pr-8 py-1.5 rounded-lg border border-primary/30 outline-none cursor-pointer transition-colors"
          value={sectionName}
          onChange={(e) => onChange?.({ sectionName: e.target.value, scheme })}
        >
          <option>Verse 1</option>
          <option>Verse 2</option>
          <option>Intro</option>
          <option>Chorus</option>
        </select>
        <span className="material-symbols-outlined absolute right-2 top-1.5 text-[16px] text-[#d8b4fe] pointer-events-none">expand_more</span>
      </div>
      <div className="relative group/scheme">
        <span className="text-[10px] font-mono text-[#a492c9]/60 absolute -top-4 left-0">Scheme</span>
        <input
          className="w-16 bg-transparent text-[#a492c9] text-xs font-mono font-bold border-b border-white/10 focus:border-primary focus:outline-none py-1 transition-colors text-center uppercase"
          placeholder="AAAA"
          type="text"
          value={scheme}
          onChange={(e) => onChange?.({ sectionName, scheme: e.target.value })}
        />
      </div>
    </div>
  );
}
