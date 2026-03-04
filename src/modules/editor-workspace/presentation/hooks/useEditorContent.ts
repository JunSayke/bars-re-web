"use client";
import { useState, useRef, useCallback } from "react";
import { FORMAT_TOOLBAR, INITIAL_VALUE, NUMBERED_TYPES, SECTION_DEFS } from "../../domain/editor.constants";
import type { SectionDef, SectionType } from "../../domain/editor.types";
import { classifyLine, insertSectionTag, wrapSelection } from "../../application/editorContent.utils";

// Per-instance section counters (verse 1, verse 2, …) stored in a ref so they
// are stable across renders but isolated to each editor instance.
function makeCounters(): Record<SectionType, number> {
  return { intro: 0, verse: 0, chorus: 0, bridge: 0, outro: 0, hook: 0 };
}

export function useEditorContent() {
  const [value, setValue] = useState(INITIAL_VALUE);
  const taRef      = useRef<HTMLTextAreaElement>(null);
  const gutterRef  = useRef<HTMLDivElement>(null);
  const counters   = useRef(makeCounters());

  // ── Scroll sync (vertical only — gutter never scrolls horizontally) ──────

  const syncScroll = useCallback(() => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  }, []);

  // ── Apply inline format (wrap / unwrap selection) ─────────────────────────

  const applyFormat = useCallback((e: React.MouseEvent, prefix: string, suffix: string) => {
    e.preventDefault(); // prevent textarea losing focus
    const ta = taRef.current;
    if (!ta) return;
    setValue(wrapSelection(ta, prefix, suffix));
  }, []);

  // ── Insert section tag ────────────────────────────────────────────────────

  const insertSection = useCallback((e: React.MouseEvent, def: SectionDef) => {
    e.preventDefault();
    const ta = taRef.current;
    if (!ta) return;
    counters.current[def.type] += 1;
    const count = counters.current[def.type];
    const tag = NUMBERED_TYPES.includes(def.type)
      ? `[${def.label} ${count}]`
      : `[${def.label}]`;
    setValue(insertSectionTag(ta, tag));
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const fmt = FORMAT_TOOLBAR.find((f) => f.shortcut === e.key.toLowerCase());
    if (!fmt) return;
    e.preventDefault();
    const ta = taRef.current;
    if (!ta) return;
    setValue(wrapSelection(ta, fmt.prefix, fmt.suffix));
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const lines        = value.split("\n");
  const wordCount    = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const sectionCount = lines.filter((l) => classifyLine(l) === "section-tag").length;

  return {
    value,
    setValue,
    taRef,
    gutterRef,
    lines,
    wordCount,
    sectionCount,
    syncScroll,
    applyFormat,
    insertSection,
    handleKeyDown,
  };
}
