import React from "react";
import type { FormatDef, SectionDef } from "../../../domain/editor.types";
import { EditorFormatBar } from "./EditorFormatBar";
import { EditorSectionBar } from "./EditorSectionBar";

type EditorToolbarProps = {
  onFormat:       (e: React.MouseEvent, fmt: FormatDef) => void;
  onInsertSection:(e: React.MouseEvent, def: SectionDef) => void;
};

/**
 * Molecule — combines the format group and the section-insert group into
 * the single toolbar strip rendered above the editor body.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormat,
  onInsertSection,
}) => (
  <div className="flex items-center gap-1 px-3 py-2 border-b border-[#233648] bg-[#0a1520] flex-wrap gap-y-1.5 shrink-0">
    <EditorFormatBar onFormat={onFormat} />
    <span className="w-px h-5 bg-[#233648] mx-1 shrink-0" />
    <EditorSectionBar onInsert={onInsertSection} />
  </div>
);

export default EditorToolbar;
