## Context

The Workspace module's session service (`src/modules/workspace/services/workspace.service.ts`) currently calls a NestJS REST API at `NEXT_PUBLIC_API_URL` (defaulting to `http://localhost:3001`) for all session CRUD operations. That backend server does not yet exist, leaving the application entirely dependent on MSW mock handlers in development. All session data is currently ephemeral and never persisted.

The auth module already integrates directly with Supabase (`@supabase/supabase-js`) for authentication, establishing a precedent for the frontend calling Supabase without an intermediate REST server. This change extends that pattern to session data persistence.

The Supabase project's `sessions` table and `beat_files` table are the target data store. The connected Supabase project's credentials are already available via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Goals / Non-Goals

**Goals:**
- Replace all five session REST calls (`getSessions`, `getSession`, `createSession`, `renameSession`, `deleteSession`) with Supabase client queries
- Enforce ownership scoping using `supabase.auth.getUser()` so every query is filtered by the authenticated user's UUID
- Enforce the 100-session limit client-side via a `count()` query before `insert`
- Map the Supabase DB representation (snake_case column names, raw `bar_content`) to the existing `SessionSummary` TypeScript type so no UI components require changes
- Keep `saveDraft` on the REST transport (editor-specific operation, deferred to a future change)

**Non-Goals:**
- Building or modifying the NestJS backend
- Modifying any UI component (`SessionCard`, `WorkspacesPage`, `NewSessionDialog`, etc.)
- Migrating `getSession` to Supabase (the editor's full session load remains REST until bar-level operations are ported)
- `saveDraft` and `useGetSessionQuery` are out of scope
- Beat file cleanup on delete — the `beat_files` cascade is handled by a Supabase ON DELETE CASCADE foreign key; no client-side storage cleanup is required in this change

## Decisions

### 1. Extract a dedicated `session.service.ts` rather than editing `workspace.service.ts` in place

**Decision:** Create `src/modules/workspace/services/session.service.ts` containing all Supabase-backed session operations. Keep `workspace.service.ts` for `getSession` and `saveDraft` (REST-only editor operations).

**Rationale:** A single file replacement would create a god-file mixing two transports. Separation makes the boundary explicit: `session.service.ts` = Supabase, `workspace.service.ts` = REST API. The four session hooks are updated to import from `session.service.ts`; the two editor hooks remain pointed at `workspace.service.ts`.

**Alternative considered:** Feature flag (`NEXT_PUBLIC_SESSION_BACKEND=supabase|rest`) to switch transport at runtime. Rejected — adds conditional branching without benefit since there is no reason to keep the REST path for sessions.

---

### 2. Derive `previewSnippet` and `thumbnailType` in the service layer

**Decision:** `previewSnippet` is computed by extracting the first non-empty line from `bar_content` (split by `\n`) and truncating to 100 characters. `thumbnailType` is derived by checking whether a `beat_files` row exists for the session; if so, return `"beat-linked"`, otherwise `"lyrics"`.

**Rationale:** The `SessionSummary` type (consumed by `SessionCard`) expects both fields. The Supabase `sessions` table stores only `bar_content` as raw text and does not have a persisted `thumbnailType` field. Deriving at query time avoids a schema migration and keeps the DB normalized.

**Alternative considered:** Add `thumbnail_type` as a stored enum column. Rejected for this change — unnecessary schema complexity; the `beat_files` join is sufficient and already required for the ERD relationship.

Implementation sketch:
```ts
// In session.service.ts
function toPreviewSnippet(barContent: string | null): string {
  if (!barContent) return ""
  const first = barContent.split("\n").find((l) => l.trim() !== "") ?? ""
  return first.length > 100 ? first.slice(0, 97) + "..." : first
}

function toThumbnailType(hasBeat: boolean): "lyrics" | "beat-linked" {
  return hasBeat ? "beat-linked" : "lyrics"
}
```

---

### 3. Session limit enforced with a client-side `count()` query before `insert`

**Decision:** In `createSession`, call `supabase.from("sessions").select("id", { count: "exact", head: true }).eq("user_id", userId)` before the insert. If `count >= 100`, throw `{ message: "Session limit reached" }` to match the existing error shape consumed by `useCreateSessionMutation`.

**Rationale:** The existing hook already handles `message === "Session limit reached"` for toast display. Using the same error shape means the hook requires no changes. Row Level Security cannot enforce a count-based limit; it must be done in application code.

**Risk:** Race condition if two tabs create sessions simultaneously when count is 99. Acceptable — the scenario is extremely unlikely and a duplicate over the limit does not cause data loss, only a marginal policy breach.

---

### 4. MSW session handlers become development scaffolding only

**Decision:** The existing MSW handlers in `workspace.handlers.ts` that target `${BASE}/sessions*` are retained in the file but are no longer invoked by any hook in production. In development, the handlers remain registered (MSW intercepts the old `localhost:3001` URL pattern) but since `session.service.ts` calls Supabase directly, no `localhost:3001` traffic is generated for session CRUD. The Supabase HTTP calls go to `https://<project>.supabase.co` and are not intercepted.

**Rationale:** MSW handlers are inert once nothing calls the old endpoints. Removing them is a clean-up task deferred to avoid scope creep. Development testing should use the real Supabase dev project with a `.env.local` that is already in place.

**Alternative considered:** Add MSW handlers that intercept `https://<project>.supabase.co/rest/v1/sessions*` for fully offline dev. Rejected — complex to maintain and the Supabase client uses auth headers that MSW would need to allow-list. The real Supabase dev project is the preferred dev environment.

---

### 5. Auth user ID sourced from `supabase.auth.getUser()` — not a stored session

**Decision:** Each service function calls `supabase.auth.getUser()` at invocation time to retrieve the current user's `id`. If the user is not authenticated (`data.user === null`), the function throws `{ message: "Unauthorized" }`.

**Rationale:** Consistent with the auth module pattern. Supabase RLS policies also enforce ownership at the DB level, so even if the client-side check is bypassed, the query returns no rows. Defense in depth.

---

### 6. Column name mapping — snake_case DB → camelCase TypeScript

The Supabase REST API returns column names matching the table definition. The mapping layer lives inside `session.service.ts`:

| DB Column | TypeScript Field | Note |
|---|---|---|
| `id` | `id` | UUID string |
| `user_id` | *(internal, dropped)* | Not in `SessionSummary` |
| `title` | `title` | Direct |
| `topic` | `topic` | Null → empty string |
| `bar_content` | `previewSnippet` | Derived (see Decision 2) |
| `last_modified_at` | `lastModifiedAt` | ISO string |
| *(beat_files join)* | `thumbnailType` | Derived (see Decision 2) |

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Supabase RLS policies not yet configured → all queries return empty / unauthorized | Block implementation on confirming RLS policy `auth.uid() = user_id` is applied to `sessions` and `beat_files` tables before merging |
| `bar_content` format changes break `toPreviewSnippet` | Preview is a display hint only; a malformed preview doesn't break functionality. Unit-test the mapper function. |
| `count()` race condition on session limit | Acceptable — worst case is one extra session over the 100 limit per user. A DB-level check constraint can be added later. |
| Supabase network calls in test environment | Hooks tests using MSW will continue to pass (they test hook behavior with mocked REST responses). Supabase integration tests require a real dev project or PostgREST emulator. |
| `beat_files` join adds latency to `getSessions` | Use a single query with `select("*, beat_files(id)")` rather than N+1. One round-trip for all sessions. |

## Migration Plan

1. **Verify Supabase schema**: Confirm `sessions` and `beat_files` tables exist with correct columns and RLS policies enabled.
2. **Create `session.service.ts`**: Implement and unit-test the new service locally against the dev Supabase project.
3. **Update hooks**: Four hooks (`useSessionsQuery`, `useCreateSessionMutation`, `useRenameSessionMutation`, `useDeleteSessionMutation`) import from the new service.
4. **Remove dead imports**: Remove `getSessions`, `createSession`, `renameSession`, `deleteSession` exports from `workspace.service.ts` barrel (keep `getSession`, `saveDraft`).
5. **Smoke test**: Navigate to `/workspaces`, verify sessions load, create/rename/delete a session end-to-end.
6. **Rollback**: Revert hook imports to `workspace.service.ts` REST functions if Supabase calls fail; the REST functions remain in place until confirmed stable.

## Open Questions

- **RLS policy granularity**: Should `beat_files` have its own RLS policy or inherit from `sessions` via a join? Recommend: separate `auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id)` policy on `beat_files`.
- **`getSession` for the editor**: Should loading a full writing session (bars) also move to Supabase in this change or remain REST? Currently out of scope — confirm with team before tasks are assigned.
- **Offline/optimistic create**: Should `createSession` optimistically add the new session to the list before the Supabase response, or wait for the round-trip? Currently the hook waits (not optimistic). Acceptable for now.
