"use client";
import React, { useEffect, useRef } from "react";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import Portal from "@/components/atoms/Portal";

const MOCK_ITEMS = [
  { id: 1, title: "Padayon Lang (Keep Going)", status: "DRAFT", time: "2h ago" },
  { id: 2, title: "Midnight Freestyle", status: "COMPLETE", time: "Yesterday" },
  { id: 3, title: "Cebu City Lights", status: "COMPLETE", time: "Oct 24" },
  { id: 4, title: "Untitled Session 4", status: "DRAFT", time: "Oct 20" },
];

type Props = {
  onClose: () => void;
};

export const MyRapsSheet: React.FC<Props & { visible?: boolean }> = ({ onClose, visible = true }) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // focus the search input when the sheet mounts
    searchRef.current?.focus();

    // close on Escape
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Portal>
      <div role="dialog" aria-label="My Raps" aria-hidden={!visible} tabIndex={visible ? 0 : -1} className={`fixed top-16 left-16 w-[24rem] h-[calc(100vh-4rem)] bg-white dark:bg-[#16202a] isolate transform-gpu overflow-hidden border-r border-slate-200 dark:border-[#233648] flex flex-col shadow-2xl z-90 backface-hidden will-change-transform transition-none ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="p-5 border-b border-slate-200 dark:border-[#233648] flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Icon name="folder_open" className="text-primary" />
          My Raps
        </h2>
        <button
          aria-label="Close My Raps"
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
            placeholder="Search projects..."
            type="text"
            aria-label="Search projects"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border border-slate-200 dark:border-[#233648] rounded px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors flex-1 justify-center">
            <span>Status</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent border border-slate-200 dark:border-[#233648] rounded px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors flex-1 justify-center">
            <span>Date Created</span>
            <span className="material-symbols-outlined text-[14px]">sort</span>
          </button>
        </div>
        <Button className="w-full py-2.5" variant="primary">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Create New Rap</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {MOCK_ITEMS.map((it) => (
          <div key={it.id} className="group relative p-3 rounded-lg bg-slate-50 dark:bg-[#1c2a38]/40 hover:bg-white dark:hover:bg-[#1c2a38] cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-[#2d4257] shadow-sm hover:shadow-md">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-[#111a22] flex items-center justify-center shrink-0 text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined">music_note</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate pr-2">{it.title}</h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{it.time}</span>
                </div>
                <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium mt-0.5 ${it.status === "COMPLETE" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-slate-200 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"}`}>
                  {it.status}
                </span>
              </div>
            </div>

            <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#1c2a38]/90 pl-2 backdrop-blur-sm rounded">
              <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-[#233648] rounded" title="Play Latest">
                <Icon name="play_arrow" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors hover:bg-slate-100 dark:hover:bg-[#233648] rounded" title="Edit">
                <Icon name="edit_square" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete">
                <Icon name="delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-[#233648] shrink-0 bg-slate-50 dark:bg-[#111a22]/50">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Storage Used</span>
          <span>75%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-[#233648] rounded-full overflow-hidden">
          <div className="h-full bg-primary w-3/4 rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">Upgrade for unlimited projects</p>
      </div>
    </div>
    </Portal>
  );
};

export default MyRapsSheet;
