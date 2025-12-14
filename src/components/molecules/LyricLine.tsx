"use client";

import React from "react";
import TimestampInput from "@/components/atoms/TimestampInput";
import LyricInput from "@/components/atoms/LyricInput";
import SyllableTag from "@/components/atoms/SyllableTag";
import SyllableCount from "@/components/atoms/SyllableCount";
import RhymeBadge from "@/components/atoms/RhymeBadge";

export type Syllable = { text: string; value: number };

type Props = {
  time?: string;
  lyric?: string;
  syllables?: Syllable[];
  count?: number;
  rhyme?: string;
  autoFocus?: boolean;
  suppressFocus?: boolean;
  onChange?: (state: { time: string; lyric: string; syllables: Syllable[] }) => void;
  onEnter?: () => void;
  onBackspaceEmpty?: () => void;
};

export default function LyricLine({ time = "00:00", lyric = "", syllables = [], count = 0, rhyme = "A", autoFocus = false, suppressFocus = false, onChange, onEnter, onBackspaceEmpty }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
    }
    if (e.key === "Backspace" && !lyric) {
      onBackspaceEmpty?.();
    }
  }

  return (
    <div className="relative flex gap-4 p-3 pr-4 rounded-xl hover:bg-surface-lighter/20 transition-all group/line border border-transparent hover:border-white/5">
      <TimestampInput value={time} onChange={(t) => onChange?.({ time: t, lyric, syllables })} />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <LyricInput value={lyric} onChange={(v) => onChange?.({ time, lyric: v, syllables })} onKeyDown={handleKeyDown} autoFocus={autoFocus} disabled={suppressFocus} />
        <div className="flex flex-wrap items-center gap-2 opacity-60 group-hover/line:opacity-100 transition-opacity">
          {syllables.map((s, i) => (
            <SyllableTag key={i} text={s.text} value={s.value} onChange={(n) => {
              const next = [...syllables];
              next[i] = { ...next[i], value: n };
              onChange?.({ time, lyric, syllables: next });
            }} />
          ))}
        </div>
      </div>
      <div className="pt-1.5 shrink-0 flex flex-col items-end gap-2">
        <SyllableCount count={count} />
        <RhymeBadge label={rhyme} />
      </div>
    </div>
  );
}
