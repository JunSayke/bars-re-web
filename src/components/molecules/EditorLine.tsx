"use client";
import React, { useRef } from "react";

type EditorLineProps = {
  time?: string;
  text?: string;
  syllables?: number;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const EditorLine: React.FC<EditorLineProps> = ({
  time = "--:--",
  text = "",
  syllables,
  placeholder,
  onChange,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const setCaretToEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const handleInput = () => {
    if (!ref.current) return;
    // sanitize: collapse newlines into spaces so the cell is always one line
    const raw = ref.current.innerText;
    const sanitized = raw.replace(/\r?\n+/g, " ").trimStart();
    if (sanitized !== raw) {
      ref.current.innerText = sanitized;
      // move caret to end after replacing content
      setCaretToEnd(ref.current);
    }

    if (onChange) onChange(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // prevent Enter from inserting new lines; keep cell single-line
    if (e.key === "Enter") {
      e.preventDefault();
      // optionally blur the field to indicate submission
      if (ref.current) ref.current.blur();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\r?\n+/g, " ");
    // insert text at caret
    document.execCommand("insertText", false, text);
    // trigger input handling
    setTimeout(handleInput, 0);
  };

  const { showTimestamps, showSyllables } = (() => {
    try {
      // lazy import to keep component SSR-safe when context isn't available
      const mod = require("@/contexts/settings");
      return mod.useSettings() as ReturnType<typeof mod.useSettings>;
    } catch (e) {
      return { showTimestamps: true, showSyllables: true } as const;
    }
  })();

  return (
    <div className={`editor-line ${className}`}>
      {showTimestamps ? (
        <div className="text-xs text-slate-400 font-mono w-12 text-right opacity-40 select-none pt-1">{time}</div>
      ) : (
        <div className="w-12" />
      )}

      <div className="flex-1">
        <div
          ref={ref}
          className={`relative z-10 text-base leading-6 text-slate-300 font-normal editable-text focus:outline-none ${
            text ? "" : "text-slate-500"
          }`}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        >
          {text}
        </div>

        {/* small circular syllable pill aligned with line */}
        {/* align pill vertically with timestamp (use same top offset) */}
        {showSyllables ? (
          <div className="absolute right-0 top-1">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#0f1720]/60 text-[11px] font-medium text-slate-200 select-none border border-slate-700" title="Syllables">
              {typeof syllables === "number" ? syllables : "--"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EditorLine;
