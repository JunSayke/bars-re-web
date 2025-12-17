"use client";
import React from "react";
import SectionBlock from "@/components/molecules/SectionBlock";
import EditorLine from "@/components/molecules/EditorLine";

export const WorkspaceEditor: React.FC = () => {
  const introLines = [
    { time: "00:00", text: "Yeah, woke up early, sun is shining bright", syllables: 10 },
    { time: "00:04", text: "Chasing dreams, gotta make it right", syllables: 8 },
  ];

  const verseLines = [
    { time: "00:08", text: "Walking down the street, feeling the heat", syllables: 10 },
    { time: "00:12", text: "Heart pumping fast to the rhythm of the beat", syllables: 11 },
    { time: "00:16", text: "Bisaya rap flow, dili na mapugngan", syllables: 11 },
    { time: "00:20", text: "Padayon lang, walay atrasan", syllables: 9 },
  ];

  const chorusLines = [
    { time: "00:24", text: "Every word I spit, pure fire and soul", syllables: 10 },
    { time: "00:28", text: "Reaching for the top, that is the goal", syllables: 10 },
  ];

  return (
    <div className="flex-1 max-w-4xl relative pt-6">
      <SectionBlock label="Intro" lines={introLines} />
      <SectionBlock label="Verse" lines={verseLines} />
      <SectionBlock label="Chorus" lines={chorusLines} />

      {/* placeholder editable final line */}
      <div className="mb-8 group">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-slate-200 dark:bg-[#233648] group-hover:bg-slate-300 dark:group-hover:bg-[#344c63] transition-colors"></div>
        </div>
        <EditorLine time="--:--" text={""} syllables={undefined} placeholder="Start typing next line..." className="opacity-50 hover:opacity-100 transition-opacity" />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20">
        <button className="bg-[#233648] text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-[#344c63] flex items-center gap-2 backdrop-blur-sm">
          <span className="material-symbols-outlined text-[14px]">visibility_off</span>
          <span>Focus Mode</span>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceEditor;
