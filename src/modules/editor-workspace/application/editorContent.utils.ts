import type { LineKind, SectionType } from "../domain/editor.types";
import { SECTION_DEFS } from "../domain/editor.constants";

// ─── Format toggle ────────────────────────────────────────────────────────────

/**
 * Wraps the currently selected text inside `ta` with `prefix`/`suffix`.
 * If the selection is already wrapped, it unwraps instead (toggle behaviour).
 * Returns the new textarea value; repositions the caret via rAF.
 */
export function wrapSelection(
  ta: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
): string {
  const { value, selectionStart: s, selectionEnd: e } = ta;
  const selected = value.slice(s, e);
  const before   = value.slice(0, s);
  const after    = value.slice(e);

  if (before.endsWith(prefix) && after.startsWith(suffix)) {
    // Toggle off — unwrap
    requestAnimationFrame(() => {
      ta.selectionStart = s - prefix.length;
      ta.selectionEnd   = e - prefix.length;
    });
    return (
      before.slice(0, before.length - prefix.length) +
      selected +
      after.slice(suffix.length)
    );
  }

  // Toggle on — wrap
  requestAnimationFrame(() => {
    ta.selectionStart = s + prefix.length;
    ta.selectionEnd   = e + prefix.length;
  });
  return before + prefix + selected + suffix + after;
}

// ─── Section tag insertion ────────────────────────────────────────────────────

/**
 * Inserts `tag` at the current cursor position, ensuring it sits on its own
 * line. Returns the new textarea value; moves the caret to after the tag.
 */
export function insertSectionTag(ta: HTMLTextAreaElement, tag: string): string {
  const { value, selectionStart: s } = ta;
  const before = value.slice(0, s);
  const after  = value.slice(s);

  const needsLeading  = before.length > 0 && !before.endsWith("\n");
  const needsTrailing = !after.startsWith("\n");
  const insert = (needsLeading ? "\n" : "") + tag + (needsTrailing ? "\n" : "");

  requestAnimationFrame(() => {
    const pos = s + insert.length;
    ta.selectionStart = pos;
    ta.selectionEnd   = pos;
    ta.focus();
  });

  return before + insert + after;
}

// ─── Line classification ──────────────────────────────────────────────────────

const SECTION_TAG_RE = /^\[(intro|verse|chorus|bridge|outro|hook)[^\]]*\]$/i;

/** Classify a single raw text line. */
export function classifyLine(line: string): LineKind {
  if (line.trim() === "") return "empty";
  if (SECTION_TAG_RE.test(line.trim())) return "section-tag";
  return "lyric";
}

/** Extracts the section type from a tag line such as `[Verse 1]`. */
export function sectionTypeFromTag(line: string): SectionType {
  const match = line.trim().match(/^\[(\w+)/i);
  const key   = match?.[1]?.toLowerCase() ?? "";
  return (SECTION_DEFS.find((d) => d.type === key)?.type ?? "verse") as SectionType;
}
