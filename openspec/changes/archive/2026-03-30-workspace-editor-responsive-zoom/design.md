## Context

The workspace editor currently renders `BarsEditor` inside an `EditorShell` template that hardcodes `max-w-2xl` (42 rem) and relies on Tailwind's `text-sm` base size applied inside `BarInputRow`. On wide monitors (≥ 2560 px) the writing column feels narrow and text is small. On compact screens (< 768 px) horizontal padding crowds the content. There is also no mechanism for users to adjust text size within the writing area independently of the rest of the editor UI.

The `EditorPage` is the single Client Component that owns all editor state — bars, beat, snippets, and panel visibility. `EditorTopNav` is a thin presentational organism that currently only exposes a settings button. The zoom control fits naturally there without requiring a new organism.

## Goals / Non-Goals

**Goals:**
- Make the `EditorShell` main column fluid so it uses available horizontal space on any screen size, governed by sensible breakpoint-based max-widths from the Tailwind responsive scale.
- Add a `zoomLevel` state (integer, 70–150, step 5) in `EditorPage` and pass `zoomScale` (the fraction `zoomLevel / 100`) only to `BarsEditor`.
- Apply the zoom as a CSS `font-size` multiplier on `BarsEditor`'s root element so all relative (`em`/`rem`-derived) child sizing scales naturally, without affecting sibling organisms (`BeatPlayerBar`, `EditorTopNav`, panels).
- Persist `zoomLevel` to `localStorage` under the key `bars:editorZoom` so the preference survives navigation and page refresh.
- Expose `−` / `+` controls plus a percentage readout inside `EditorTopNav`; these call back into `EditorPage` state.

**Non-Goals:**
- Zooming the `ThesaurusPanel`, `SnippetsPanel`, `AiAssistantPanel`, `BeatPlayerBar`, or `EditorTopNav`.
- Per-session zoom persistence in Supabase (localStorage is sufficient).
- Pinch-to-zoom gesture support.
- Changes to any bar-editing logic (add/remove/paste/section management).
- Full-screen or focus modes.

## Decisions

### Decision 1 — Fluid layout via responsive Tailwind classes

**Choice:** Replace `max-w-2xl` with `max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl` and a matching responsive `px` scale (`px-4 sm:px-6 lg:px-10`).

**Alternatives considered:**
- *CSS `clamp()`* — more precise but requires a custom property in `globals.css`; Tailwind responsive classes achieve the same without introducing new global CSS.
- *Full-width (`max-w-full`)* — makes lines very long on ultrawide displays, hurting readability; breakpoint steps provide a better reading experience.

### Decision 2 — Font-size multiplier for zoom

**Choice:** Apply `style={{ fontSize: \`\${zoomScale}rem\` }}` on `BarsEditor`'s root `<div>`, setting the root em context for all descendant text. All `text-sm`, `text-xs` classes inside the component are relative to this base, so they scale uniformly.

**Alternatives considered:**
- *`transform: scale(zoomScale)`* — simpler to apply but doesn't reflow content; bar row height and input widths stay fixed, causing overflow at high zoom.
- *Custom CSS variable* — more architectural but the scope here is a single component; inline style is minimal and clear.

### Decision 3 — Zoom state lives in EditorPage

**Choice:** `zoomLevel` state lives in `EditorPage`, read from `localStorage` on mount, written on every change. It is passed down as `zoomScale` prop to `BarsEditor` and as `onZoomIn` / `onZoomOut` / `zoomLevel` props to `EditorTopNav`.

**Alternatives considered:**
- *Context / Zustand store* — over-engineered for a single-component preference that doesn't cross module boundaries.
- *State inside `EditorTopNav`* — would require prop-drilling `zoomScale` up to siblings; EditorPage is the correct owner.

### Decision 4 — Zoom controls placement in EditorTopNav

**Choice:** Add two icon-button atoms (`−` / `+`) and a `span` showing `{zoomLevel}%` between the title and the settings button in `EditorTopNav`. Props: `zoomLevel: number`, `onZoomIn: () => void`, `onZoomOut: () => void`.

**Why:** The top nav is visible at all times and expected location for editor-level controls. No new organism needed — three extra props on an existing one.

## Risks / Trade-offs

- **Subpixel rendering at non-100% zoom** → Text may look slightly blurry at fractional scales on some GPU renderers. Mitigation: restrict steps to multiples of 10 and cap range 50–200; most values land on clean pixel boundaries at common DPIs. *(Note: initial design proposed 70–150 / step 5; the final implementation uses 50–200 / step 10 to give users a wider range with fewer button taps.)*
- **EditorShell widening may feel different for existing users** → The writing column will be wider by default on large screens. Mitigation: `max-w-2xl` is retained as the minimum (`sm`) breakpoint, preserving the current experience on small/medium screens.
- **localStorage availability** → SSR-safe read: initialise state with default (100), then hydrate from localStorage in a `useEffect` to avoid hydration mismatch.
