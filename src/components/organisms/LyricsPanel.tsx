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
  // Ensure each section always has at least one trailing empty line
  function normalizeSections(secs: Section[]) {
    return secs.map((s) => {
      const copy = { ...s, lines: [...s.lines] };
      if (copy.lines.length === 0 || copy.lines[copy.lines.length - 1].lyric !== "") {
        copy.lines.push(newLine());
      }
      return copy;
    });
  }

  // Ensure initial sections have a trailing empty line
  React.useEffect(() => {
    setSections((s) => normalizeSections(s));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateLine(sectionIdx: number, lineIdx: number, state: Line) {
    const next = [...sections];
    next[sectionIdx].lines[lineIdx] = state;
    setSections(normalizeSections(next));
  }

  function insertLineAfter(sectionIdx: number, lineIdx: number) {
    const next = [...sections];
    const id = genId();
    const newL = { ...newLine(), id };
    next[sectionIdx].lines.splice(lineIdx + 1, 0, newL);
    setSections(normalizeSections(next));
    // delay focusing to allow the DOM and placeholder mapping to settle
    setTimeout(() => {
      const secAfter = (sections[sectionIdx] || next[sectionIdx]);
      const last = secAfter?.lines[secAfter.lines.length - 1];
      if (last) setFocusTarget({ sectionId: next[sectionIdx].id, lineId: last.id });
    }, 40);
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

    setSections(normalizeSections(next));
    return focus;
  }

  function addSection() {
    const next = [...sections];
    const id = genId();
    next.push({ id, name: "Verse", scheme: "AAAA", lines: [newLine()] });
    setSections(normalizeSections(next));
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
                placeholder={idx === sec.lines.length - 1 ? "Type next line..." : undefined}
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

            {/* trailing input removed: sections now always include a trailing empty LyricLine */}
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
