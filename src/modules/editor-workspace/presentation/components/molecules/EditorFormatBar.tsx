import React from "react";
import { FORMAT_TOOLBAR } from "../../../domain/editor.constants";
import type { FormatDef } from "../../../domain/editor.types";
import { EditorToolbarButton } from "../atoms/EditorToolbarButton";

type EditorFormatBarProps = {
  onFormat: (e: React.MouseEvent, fmt: FormatDef) => void;
};

/**
 * Molecule — the format-action group inside the editor toolbar
 * (Bold, Italic, Underline, Strikethrough).
 */
export const EditorFormatBar: React.FC<EditorFormatBarProps> = ({ onFormat }) => (
  <>
    {FORMAT_TOOLBAR.map((f) => (
      <EditorToolbarButton
        key={f.label}
        icon={f.icon}
        label={`${f.label}${f.shortcut ? ` (Ctrl+${f.shortcut.toUpperCase()})` : ""}`}
        onMouseDown={(e) => onFormat(e, f)}
      />
    ))}
  </>
);

export default EditorFormatBar;
