// ─── Editor Domain Types ─────────────────────────────────────────────────────

export type SectionType =
  | "intro"
  | "verse"
  | "chorus"
  | "bridge"
  | "outro"
  | "hook";

export type LineKind = "section-tag" | "lyric" | "empty";

export type FormatDef = {
  icon: string;
  label: string;
  prefix: string;
  suffix: string;
  shortcut?: string;
};

export type SectionDef = {
  type: SectionType;
  label: string;
};
