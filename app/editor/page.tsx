import React from "react";
import LyricsPanel from "@/components/organisms/LyricsPanel";

export const metadata = {
  title: "Editor - BARS",
};

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-start justify-center p-4 lg:p-6 font-display">
      <div className="flex gap-6 w-full max-w-[1200px] h-[calc(100vh-3rem)]">
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
          </div>
          <LyricsPanel />
        </div>
      </div>
    </div>
  );
}
