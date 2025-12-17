"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/atoms/Icon";
import MyRapsSheet from "@/components/organisms/MyRapsSheet";
import SnippetsSheet from "@/components/organisms/SnippetsSheet";

export const LeftRail: React.FC = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [sheet, setSheet] = useState<string | null>(null);

  // sync sheet state from the URL param `left-sheet`
  useEffect(() => {
    const current = searchParams?.get("left-sheet");
    setSheet(current);
  }, [searchParams]);

  const updateUrl = (nextSheet: string | null) => {
    const sp = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    if (nextSheet) sp.set("left-sheet", nextSheet);
    else sp.delete("left-sheet");
    const qs = sp.toString();
    const url = `${path}${qs ? `?${qs}` : ""}`;
    // replace so we don't create history entries on toggles
    router.replace(url);
  };

  const toggle = (target: string) => {
    const next = sheet === target ? null : target;
    setSheet(next);
    updateUrl(next);
  };

  const close = () => {
    setSheet(null);
    updateUrl(null);
  };

  const myOpen = sheet === "my-raps";
  const snippetsOpen = sheet === "snippets";

  return (
    <aside className="w-16 border-r border-slate-200 dark:border-[#233648] flex flex-col items-center py-6 gap-6 bg-background-light dark:bg-background-dark shrink-0 z-10">
      <button
        onClick={() => toggle("my-raps")}
        aria-expanded={myOpen}
        aria-pressed={myOpen}
        title="My Raps"
        className={`group relative flex items-center justify-center w-10 h-10 rounded transition-all ${
          myOpen
            ? "bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white ring-1 ring-primary/30 shadow-[0_8px_28px_rgba(91,19,236,0.28)] transform-gpu scale-105"
            : "hover:bg-slate-200 dark:hover:bg-[#233648] text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
      >
        <Icon name="folder_open" className={myOpen ? "text-white" : "text-slate-500 dark:text-slate-400"} />
        <span className="absolute left-12 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">My Raps</span>
      </button>

      <button
        onClick={() => toggle("snippets")}
        aria-expanded={snippetsOpen}
        aria-pressed={snippetsOpen}
        title="Snippets"
        className={`group relative flex items-center justify-center w-10 h-10 rounded transition-all ${
          snippetsOpen
            ? "bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white ring-1 ring-primary/30 shadow-[0_8px_28px_rgba(91,19,236,0.28)] transform-gpu scale-105"
            : "hover:bg-slate-200 dark:hover:bg-[#233648] text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
      >
        <Icon name="description" className={snippetsOpen ? "text-white" : "text-slate-500 dark:text-slate-400"} />
        <span className="absolute left-12 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">Snippets</span>
      </button>

      <MyRapsSheet onClose={close} visible={myOpen} />
      <SnippetsSheet onClose={close} visible={snippetsOpen} />
    </aside>
  );
};

export default LeftRail;
