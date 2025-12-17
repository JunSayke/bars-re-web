"use client";
import React, { useState } from "react";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";

import Portal from "@/components/atoms/Portal";

export default function AIAssistantSheet({ onClose, visible = true }: { onClose: () => void; visible?: boolean }) {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<"rhyme" | "flow" | null>(null);

  function handleAnalyze() {
    // Placeholder: produce a simple static analysis response for demo
    setAnalysis({
      rhyme: {
        headline: "Strong AABB scheme detected. The 'Bright/Right' pair lands perfectly on the snare.",
        bullets: ["Internal rhyme in bar 3 adds momentum."],
      },
      flow: {
        headline: "Line 4 syllable count (11) is high relative to the established cadence.",
        suggestion: "Heart pumping fast to the beat",
      },
      vocab: ["Radiant", "Luminating", "Nag-dilaab (Bisaya)"],
    });
    // default to rhyme as the active section
    setActiveSection("rhyme");
  }


  return (
    <Portal>
      <div aria-hidden={!visible} tabIndex={visible ? 0 : -1} className={`fixed top-16 right-0 md:right-16 w-96 md:w-96 h-[calc(100vh-4rem)] bg-background-light dark:bg-[#111a22] isolate transform-gpu overflow-hidden border-l border-slate-200 dark:border-[#233648] shadow-2xl z-90 backface-hidden will-change-transform transition-none flex flex-col ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#16202a] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            <h3 className="font-semibold text-slate-800 dark:text-white">AI Assistant</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#233648] text-slate-500 dark:text-slate-400 transition-colors" aria-label="Close assistant">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lyrical Block Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 bg-white dark:bg-[#0b1219] border border-slate-300 dark:border-[#233648] rounded-md p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary resize-none mb-3" placeholder="Enter or select lyrical block for analysis..."></textarea>
            <Button variant="purple" className="w-full" onClick={handleAnalyze}>
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span className="ml-2">Analyze Lyrics</span>
            </Button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-[#233648] mb-6" />

          <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Feedback Report</h4>
            </div>

            {/* Rhyme Analysis */}
            <div className={`bg-white dark:bg-[#16202a] rounded-lg border border-slate-200 dark:border-[#233648] overflow-hidden shadow-sm ${activeSection === 'rhyme' ? 'ring-1 ring-primary/30' : ''}`}>
              <div onClick={() => setActiveSection(activeSection === 'rhyme' ? null : 'rhyme')} className="cursor-pointer px-4 py-2 border-b border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#1c2a38] flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Rhyme Analysis</span>
                <span className="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{analysis?.rhyme?.headline ?? 'No analysis yet. Provide a lyrical block and press Analyze.'}</p>
                <ul className="space-y-2">
                  {(analysis?.rhyme?.bullets ?? []).map((b: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flow Suggestions */}
            <div className={`bg-white dark:bg-[#16202a] rounded-lg border border-slate-200 dark:border-[#233648] overflow-hidden shadow-sm ${activeSection === 'flow' ? 'ring-1 ring-primary/30' : ''}`}>
              <div onClick={() => setActiveSection(activeSection === 'flow' ? null : 'flow')} className="cursor-pointer px-4 py-2 border-b border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#1c2a38] flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Flow Suggestions</span>
                <span className="material-symbols-outlined text-amber-500 text-[16px]">warning</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{analysis?.flow?.headline ?? 'No flow analysis yet.'}</p>
                {analysis?.flow?.suggestion && (
                  <div className="bg-slate-100 dark:bg-[#0b1219] p-3 rounded border border-slate-200 dark:border-[#233648] border-l-4 border-l-primary">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Suggestion</p>
                    <p className="text-sm text-slate-800 dark:text-slate-200 italic">{analysis.flow.suggestion}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#16202a] rounded-lg border border-slate-200 dark:border-[#233648] overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#1c2a38] flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Vocabulary Enrichment</span>
                <span className="material-symbols-outlined text-primary text-[16px]">auto_awesome</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Alternatives for selected phrase:</p>
                <div className="flex flex-wrap gap-2">
                  {(analysis?.vocab ?? []).map((v: string, i: number) => (
                    <button key={i} className="px-2 py-1 bg-slate-100 dark:bg-[#0b1219] text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#233648] rounded hover:border-primary cursor-pointer transition-colors">{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
