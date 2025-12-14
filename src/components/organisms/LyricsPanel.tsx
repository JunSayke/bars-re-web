"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import LyricLine, { Syllable } from "@/components/molecules/LyricLine";

type Line = { id: string; time: string; lyric: string; syllables: Syllable[]; skipFocus?: boolean };
type Section = { id: string; name: string; scheme: string; lines: Line[] };

export default function LyricsPanel() {
  const idCounterRef = React.useRef(0);
  function genId() {
    idCounterRef.current += 1;
    return `id-${idCounterRef.current}`;
  }
  function newLine(): Line {
    return { id: genId(), time: "00:00", lyric: "", syllables: [] };
  }

  const [sections, setSections] = useState<Section[]>([
    {
      id: "s1",
      name: "Verse 1",
      scheme: "AABB",
      lines: [
        { id: "l1", time: "00:15", lyric: "Ang kinabuhi mura rag ligid", syllables: [{ text: "Ang", value: 1 }, { text: "ki-na-bu-hi", value: 4 }] },
        { id: "l2", time: "00:19", lyric: "Usahay sa babaw, usahay sa ilalom", syllables: [{ text: "U-sa-hay", value: 3 }, { text: "sa", value: 1 }] },
      ],
    },
    {
      id: "s2",
      name: "Chorus",
      scheme: "BB",
      lines: [{ id: "l3", time: "00:40", lyric: "Bisan asa, kanunay kang handumon", syllables: [] }],
    },
  ]);

  const [focusTarget, setFocusTarget] = useState<{ sectionId: string; lineId: string } | null>(null);
  const [nextLine, setNextLine] = useState<Record<string, string>>(() => Object.fromEntries(sections.map(s => [s.id, ""])));
  const [focusNextLineId, setFocusNextLineId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!focusNextLineId) return;
    // delay focusing to allow DOM to settle after insertion
    // retry focusing multiple times to reliably override browser focus moves
    let attempts = 0;
    const iv = setInterval(() => {
      attempts += 1;
      const el = document.querySelector<HTMLInputElement>(`input[data-nextline-id="${focusNextLineId}"]`);
      // If a newly created lyric input grabbed focus, blur it first
      const active = document.activeElement as HTMLElement | null;
      if (active && active.tagName === "INPUT" && active.getAttribute("placeholder") === "Write lyrics...") {
        (active as HTMLInputElement).blur();
      }
      if (el) {
        el.focus();
      }
      if (el || attempts > 20) {
        clearInterval(iv);
        setFocusNextLineId(null);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [focusNextLineId]);

  function updateLine(sectionIdx: number, lineIdx: number, state: Line) {
    const next = [...sections];
    next[sectionIdx].lines[lineIdx] = state;
    setSections(next);
  }

  function insertLineAfter(sectionIdx: number, lineIdx: number) {
    const next = [...sections];
    const id = genId();
    const newL = { ...newLine(), id };
    next[sectionIdx].lines.splice(lineIdx + 1, 0, newL);
    setSections(next);
    setFocusTarget({ sectionId: next[sectionIdx].id, lineId: id });
  }

  function deleteLine(sectionIdx: number, lineIdx: number): { sectionId: string; lineId: string } | null {
    const next = [...sections];
    const sec = next[sectionIdx];
    sec.lines.splice(lineIdx, 1);

    // determine a good focus target BEFORE we mutate the state
    let focus: { sectionId: string; lineId: string } | null = null;

    if (sec.lines.length === 0) {
      // section will be removed; try to focus the previous section's last line if available
      next.splice(sectionIdx, 1);
      const prevSec = next[sectionIdx - 1];
      if (prevSec && prevSec.lines.length > 0) {
        focus = { sectionId: prevSec.id, lineId: prevSec.lines[prevSec.lines.length - 1].id };
      }
    } else {
      // focus the previous line in the same section (or the new last line if deleted was last)
      const prevIdx = Math.max(0, lineIdx - 1);
      const targetLine = sec.lines[prevIdx];
      if (targetLine) focus = { sectionId: sec.id, lineId: targetLine.id };
    }

    setSections(next);
    return focus;
  }

  function addSection() {
    const next = [...sections];
    const id = genId();
    next.push({ id, name: "Verse", scheme: "AAAA", lines: [newLine()] });
    setSections(next);
    setNextLine((s) => ({ ...s, [id]: "" }));
    setFocusTarget({ sectionId: id, lineId: next[next.length - 1].lines[0].id });
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#120c1c] scroll-smooth">
      {sections.map((sec, sIdx) => (
        <div key={sec.id} className="relative group">
          <SectionHeader sectionName={sec.name} scheme={sec.scheme} onChange={(p) => {
            const next = [...sections];
            next[sIdx] = { ...next[sIdx], ...p };
            setSections(next);
          }} />

          <div className={`relative pl-6 border-l-2 ${sIdx === 0 ? "border-primary/30" : "border-secondary/30"} space-y-1`}>
            {sec.lines.map((l, idx) => (
              <LyricLine
                key={l.id}
                time={l.time}
                lyric={l.lyric}
                syllables={l.syllables}
                count={l.syllables.reduce((s, x) => s + x.value, 0)}
                autoFocus={!!(focusTarget && focusTarget.sectionId === sec.id && focusTarget.lineId === l.id)}
                suppressFocus={l.skipFocus}
                onChange={(s) => updateLine(sIdx, idx, { ...l, time: s.time, lyric: s.lyric, syllables: s.syllables })}
                onEnter={() => insertLineAfter(sIdx, idx)}
                onBackspaceEmpty={() => {
                  // delete line and use returned focus target (handles section removal too)
                  const prev = deleteLine(sIdx, idx);
                  if (prev) {
                    // delay focusing slightly to allow DOM update and override browser focus
                    setTimeout(() => setFocusTarget(prev), 40);
                  }
                }}
              />
            ))}

            <div className="relative flex gap-4 p-3 pr-4 rounded-xl transition-all group/line opacity-50 hover:opacity-100">
              <div className="pt-2 shrink-0">
                <div className="relative">
                  <input className="w-12 bg-transparent text-[#a492c9]/40 text-xs font-mono text-right border-none p-0.5" disabled type="text" value="00:23" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <input
                  className="w-full bg-transparent text-white/50 text-lg font-medium border-none focus:ring-0 p-0 italic"
                  placeholder="Type next line..."
                  type="text"
                  value={nextLine[sec.id] ?? ""}
                  onChange={(e) => setNextLine((s) => ({ ...s, [sec.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (key === "Enter") {
                      e.preventDefault();
                      const text = (nextLine[sec.id] ?? "").trim();
                      const id = genId();
                      const newL: Line = { id, time: "00:00", lyric: text, syllables: [], skipFocus: true };
                      const next = [...sections];
                      next[sIdx].lines.push(newL);
                      setSections(next);
                      setNextLine((s) => ({ ...s, [sec.id]: "" }));
                      // temporarily make the inserted lyric not focusable by disabling it and then re-enable
                      setTimeout(() => {
                        setSections((prev) => {
                          const copy = [...prev];
                          const sec2 = copy[sIdx];
                          if (!sec2) return prev;
                          const ln = sec2.lines.find((x) => x.id === id);
                          if (ln) {
                            ln.skipFocus = false;
                          }
                          return copy;
                        });
                      }, 150);
                      setFocusNextLineId(sec.id);
                    }
                    if (key === "Backspace") {
                      // if the next-line input is empty, move focus to previous line
                      if (!(nextLine[sec.id] ?? "")) {
                        const lastIdx = sec.lines.length - 1;
                        // blur this input first so the target can receive focus
                        try {
                          (e.target as HTMLInputElement).blur();
                        } catch {}
                        if (lastIdx >= 0) {
                          const prev = { sectionId: sec.id, lineId: sec.lines[lastIdx].id };
                          // delay focusing slightly to allow DOM to settle and override browser defaults
                          setTimeout(() => setFocusTarget(prev), 40);
                        } else {
                          // no lines in this section; try previous section's last line
                          const prevSec = sections[sIdx - 1];
                          if (prevSec && prevSec.lines.length > 0) {
                            const prev = { sectionId: prevSec.id, lineId: prevSec.lines[prevSec.lines.length - 1].id };
                            setTimeout(() => setFocusTarget(prev), 40);
                          }
                        }
                        // prevent default backspace behavior
                        e.preventDefault();
                      }
                    }
                  }}
                  data-nextline-id={sec.id}
                  aria-label="Type next line..."
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-12 flex justify-center pb-8">
        <button onClick={addSection} className="group w-full max-w-lg mx-auto flex items-center justify-between p-1.5 rounded-2xl bg-surface-lighter/20 hover:bg-surface-lighter/40 border-2 border-dashed border-white/10 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
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

      <div className="h-24"></div>
    </div>
  );
}
