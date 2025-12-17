"use client";
import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Icon from "@/components/atoms/Icon";

import ThesaurusSheet from "@/components/organisms/ThesaurusSheet";
import AIAssistantSheet from "@/components/organisms/AIAssistantSheet";

export const RightRail: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sync right rail state from `right-sheet` URL param (single value)
  React.useEffect(() => {
    const explicit = searchParams?.get("right-sheet") ?? "";
    setAssistantOpen(explicit === "assistant");
    setOpen(explicit === "thesaurus");
  }, [searchParams]);

  function updateRightParam(next: string | null) {
    const sp = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    if (next) sp.set("right-sheet", next);
    else sp.delete("right-sheet");
    router.replace(`${pathname}${sp.toString() ? `?${sp.toString()}` : ""}`);
  }

  function toggleAssistant() {
    const current = searchParams?.get("right-sheet");
    const has = current === "assistant";
    updateRightParam(has ? null : "assistant");
  }

  function closeAssistant() {
    // remove right-sheet param only if it equals assistant
    const current = searchParams?.get("right-sheet");
    if (current === "assistant") updateRightParam(null);
  }

  function toggleThesaurus() {
    const current = searchParams?.get("right-sheet");
    const has = current === "thesaurus";
    updateRightParam(has ? null : "thesaurus");
  }

  function closeThesaurus() {
    const current = searchParams?.get("right-sheet");
    if (current === "thesaurus") updateRightParam(null);
  }

  return (
    <aside className="w-16 border-l border-slate-200 dark:border-[#233648] flex flex-col items-center py-6 gap-6 bg-background-light dark:bg-background-dark shrink-0 z-10 relative">
      <button onClick={toggleAssistant} aria-pressed={assistantOpen} aria-expanded={assistantOpen} className={`group relative flex items-center justify-center w-10 h-10 rounded ${assistantOpen ? 'bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white ring-1 ring-primary/30 shadow-[0_8px_28px_rgba(91,19,236,0.28)] transform-gpu scale-105' : 'hover:bg-slate-200 dark:hover:bg-[#233648] text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50` }>
        <Icon name="smart_toy" />
        <span className="absolute right-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">AI Assistant</span>
      </button>
      <button onClick={toggleThesaurus} aria-pressed={open} aria-expanded={open} className={`group relative flex items-center justify-center w-10 h-10 rounded ${open ? 'bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white ring-1 ring-primary/30 shadow-[0_8px_28px_rgba(91,19,236,0.28)] transform-gpu scale-105' : 'hover:bg-slate-200 dark:hover:bg-[#233648] text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}>
        <Icon name="menu_book" />
        <span className="absolute right-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Thesaurus</span>
      </button>

      <AIAssistantSheet onClose={closeAssistant} visible={assistantOpen} />
      <ThesaurusSheet onClose={closeThesaurus} visible={open} />
    </aside>
  );
};

export default RightRail;
