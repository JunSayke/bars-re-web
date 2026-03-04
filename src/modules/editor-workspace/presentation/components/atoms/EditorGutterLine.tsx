import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { LINE_HEIGHT_REM } from "../../../domain/editor.constants";

type EditorGutterLineProps = {
  /** 1-based display line number. */
  lineNumber: number;
  /** When true, renders a music note instead of the number. */
  isSectionTag: boolean;
  /** Tailwind text-color class applied when this is a section tag. */
  colorClass: string;
};

/**
 * Atom — a single row inside the line-number gutter.
 * Shows a section icon for tag lines, or the numeric line number otherwise.
 */
export const EditorGutterLine: React.FC<EditorGutterLineProps> = ({
  lineNumber,
  isSectionTag,
  colorClass,
}) => (
  <div
    aria-hidden
    className={`flex items-center justify-end pr-3 font-mono text-xs select-none
      ${isSectionTag ? colorClass : "text-slate-700"}`}
    style={{ height: `${LINE_HEIGHT_REM}rem` }}
  >
    {isSectionTag ? <Icon name="music_note" size={11} /> : lineNumber}
  </div>
);

export default EditorGutterLine;
