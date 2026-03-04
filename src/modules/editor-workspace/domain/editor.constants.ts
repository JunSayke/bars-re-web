import type { FormatDef, SectionDef, SectionType } from "./editor.types";

// ─── Toolbar definitions ──────────────────────────────────────────────────────

export const FORMAT_TOOLBAR: FormatDef[] = [
  { icon: "format_bold",       label: "Bold",          prefix: "**",   suffix: "**",   shortcut: "b" },
  { icon: "format_italic",     label: "Italic",        prefix: "*",    suffix: "*",    shortcut: "i" },
  { icon: "format_underlined", label: "Underline",     prefix: "<u>",  suffix: "</u>", shortcut: "u" },
  { icon: "strikethrough_s",   label: "Strikethrough", prefix: "~~",   suffix: "~~" },
];

export const SECTION_DEFS: SectionDef[] = [
  { type: "intro",  label: "Intro"  },
  { type: "verse",  label: "Verse"  },
  { type: "chorus", label: "Chorus" },
  { type: "bridge", label: "Bridge" },
  { type: "outro",  label: "Outro"  },
  { type: "hook",   label: "Hook"   },
];

/** Section types that auto-increment a numeric suffix (e.g. "Verse 1", "Verse 2"). */
export const NUMBERED_TYPES: SectionType[] = ["verse", "chorus", "bridge", "hook"];

// ─── Visual config ────────────────────────────────────────────────────────────

export const SECTION_COLORS: Record<SectionType, string> = {
  intro:  "text-slate-400",
  verse:  "text-primary",
  chorus: "text-indigo-400",
  bridge: "text-amber-400",
  outro:  "text-slate-400",
  hook:   "text-indigo-400",
};

// ─── Initial placeholder content ─────────────────────────────────────────────

export const INITIAL_VALUE =
  "[Intro]\n" +
  "Yeah, woke up early, sun is shining bright\n" +
  "Chasing dreams, gotta make it right\n" +
  "\n" +
  "[Verse 1]\n" +
  "Walking down the street, feeling the heat\n" +
  "Heart pumping fast to the rhythm of the beat\n" +
  "Bisaya rap flow, dili na mapugngan\n" +
  "Padayon lang, walay atrasan\n" +
  "\n" +
  "[Chorus]\n" +
  "Every word I spit, pure fire and soul\n" +
  "Reaching for the top, that is the goal\n";

// ─── Gutter layout ────────────────────────────────────────────────────────────

/** Fixed pixel width of the line-number gutter column. */
export const GUTTER_WIDTH = 52; // px

/** Line height shared between gutter rows and the textarea. */
export const LINE_HEIGHT_REM = 1.625; // rem
