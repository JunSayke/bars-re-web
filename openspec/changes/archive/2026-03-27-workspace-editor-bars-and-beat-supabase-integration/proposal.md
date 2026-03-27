## Why

The Editor Workspace's two most critical runtime operations — saving bar edits and uploading a beat — still hit a NestJS REST API that does not exist, meaning every lyric edit is lost on page reload and beat uploads are mock-only. Replacing both REST transports with direct Supabase client calls (consistent with the pattern established in the sessions and auth modules) delivers live persistence for writers without requiring a separate backend server.

## What Changes

- `src/modules/workspace/services/workspace.service.ts` — Remove `getSession` and `saveDraft` REST functions; replace with Supabase-backed equivalents in a new dedicated service.
- `src/modules/workspace/services/editor.service.ts` — **New file.** Contains `getSession(sessionId)` (Supabase `SELECT` on `sessions` + `beat_files` join) and `saveDraft(sessionId, bars)` (Supabase `UPDATE sessions SET bar_content = …, last_modified_at = now()` scoped to the authenticated user).
- `src/modules/workspace/services/beat.service.ts` — **New file.** Contains `uploadBeat(sessionId, file)` (Supabase Storage upload to `beats/` bucket + `INSERT INTO beat_files`) and `deleteBeat(beatFileId, storagePath)` (Supabase Storage remove + `DELETE FROM beat_files`). Replaces the inline `fetch`-based function in `useImportBeatMutation.ts`.
- `src/modules/workspace/hooks/useGetSessionQuery.ts` — Updated to import `getSession` from `editor.service.ts`. The returned `WritingSession` type is extended to carry optional beat metadata (`beatFileId`, `beatStorageUrl`, `bpm`, `fileName`) so the editor can hydrate `useBeatPlayer` on mount.
- `src/modules/workspace/hooks/useSaveDraftMutation.ts` — Updated to import `saveDraft` from `editor.service.ts`.
- `src/modules/workspace/hooks/useImportBeatMutation.ts` — Updated to call `uploadBeat` from `beat.service.ts` instead of the inline REST function; also triggers a `beat` query invalidation so the session's beat metadata refreshes.
- `src/modules/workspace/schemas/workspace.schema.ts` — `writingSessionSchema` gains an optional `beat` sub-object (`{ beatFileId, beatStorageUrl, bpm, fileName }`).
- `src/modules/workspace/mocks/workspace.handlers.ts` — Handlers for `GET /sessions/:id` and `PATCH /sessions/:id/draft` remain (MSW is inert for Supabase calls); no new handlers required.
- `src/shared/config/database.types.ts` — Already contains `sessions` and `beat_files` table types from the previous integration; no schema changes needed.

## Capabilities

### New Capabilities

_(none — no new user-facing capabilities are introduced)_

### Modified Capabilities

- `write-and-edit-bars`: Auto-save scenarios that reference `PATCH /sessions/:id/draft` REST endpoint need updating to describe a Supabase `UPDATE` on `sessions.bar_content`; the session-load scenario needs updating to describe a Supabase `SELECT` rather than a REST `GET`.
- `import-and-play-beat`: The "Successful beat file upload" scenario currently references a REST mock endpoint (`POST /sessions/:id/beat`); it needs updating to describe Supabase Storage upload + `beat_files` insert. The "BPM badge uses mock value during development" scenario is deprecated — BPM is now stored as `null` on first upload (auto-detection is deferred) and the mock handler is no longer in the code path.

## Impact

- **Services**: `workspace.service.ts` loses `getSession` and `saveDraft`; new `editor.service.ts` and `beat.service.ts` added under `src/modules/workspace/services/`
- **Hooks**: `useGetSessionQuery`, `useSaveDraftMutation`, `useImportBeatMutation` updated to point at new service functions
- **Schema / Types**: `WritingSession` schema extended with optional `beat` field; no breaking changes to existing consumers (field is optional)
- **Supabase Storage**: Requires a `beats` storage bucket in the connected Supabase project with RLS allowing authenticated users to upload/delete only objects prefixed with their `user_id`
- **Auth dependency**: `editor.service.ts` and `beat.service.ts` call `supabase.auth.getUser()` to scope all mutations to the authenticated user
- **No UI component changes** — `BarsEditor`, `BeatPlayerBar`, `EditorPage` are unchanged in rendering; `EditorPage` gains a `useEffect` to seed `useBeatPlayer` with the beat loaded from `getSession`
