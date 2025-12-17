"use client";
import React, { useId, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import EditorLine from "@/components/molecules/EditorLine";

type Line = { time?: string; text?: string; syllables?: number };

type SectionBlockProps = {
  label?: string;
  labelVariant?: "muted" | "primary" | "accent";
  lines?: Line[];
  className?: string;
};

export const SectionBlock: React.FC<SectionBlockProps> = ({ label, lines = [], className = "" }) => {
  const id = useId();
  const [open, setOpen] = useState(true);

  const toggle = () => setOpen((s) => !s);

  return (
    <div className={`mb-8 group ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {label && (
          <div className="relative">
            <button
              aria-expanded={open}
              aria-controls={`section-${id}`}
              onClick={toggle}
              className="flex items-center gap-2"
            >
              {label === "Verse" ? (
                <span className="text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded uppercase hover:bg-primary/20 transition-colors flex items-center gap-1">
                  {"VERSE 1"}
                </span>
              ) : label === "Chorus" ? (
                <Badge variant="accent">Chorus</Badge>
              ) : label === "Intro" ? (
                <Badge variant="muted" className="bg-slate-900/20 text-slate-300 px-2 py-0.5 uppercase">Intro</Badge>
              ) : (
                <Badge variant="muted">{label}</Badge>
              )}

              {/* collapsible arrow (visible on hover of the whole section) */}
              <span
                className={`material-symbols-outlined text-[12px] ml-1 transition-transform opacity-0 group-hover:opacity-100 ${
                  open ? "" : "rotate-180"
                }`}
                aria-hidden
              >
                expand_more
              </span>
            </button>
          </div>
        )}
        <div className="h-px flex-1 bg-slate-200 dark:bg-[#233648] group-hover:bg-slate-300 dark:group-hover:bg-[#344c63] transition-colors" />
      </div>

      <div id={`section-${id}`} className={`${open ? "block" : "hidden"}`}>
        {lines.map((l, i) => (
          <EditorLine key={i} time={l.time} text={l.text} syllables={l.syllables} />
        ))}
      </div>
    </div>
  );
};

export default SectionBlock;
