## Context

The editor workspace (`/workspaces/editor`) renders lyrics in `EditorPage`, which uses `EditorShell` as its layout template. `EditorShell` currently supports a `topNav` slot and a scrollable `children` area — there is no bottom-bar slot. The workspace module (`src/modules/workspace/`) follows Vertical Slice architecture: types, hooks, mocks, services, and components live entirely inside the module. All backend interactions are mocked via MSW during development.

The UI reference images show a persistent, full-width dark bar pinned to the bottom of the viewport. It contains:
- Left: file icon + "UPLOAD BEAT" label + acceptable format hint
- Center: skip-back | play/pause | skip-forward transport controls
- Right: BPM badge, timestamp (`MM:SS / MM:SS`), and a seek bar (progress track)

## Goals / Non-Goals

**Goals:**
- Add an optional `bottomBar` slot to `EditorShell` so the beat player can be pinned without altering the existing `children` scroll area.
- Implement `BeatPlayerBar` as an organism inside `src/modules/workspace/components/organisms/`.
- Implement `useBeatPlayer` hook in `src/modules/workspace/hooks/` to manage audio state (file, playback, current time, duration, BPM).
- Implement `useImportBeatMutation` hook that calls `POST /sessions/:id/beat` (mocked via MSW).
- Add MSW mock handler for `POST /sessions/:id/beat` in `src/modules/workspace/mocks/`.
- Wire `BeatPlayerBar` into `EditorPage` as the `bottomBar` of `EditorShell`.
- Match the dark-themed UI shown in the reference images (dark card background, purple primary controls).

**Non-Goals:**
- Real backend integration (Supabase Storage, BPM detection) — mock only.
- Embed audio link input (URL-based) — file upload only in this iteration.
- Replace Beat flow — not required in this first pass.
- Persist beat across page reloads — state is session-scoped in-memory for now.

## Decisions

### Decision 1 — `EditorShell` gets an optional `bottomBar` slot
The `EditorShell` template is the layout owner. Adding a `bottomBar?: ReactNode` prop is a non-breaking, minimal change that keeps layout concerns inside the template and avoids absolute positioning hacks in `EditorPage`. The bottom bar will use `flex-shrink-0` so it never scrolls away.

**Alternative considered:** Position `BeatPlayerBar` with `position: fixed` inside `EditorPage`. Rejected — fixed positioning creates z-index and scroll-offset issues with future panels.

### Decision 2 — `useBeatPlayer` hook owns all audio state
A dedicated hook encapsulates the `HTMLAudioElement` ref, play/pause toggling, seek, time tracking (via `ontimeupdate`), and the uploaded file URL. `BeatPlayerBar` is a controlled presentational organism driven entirely by this hook. This follows the existing hook-per-feature pattern (e.g., `useGetSessionQuery`, `useSaveDraftMutation`).

**Alternative considered:** Inline all state inside `BeatPlayerBar`. Rejected — mixes complex side-effect logic with rendering, violating the hook/component separation the codebase enforces.

### Decision 3 — File input is hidden; the "UPLOAD BEAT" area acts as the trigger
The reference image shows a label/button area that triggers a hidden `<input type="file" accept=".mp3,.wav,.ogg">`. On file selection, `useBeatPlayer` creates a local `URL.createObjectURL` for immediate playback while `useImportBeatMutation` fires the mock POST. This gives instant UI feedback without waiting for an upload round-trip.

### Decision 4 — BPM is mock-hardcoded to 120 in the MSW handler
The real BPM detection runs server-side. For the mock, the handler returns `{ beatUrl: "<blob-url>", bpm: 120 }` unconditionally. The BPM badge renders the returned value; if the server ever returns `null`, the badge switches to a number input (future enhancement, not in this task's scope).

### Decision 5 — Atomic Design placement
- `BeatPlayerBar` → organism (composes multiple molecules/atoms, has its own data-fetching dependency via hook).
- `BeatTransportControls` → molecule (play/pause + skip buttons, no state).
- `BeatProgressBar` → atom (seek slider + timestamp, no state).
- `BpmBadge` → atom (badge with icon, no state).

## Risks / Trade-offs

- **`URL.createObjectURL` memory leak** → The hook cleans up old object URLs via `URL.revokeObjectURL` when a new file is selected or the component unmounts, preventing memory growth.
- **Audio element lifecycle** → The `HTMLAudioElement` is created once via `useRef` and reused. Changing the `src` property and calling `load()` is safe and avoids creating new elements on each file change.
- **`EditorShell` change is shared** → The `bottomBar` prop is optional (`bottomBar?: ReactNode`), so all existing `EditorShell` usages (loading, error states in `EditorPage`) remain unaffected.
