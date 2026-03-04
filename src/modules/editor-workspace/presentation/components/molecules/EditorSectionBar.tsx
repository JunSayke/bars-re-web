import React from "react";
import { SECTION_DEFS } from "../../../domain/editor.constants";
import type { SectionDef } from "../../../domain/editor.types";

type EditorSectionBarProps = {
  onInsert: (e: React.MouseEvent, def: SectionDef) => void;
};

const SECTION_CLASSES: Record<string, string> = {
  chorus: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
  hook:   "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
  verse:  "bg-primary/10 text-primary hover:bg-primary/20",
  bridge: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
};
const FALLBACK_CLASS = "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20";

/**
 * Molecule — the section-insertion group inside the editor toolbar.
 * Renders one pill button per lyric section type.
 */
export const EditorSectionBar: React.FC<EditorSectionBarProps> = ({ onInsert }) => (
  <>
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1 select-none">
      + Section
    </span>
    {SECTION_DEFS.map((def) => (
      <button
        key={def.type}
        type="button"
        title={`Insert ${def.label}`}
        onMouseDown={(e) => onInsert(e, def)}
        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded transition-colors select-none
          ${SECTION_CLASSES[def.type] ?? FALLBACK_CLASS}`}
      >
        {def.label}
      </button>
    ))}
  </>
);

export default EditorSectionBar;
