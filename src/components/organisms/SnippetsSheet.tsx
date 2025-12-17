"use client";
import React, { useEffect, useRef } from "react";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import Portal from "@/components/atoms/Portal";

const MOCK_SNIPPETS = [
  {
    id: 1,
    text: '"Mga bituon sa langit, nagtan-aw kanato. (The stars in the sky, watching over us) shining bright..."',
    kind: "VERSE",
    tags: ["#Bisaya", "#Deep"],
    time: "2h ago",
  },
  {
    id: 2,
    text: '"You claim the throne, but you built it on lies. Look me in the eyes, see the truth rise..."',
    kind: "PUNCHLINE",
    tags: ["#Diss", "#Aggressive"],
    time: "1d ago",
  },
  {
    id: 3,
    text: '"Cebuano rhythm flowing through my veins, washing away the pains, breaking all the chains..."',
    kind: "CHORUS",
    tags: ["#Pride", "#Flow"],
    time: "3d ago",
  },
  {
    id: 4,
    text: '"Just a quick idea about city lights and endless nights. Needs more work on rhyme scheme."',
    kind: "IDEA",
    tags: ["#Concept"],
    time: "Oct 20",
  },
  {
    id: 5,
    text: '"Yo, listen up, this is where it starts. Beating hearts and broken parts."',
    kind: "INTRO",
    tags: ["#Start"],
    time: "Oct 18",
  },
];

const kindClasses: Record<string, string> = {
  VERSE: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
  PUNCHLINE: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
  CHORUS: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
  IDEA: "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300",
  INTRO: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
};

type Props = {
  onClose: () => void;
};

export const SnippetsSheet: React.FC<Props & { visible?: boolean }> = ({ onClose, visible = true }) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Portal>
      <div role="dialog" aria-label="Snippets" aria-hidden={!visible} tabIndex={visible ? 0 : -1} className={`fixed top-16 left-16 w-[24rem] h-[calc(100vh-4rem)] bg-white dark:bg-[#16202a] isolate transform-gpu overflow-hidden border-r border-slate-200 dark:border-[#233648] flex flex-col shadow-2xl z-90 backface-hidden will-change-transform transition-none ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="p-5 border-b border-slate-200 dark:border-[#233648] flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Icon name="description" className="text-primary" />
          Snippets
        </h2>
        <button
          aria-label="Close Snippets"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded hover:bg-slate-100 dark:hover:bg-[#233648] p-1"
        >
          <Icon name="close" className="text-[20px]" />
        </button>
      </div>

      <div className="p-5 pb-2 shrink-0 space-y-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
          <input
            ref={searchRef}
            className="w-full bg-slate-100 dark:bg-[#111a22] border border-transparent dark:border-[#233648] rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-slate-200 placeholder-slate-500 transition-all"
            placeholder="Search snippets by text or tag..."
            type="text"
            aria-label="Search snippets"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border border-slate-200 dark:border-[#233648] rounded px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors flex-1 justify-center">
            <span>Type</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border border-slate-200 dark:border-[#233648] rounded px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors flex-1 justify-center">
            <span>Theme</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border border-slate-200 dark:border-[#233648] rounded px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors" title="Sort by Date">
            <span className="material-symbols-outlined text-[16px]">sort</span>
          </button>
        </div>

        <Button className="w-full py-2.5" variant="primary">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Snippet</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-6">
        {MOCK_SNIPPETS.map((s) => (
          <div key={s.id} className="group relative p-3.5 rounded-lg bg-slate-50 dark:bg-[#1c2a38]/40 hover:bg-white dark:hover:bg-[#1c2a38] cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-[#2d4257] shadow-sm hover:shadow-md">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 font-medium leading-relaxed">{s.text}</p>
              </div>

              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-[#233648]/50">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${kindClasses[s.kind]}`}>{s.kind}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{s.tags.join(" ")}</span>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{s.time}</span>
              </div>
            </div>

            <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 dark:bg-[#1c2a38]/95 pl-1 backdrop-blur-sm rounded shadow-sm border border-slate-100 dark:border-[#233648]">
              <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded hover:bg-slate-100 dark:hover:bg-[#233648]" title="Use in Workspace">
                <Icon name="add_circle" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors rounded hover:bg-slate-100 dark:hover:bg-[#233648]" title="Copy Text">
                <Icon name="content_copy" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors rounded hover:bg-slate-100 dark:hover:bg-[#233648]" title="Edit">
                <Icon name="edit" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                <Icon name="delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Portal>
  );
};

export default SnippetsSheet;
