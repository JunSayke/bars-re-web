"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../lib/useDebounce";
import {
  useThesaurusControllerSearch,
  useThesaurusControllerDetails,
  useThesaurusControllerRhymes,
} from "@/queries/api/barsApiComponents";
import Icon from "@/components/atoms/Icon";
import Portal from "@/components/atoms/Portal";

export default function ThesaurusSheet({ word: initialWord, onClose, visible = true }: { word?: string; onClose: () => void; visible?: boolean }) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);
  const [selected, setSelected] = useState<string | null>(initialWord ?? null);

  const search = useThesaurusControllerSearch(
    ["thesaurus", "search", debounced],
    {
      queryParams: { q: debounced || "", limit: "12" },
    },
    { enabled: debounced.length > 0 }
  );

  const details = useThesaurusControllerDetails(
    ["thesaurus", "details", selected],
    { pathParams: { word: selected ?? "" } },
    { enabled: !!selected }
  );

  const rhymes = useThesaurusControllerRhymes(
    ["thesaurus", "rhymes", selected],
    { pathParams: { word: selected ?? "" }, queryParams: { limit: "12", offset: "0", type: "all", randomness: "0" } },
    { enabled: !!selected }
  );

  // work with the raw results (the generated hooks return unknown types), attempt to read common fields
  const hits = (search?.data as any)?.results ?? (search?.data as any)?.hits ?? [];
  const detail = (details?.data as any) ?? null;
  const rhymeList = (rhymes?.data as any)?.rhymes ?? (rhymes?.data as any)?.results ?? [];

  useEffect(() => {
    if (initialWord) setSelected(initialWord);
  }, [initialWord]);

  return (
    <Portal>
      <div aria-hidden={!visible} tabIndex={visible ? 0 : -1} className={`fixed top-16 right-0 md:right-16 w-96 md:w-96 h-[calc(100vh-4rem)] bg-white dark:bg-[#1c2a38] isolate transform-gpu overflow-hidden border-l border-slate-200 dark:border-[#233648] shadow-2xl z-90 backface-hidden will-change-transform transition-none flex flex-col ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="p-4 border-b border-slate-200 dark:border-[#233648] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#16202a]">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="menu_book" className="text-primary text-[20px]" />
            Thesaurus
          </h3>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" onClick={onClose} aria-label="Close thesaurus">
            <Icon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="w-full max-w-[20rem] mx-auto">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-slate-100 dark:bg-[#111a22] border border-transparent focus:border-primary/50 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-0 placeholder-slate-500 text-slate-900 dark:text-white transition-all" placeholder="Search Bisaya word..." type="text" />
          </div>

          {selected ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-[#233648] pb-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{detail?.word ?? selected}</h2>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#111a22] px-2 py-1 rounded">{detail?.syllables ?? "-"} syl</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(detail?.pos ?? ["Verb"]).map((p: string) => (
                  <span key={p} className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300">{p}</span>
                ))}
                {(detail?.tags ?? []).slice(0, 4).map((t: string) => (
                  <span key={t} className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-[#111a22] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#233648]">{t}</span>
                ))}
              </div>

              {(detail?.definitions ?? detail?.definition) ? (
                <div className="border border-slate-200 dark:border-[#233648] rounded-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-[#111a22] hover:bg-slate-100 dark:hover:bg-[#16202a] transition-colors text-left group">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Definitions</span>
                    <span className="material-symbols-outlined text-slate-400 text-[18px] group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">expand_less</span>
                  </button>
                  <div className="p-3 bg-white dark:bg-[#16202a]/50 space-y-4 text-sm border-t border-slate-200 dark:border-[#233648]">
                    {(detail?.definitions ?? [detail?.definition]).map((d: any, i: number) => (
                      <div key={i}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sense {i + 1}</span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Icon name="graphic_eq" className="text-[14px]" /> Rhymes</h4>
                <div className="bg-slate-50 dark:bg-[#111a22] rounded-lg border border-slate-200 dark:border-[#233648] divide-y divide-slate-200 dark:divide-[#233648] overflow-hidden">
                  {rhymeList.length ? rhymeList.map((r: any) => (
                    <div key={r.word ?? r} className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 dark:hover:bg-[#16202a] cursor-pointer transition-colors group">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{r.word ?? r}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded">Exact</span>
                        <span className="text-[10px] font-mono text-slate-400">2s</span>
                      </div>
                    </div>
                  )) : (<div className="px-3 py-4 text-sm text-slate-500">No rhymes found</div>)}
                  <button className="w-full py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-[#16202a] transition-colors border-t border-slate-200 dark:border-[#233648]">Show more</button>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 dark:bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1"><Icon name="auto_awesome" className="text-[14px]" /> Wordplay Gen</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select className="col-span-1 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded text-xs text-slate-700 dark:text-slate-200 py-1.5 px-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                      <option>Poetic</option>
                      <option>Hard</option>
                    <option>Witty</option>
                  </select>
                  <input className="col-span-2 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648] rounded text-xs text-slate-700 dark:text-slate-200 py-1.5 px-2 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-400 outline-none" placeholder="Topic..." type="text" />
                </div>
                <button className="w-full bg-primary hover:bg-blue-600 text-white text-xs font-semibold py-2 rounded shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]">Generate Bar</button>
                <div className="relative">
                  <div className="absolute -top-1.5 left-3 px-1 bg-slate-50 dark:bg-[#131d26] text-[10px] text-slate-400">Result</div>
                  <div className="p-3 bg-white dark:bg-[#111a22] rounded border border-slate-200 dark:border-[#233648] text-sm text-slate-700 dark:text-slate-300 italic">"Padayon lang bisan magbagyo, kay ang tinuod nga kusog naa sa kasingkasing mo."</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-[#233648] pb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Thesaurus</h2>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#111a22] px-2 py-1 rounded">Type</span>
              </div>

              <div className="py-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Search for a Bisaya word, view definitions, rhymes, and example usage.</p>
              </div>

              <div className="border border-slate-200 dark:border-[#233648] p-3 rounded">
                <ul className="space-y-2">
                  {hits.length ? hits.map((h: any) => (
                    <li key={h.word ?? h} className="cursor-pointer p-2 rounded hover:bg-slate-100 dark:hover:bg-[#16202a]" onClick={() => setSelected(h.word ?? h)}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-sm text-slate-900 dark:text-white font-medium">{h.word ?? h}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{(h.syllables ?? h.syl) ? `${h.syllables ?? h.syl} syl` : ''}</div>
                      </div>
                    </li>
                  )) : (<li className="text-sm text-slate-500">Try searching for a word above</li>)}
                </ul>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
