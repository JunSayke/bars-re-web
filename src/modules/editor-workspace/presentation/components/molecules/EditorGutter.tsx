import React from "react";
import { GUTTER_WIDTH } from "../../../domain/editor.constants";
import { SECTION_COLORS } from "../../../domain/editor.constants";
import { classifyLine, sectionTypeFromTag } from "../../../application/editorContent.utils";
import { EditorGutterLine } from "../atoms/EditorGutterLine";

type EditorGutterProps = {
  lines:    string[];
  gutterRef:React.RefObject<HTMLDivElement | null>;
};

/**
 * Molecule — the fixed-width line-number gutter column.
 * Scrolls vertically in sync with the textarea (parent drives via ref),
 * but never scrolls horizontally — matching VS Code's behaviour.
 */
export const EditorGutter: React.FC<EditorGutterProps> = ({ lines, gutterRef }) => (
  <div
    ref={gutterRef}
    aria-hidden
    className="shrink-0 overflow-hidden border-r border-[#1a2d3f] bg-[#081016]"
    style={{ width: GUTTER_WIDTH }}
  >
    {lines.map((line, i) => {
      const kind        = classifyLine(line);
      const isSectionTag = kind === "section-tag";
      const sectionType  = isSectionTag ? sectionTypeFromTag(line) : null;
      const colorClass   = sectionType ? SECTION_COLORS[sectionType] : "";

      return (
        <EditorGutterLine
          key={i}
          lineNumber={i + 1}
          isSectionTag={isSectionTag}
          colorClass={colorClass}
        />
      );
    })}
  </div>
);

export default EditorGutter;
