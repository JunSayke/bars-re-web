import React from "react";
import { Select } from "../atoms/Select";
import LyricLine from "./LyricLine";

export type Verse = {
  id: string;
  title: string;
  color?: string;
  lines: string[];
};

type VerseSectionProps = {
  verse: Verse;
  onChangeLine: (index: number, value: string) => void;
  onAddLine: () => void;
};

export const VerseSection: React.FC<VerseSectionProps> = ({ verse, onChangeLine }) => {
  const selectOptions = [
    { value: "verse", label: "Verse" },
    { value: "chorus", label: "Chorus" },
    { value: "bridge", label: "Bridge" },
    { value: "intro", label: "Intro" },
  ];

  return (
    <div className="relative group">
      <div className="flex items-end gap-3 mb-2 ml-2">
        <div className="relative">
          <Select options={selectOptions} value={verse.title} />
        </div>
      </div>

      <div className={`relative pl-6 border-l-2 ${verse.color ?? "border-primary/30"} space-y-1`}>
        {verse.lines.map((line, idx) => (
          <LyricLine key={idx} value={line} onChange={(v) => onChangeLine(idx, v)} />
        ))}
      </div>
    </div>
  );
};

export default VerseSection;
