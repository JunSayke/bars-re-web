import React from "react";
import { Icon } from "@/components/atoms/Icon";

type EditorToolbarButtonProps = {
  icon: string;
  label: string;
  onMouseDown: (e: React.MouseEvent) => void;
};

/**
 * Atom — a single icon button used inside the editor toolbar.
 * Uses `onMouseDown` (not `onClick`) so the textarea never loses focus.
 */
export const EditorToolbarButton: React.FC<EditorToolbarButtonProps> = ({
  icon,
  label,
  onMouseDown,
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onMouseDown={onMouseDown}
    className="flex items-center justify-center w-7 h-7 rounded transition-colors text-slate-400 hover:text-slate-200 hover:bg-white/5"
  >
    <Icon name={icon} size={16} />
  </button>
);

export default EditorToolbarButton;
