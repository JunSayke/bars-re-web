## Why

The Editor Workspace's core creative area — the bar input editor — does not yet exist in the frontend. The `/workspaces/editor` route currently renders an empty shell. Without the Write and Edit Bars transaction, users cannot compose rap lyrics, organize them by section (Verse, Chorus, Bridge), see real-time syllable and bar count feedback, or have their work auto-saved. This is the foundational transaction of BARS, and all other editor features (beat player, verse snippets) are secondary to it.

## What Changes

- **New**: `write-and-edit-bars` capability within the `workspace` vertical-slice module
- **New**: `EditorPage` component wired into `app/workspaces/editor/page.tsx` (currently an empty shell)
- **New**: `BarsEditor` organism — the full structured editor with section groups (Verse, Chorus, Bridge), numbered bar input rows, per-section syllable/bar count badges, and a word count indicator
- **New**: `SectionGroup` molecule — collapsible section container (e.g., "VERSE 1", "CHORUS") with section label, associated bar rows, and a syllable/bar count badge
- **New**: `BarInputRow` atom — a single numbered text input row representing one lyric line; supports adding and removing bars
- **New**: `SectionBadge` atom — read-only pill displaying `SYLLABLES: N | BARS: N` computed reactively from the section's bars
- **New**: `AutoSaveStatusIndicator` atom — non-intrusive label reflecting current save state ("Saving…", "Saved", "Save failed")
- **New**: `EditorTopNav` organism — top navigation bar with "Back to Library", editable session name, settings icon, and user avatar
- **New**: `useSaveDraftMutation` hook — PATCH `/sessions/:id/draft` with debounced auto-save and manual trigger
- **New**: `useGetSessionQuery` hook — GET `/sessions/:id` to load session and its bars on mount
- **New**: Zod schema and TypeScript types for `Bar`, `WritingSession`, `SaveDraftPayload`, and `SaveResult`
- **New**: MSW mock handlers for `GET /sessions/:id` and `PATCH /sessions/:id/draft`
- **New**: MSW fixtures for a pre-populated session with Verse 1, Chorus, and Verse 2 sections (matching the UI mockup)
- **New**: `syllable-count` utility — client-side syllable counting for Bisaya/Filipino text

## Capabilities

### New Capabilities

- `write-and-edit-bars`: Core bar editor — numbered input rows organized by section (verse/chorus/bridge), real-time syllable/bar count badges per section via client-side computation, word count guard (1000-word limit) with server-side enforcement on save, debounced auto-save (every 30 s or on idle), auto-save status indicator ("Saving…", "Saved", "Save failed")

### Modified Capabilities

*(none — no existing specs)*

## Impact

- **Routing**: `app/workspaces/editor/page.tsx` currently imports nothing; this change wires it to `EditorPage` from `src/modules/workspace/components/EditorPage.tsx`
- **New module scope**: All new files land under `src/modules/workspace/` — components, hooks, schemas, services, types, mocks
- **Shared mocks**: `src/shared/mocks/browser.ts` and `src/shared/mocks/server.ts` must register the new workspace mock handlers
- **No breaking changes** to existing modules (auth, settings)
- **shadcn/ui dependencies**: `dialog`, `textarea` may be needed depending on future transactions; core editor requires only `input`, `badge`, and `button` which are already available
- **Utility**: A lightweight client-side syllable counter for Bisaya text must be added under `src/shared/lib/` or co-located in the workspace module
