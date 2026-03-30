## Why

The current Beat Player Bar only supports uploading local audio files (MP3/WAV/OGG). Users want to compose lyrics while listening to beats discovered on Spotify — without downloading files. Adding a Spotify link embed option makes the workflow faster and covers the use case of streaming-only beats.

## What Changes

- Add a **"Embed Link"** tab/toggle to the Beat Player import flow alongside the existing file upload option
- Render a **Spotify embed player** (via Spotify's oEmbed iframe) in the workspace once a valid Spotify link is submitted
- Validate that a submitted URL is a recognized Spotify track/playlist/album link before persisting
- Introduce a **`beat_links`** Supabase table to persist embedded link references (mirroring the `beat_files` table pattern) with `session_id`, `url`, `provider`, and `bpm`
- **Replace the `Library` panel** in the `WorkspaceWindowMenu` (bottom-right checkbox menu) with a new **`Beat Link`** panel that houses the link input UI
- When a beat link is active, the `BeatPlayerBar` renders the Spotify embed iframe instead of the custom HTML5 audio player

## Capabilities

### New Capabilities
- `beat-link-embed`: Embed an external Spotify link as the session's active beat source; persist link metadata in the new `beat_links` table; render a Spotify embed iframe in the workspace

### Modified Capabilities
- `import-and-play-beat`: The import flow gains a second source mode (link embed) alongside file upload — the existing file-upload path is unchanged, but the UI is extended to toggle between "Upload File" and "Embed Link"

## Impact

- **`src/modules/workspace/components/organisms/BeatPlayerBar.tsx`** — add "Embed Link" mode; conditionally render Spotify iframe instead of the HTML5 player when a link beat is active
- **`src/modules/workspace/components/organisms/WorkspaceWindowMenu.tsx`** — replace `library` panel option with `beat-link`
- **`src/modules/workspace/components/EditorPage.tsx`** — wire up the new `beat-link` panel state and the link-embed hook
- **`src/modules/workspace/hooks/`** — new `useBeatLinkEmbed` hook to handle link submission, validation, and persistence
- **`src/modules/workspace/services/`** — new `beatLinkService` to POST link data to Supabase `beat_links`
- **`src/modules/workspace/schemas/`** — Zod schema for Spotify URL validation
- **`supabase/migrations/`** — new migration for the `beat_links` table
- **Dependencies**: No new npm packages needed — Spotify embed is a plain `<iframe>` via oEmbed; URL validation is pure Zod/regex
