## Why

The workspace editor uses fixed `max-w-2xl` and hardcoded `text-sm` sizing that looks cramped on large monitors and overflows on small screens. Users on high-resolution displays waste screen real estate, while users on smaller screens struggle with readability. A zoom control scoped only to the `BarsEditor` component — without affecting the nav, panels, or beat player — gives every user fine-grained control over their writing environment.

## What Changes

- Replace the `EditorShell`'s fixed `max-w-2xl` container with fluid, viewport-relative sizing that adapts to the screen resolution.
- Add a `zoomLevel` state to `EditorPage` (range 70 %–150 %, default 100 %) that is threaded into `BarsEditor` exclusively via a CSS `transform: scale()` or `font-size` override — all other editor regions remain unaffected.
- Expose zoom increment/decrement controls in `EditorTopNav` (e.g., `−` / `+` buttons with a percentage display).
- Persist the chosen zoom level to `localStorage` so it survives page refreshes.
- Bar input text, line numbers, section badges, and the word-count indicator all scale with the zoom level.

## Capabilities

### New Capabilities

- `editor-responsive-layout`: Fluid, viewport-aware max-width and font sizing for the editor shell so content is readable at any screen resolution.
- `bars-editor-zoom`: A user-controlled zoom level (70 %–150 %) scoped exclusively to the `BarsEditor` component, with zoom controls in the top nav and persistence via `localStorage`.

### Modified Capabilities

- `write-and-edit-bars`: The `BarsEditor` rendering environment gains a zoom scale prop; existing bar-editing behaviour (add, remove, paste, section management) is unchanged.

## Impact

- **`EditorShell`** (`src/modules/workspace/components/templates/EditorShell.tsx`): `max-w-2xl` → fluid responsive class; viewport-breakpoint padding.
- **`BarsEditor`** (`src/modules/workspace/components/organisms/BarsEditor.tsx`): Accepts a `zoomScale` prop; wraps content in a scaled container.
- **`EditorTopNav`** (`src/modules/workspace/components/organisms/EditorTopNav.tsx`): Gains zoom control UI (two icon buttons + percentage label).
- **`EditorPage`** (`src/modules/workspace/components/EditorPage.tsx`): Manages `zoomLevel` state, reads/writes `localStorage`, passes `zoomScale` to `BarsEditor` and zoom handlers to `EditorTopNav`.
- No new dependencies; uses only Tailwind CSS 4 utilities and browser `localStorage` API.
