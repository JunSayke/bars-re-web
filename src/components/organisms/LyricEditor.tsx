"use client";
import React, { useState } from "react";
import VerseSection, { Verse } from "../molecules/VerseSection";

const initial: Verse[] = [
  { id: "v1", title: "Verse 1", color: "border-primary/30", lines: ["Ang kinabuhi mura rag ligid", "Usahay sa babaw, usahay sa ilalom"] },
  { id: "c1", title: "Chorus", color: "border-secondary/30", lines: ["Bisan asa, kanunay kang handumon"] },
];

export const LyricEditor: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>(initial);

  function handleChangeLine(verseIndex: number, lineIndex: number, value: string) {
    setVerses((prev) => {
      const copy = [...prev];
      copy[verseIndex] = { ...copy[verseIndex], lines: [...copy[verseIndex].lines] };
      copy[verseIndex].lines[lineIndex] = value;
      return copy;
    });
  }

  function addVerse() {
    setVerses((prev) => [...prev, { id: `v${prev.length + 1}`, title: `Verse ${prev.length + 1}`, lines: [""] }]);
  }

  return (
    <div className="flex-1 flex flex-col bg-[#120c1c] border border-surface-lighter/30 rounded-xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
      <div className="h-16 border-b border-surface-lighter/30 bg-[#1e162e]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-300 border border-primary/30">
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
          </div>
          <div>
            <h2 className="text-white text-sm font-bold tracking-wide">Untitled Project #4</h2>
            <div className="flex items-center gap-3 text-[10px] text-[#a492c9] font-mono mt-0.5 opacity-60">Rap Session v1.0</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-lighter text-white text-xs font-bold shadow-lg shadow-black/20 hover:bg-[#3e2e5e] transition-all border border-white/10">Load</button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all border border-white/10">Save</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#120c1c] scroll-smooth">
        {verses.map((v, vi) => (
          <VerseSection
            key={v.id}
            verse={v}
            onChangeLine={(li, val) => handleChangeLine(vi, li, val)}
            onAddLine={() => setVerses((prev) => {
              const copy = [...prev];
              copy[vi] = { ...copy[vi], lines: [...copy[vi].lines, ""] };
              return copy;
            })}
          />
        ))}

        <div className="mt-12 flex justify-center pb-8">
          <button onClick={addVerse} className="group w-full max-w-lg mx-auto flex items-center justify-between p-1.5 rounded-2xl bg-surface-lighter/20 hover:bg-surface-lighter/40 border-2 border-dashed border-white/10 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm ring-1 ring-white/5">
                <span className="material-symbols-outlined text-[24px]">add_circle</span>
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-white/90 group-hover:text-white tracking-wide">Add New Verse Section</span>
                <span className="block text-[11px] text-[#a492c9] group-hover:text-[#d8b4fe] mt-0.5">Start a new lyrical block</span>
              </div>
            </div>
            <div className="px-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              <span className="material-symbols-outlined text-white/40 group-hover:text-primary">arrow_forward</span>
            </div>
          </button>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
};

export default LyricEditor;
