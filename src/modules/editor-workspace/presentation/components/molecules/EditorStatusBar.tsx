import React from "react";

type EditorStatusBarProps = {
  lineCount:    number;
  wordCount:    number;
  sectionCount: number;
};

/**
 * Molecule — the slim status strip at the bottom of the editor showing
 * live line, word, and section counts.
 */
export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  lineCount,
  wordCount,
  sectionCount,
}) => (
  <div className="flex items-center gap-4 px-4 py-1.5 border-t border-[#1a2d3f] bg-[#081016] text-[10px] font-mono text-slate-600 select-none shrink-0">
    <span>{lineCount} line{lineCount !== 1 ? "s" : ""}</span>
    <span>{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
    <span>{sectionCount} section{sectionCount !== 1 ? "s" : ""}</span>
  </div>
);

export default EditorStatusBar;
