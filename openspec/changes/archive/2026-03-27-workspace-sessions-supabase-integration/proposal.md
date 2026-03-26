## Why

The Workspace module's session service currently calls a NestJS REST API (`NEXT_PUBLIC_API_URL`) that does not yet exist, leaving all session data transactions (list, create, rename, delete) dependent on MSW mocks. Replacing the REST transport layer with direct Supabase client calls — consistent with the pattern already established in the auth module — delivers a working backend for sessions without requiring a separate server, and enables Row Level Security to enforce ownership at the database level.

## What Changes

- `src/modules/workspace/services/workspace.service.ts` — Replace all `fetch`-based REST calls for session operations with `@supabase/supabase-js` client queries against the `sessions` table (and `beat_files` table for delete cleanup). The existing `saveDraft` and editor-only endpoints remain REST until the backend is ready.
- `src/modules/workspace/services/session.service.ts` — New dedicated service file isolating session-specific Supabase operations: `getSessions`, `createSession`, `renameSession`, `deleteSession`, and `getSession`.
- Hooks (`useSessionsQuery`, `useCreateSessionMutation`, `useRenameSessionMutation`, `useDeleteSessionMutation`) — Updated to import from the new Supabase-backed session service.
- `src/modules/workspace/mocks/workspace.handlers.ts` — Session mock handlers remain unchanged (MSW continues to intercept in dev/test); Supabase calls are not made when MSW is active.
- Supabase schema — The `sessions` table and `beat_files` table are expected to exist in the connected Supabase project with RLS policies that enforce `auth.uid() = user_id` for all CRUD operations.

## Capabilities

### New Capabilities

_(none — no new user-visible capabilities are introduced)_

### Modified Capabilities

- `manage-sessions`: Scenarios that reference `/sessions/:id/rename` and `DELETE /sessions/:id` REST endpoints need to be updated to describe Supabase client operations; session count limit enforcement moves from a server-side guard to a client-side `count()` query before insert.
- `create-new-session`: The scenario "Successful session creation" references `POST /sessions`; this is replaced by a Supabase `insert` into the `sessions` table, and the session limit check becomes a Supabase `count()` query.

## Impact

- **Services**: `src/modules/workspace/services/workspace.service.ts` (session operations extracted); new `src/modules/workspace/services/session.service.ts`
- **Hooks**: All four session-related hooks updated to point to the new service
- **Shared config**: `src/shared/config/supabase.ts` already exposes the client — no changes needed
- **Auth dependency**: Session queries require `supabase.auth.getUser()` to retrieve the authenticated user's UUID for `user_id` scoping
- **Database**: Supabase project must have `sessions` table (columns: `id uuid`, `user_id uuid`, `title varchar(200)`, `topic text`, `bar_content text`, `last_modified_at timestamp`) and `beat_files` table (columns: `id uuid`, `session_id uuid`, `storage_path varchar(500)`, `bpm int`, `file_size_bytes int`, `source_type varchar(20)`) with RLS enabled
- **No breaking changes to UI components** — shape of `SessionSummary` returned to hooks/components does not change
