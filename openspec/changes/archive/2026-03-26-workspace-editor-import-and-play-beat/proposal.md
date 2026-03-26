## Why

The Editor Workspace currently has no way for users to attach a beat to their writing session. Without a beat player, users must context-switch to an external app to play their track while writing bars, breaking their creative flow. Adding beat import and playback directly in the workspace closes this gap and is the last major piece needed to make the editor a self-contained rap-writing environment.

## What Changes

- Introduce an **Import Beat** action in the editor workspace bottom bar that allows users to upload a local audio file (MP3/WAV/OGG, ≤ 20 MB).
- Render a persistent **Audio Player bar** at the bottom of the editor page once a beat is linked to the session, with play/pause, skip back, skip forward, seek bar, timestamp, and BPM badge.
- Display the uploaded file name and accept-format hint in the player's left slot.
- Show an auto-detected BPM badge; if detection returns null, render an editable BPM input.
- Support **Replace Beat** when a beat is already attached to the session.
- All beat upload/playback logic is mocked in development via MSW; no real backend calls are made in this frontend-only phase.

## Capabilities

### New Capabilities
- `import-and-play-beat`: Upload a local audio beat file to the editor session and play it back through a persistent bottom-bar audio player with seek, skip, BPM display, and replace-beat controls.

### Modified Capabilities
<!-- None — no existing spec-level behavior changes in this release. -->

## Impact

- **`src/modules/workspace/`** — new components, hooks, types, mock handlers, and services for beat import and player.
- **`app/workspaces/editor/page.tsx`** — the editor page wires up the new `BeatPlayerBar` at the bottom of the layout.
- **MSW mocks** — `src/modules/workspace/mocks/` gains handlers for `POST /sessions/:id/beat` and `GET /sessions/:id/beat`.
- **No new routes, no shared-layer changes, no breaking changes.**
