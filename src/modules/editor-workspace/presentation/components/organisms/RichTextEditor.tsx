"use client";
import React from "react";
import { LINE_HEIGHT_REM } from "../../../domain/editor.constants";
import { useEditorContent } from "../../hooks/useEditorContent";
import { EditorToolbar } from "../molecules/EditorToolbar";
import { EditorGutter } from "../molecules/EditorGutter";
import { EditorStatusBar } from "../molecules/EditorStatusBar";

export type RichTextEditorProps = {
  className?: string;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ className = "" }) => {
  const {
    value, setValue,
    taRef, gutterRef,
    lines, wordCount, sectionCount,
    syncScroll, applyFormat, insertSection, handleKeyDown,
  } = useEditorContent();

  return (
    <div className={`flex flex-col rounded-xl border border-[#233648] bg-[#0d1b2a] overflow-hidden ${className}`}>

      {/* Toolbar */}
      <EditorToolbar
        onFormat={(e, fmt) => applyFormat(e, fmt.prefix, fmt.suffix)}
        onInsertSection={insertSection}
      />

      {/* Editor body: gutter + textarea */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: "520px" }}>

        {/* Gutter â€” fixed width, vertical scroll synced, never scrolls horizontally */}
        <EditorGutter lines={lines} gutterRef={gutterRef} />

        {/* Textarea â€” no soft-wrap (VS Code behaviour), independent horizontal scroll */}
        <textarea
          ref={taRef}
          value={value}
          wrap="off"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck
          className="flex-1 resize-none bg-transparent text-slate-200 caret-primary font-mono text-sm outline-none overflow-auto"
          style={{
            lineHeight:    `${LINE_HEIGHT_REM}rem`,
            paddingTop:    "0.125rem",
            paddingBottom: "0.125rem",
            paddingLeft:   "1rem",
            paddingRight:  "1rem",
            // Prevent textarea from ever wrapping lines (belt-and-suspenders alongside wrap="off")
            whiteSpace: "pre",
          }}
        />
      </div>

      {/* Status bar */}
      <EditorStatusBar
        lineCount={lines.length}
        wordCount={wordCount}
        sectionCount={sectionCount}
      />
    </div>
  );
};

export default RichTextEditor;

