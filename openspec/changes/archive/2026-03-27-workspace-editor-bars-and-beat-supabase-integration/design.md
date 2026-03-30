## Context

The Editor Workspace module (`src/modules/workspace/`) has two outstanding REST-dependent operations: the bar editor loads and saves bars via `GET /sessions/:id` and `PATCH /sessions/:id/draft` (both in `workspace.service.ts`), and beat upload fires a `POST /sessions/:id/beat` (inline in `useImportBeatMutation.ts`). All three call a NestJS server at `NEXT_PUBLIC_API_URL` that does not exist yet, so bar edits are lost on page reload and beat uploads only work against MSW mocks.

The Supabase project already has the necessary schema from the previous `workspace-sessions-supabase-integration` change:
- `sessions` table: `id`, `user_id`, `title`, `topic`, `bar_content text`, `last_modified_at`, `created_at`
- `beat_files` table: `id`, `session_id`, `storage_path`, `bpm int`, `file_size_bytes`, `source_type`, with `ON DELETE CASCADE` on `session_id`
- `database.types.ts` reflects both tables with full TypeScript types

The `supabase` client singleton is available from `@/shared/config/supabase` and is already typed against `Database`. The auth module and session service already establish the pattern for calling `supabase.auth.getUser()` to scope operations to the authenticated user.

## Goals / Non-Goals

**Goals:**
- Replace `getSession` REST call with Supabase `SELECT` on `sessions` joined to `beat_files`, returning bars and beat metadata in one query
- Replace `saveDraft` REST call with Supabase `UPDATE sessions SET bar_content = …, last_modified_at = …` filtered by the authenticated user's `user_id`
- Replace inline REST beat upload in `useImportBeatMutation` with Supabase Storage upload to a `beats` bucket followed by `INSERT INTO beat_files`
- Persist beat metadata across page reloads — `getSession` returns the linked beat (storage URL, BPM, file name) so `EditorPage` can seed the beat player on mount
- Follow the layered service extraction pattern established by `session.service.ts`: extract editor and beat operations into dedicated service files

**Non-Goals:**
- Server-side BPM auto-detection — `bpm` is stored as `null` on first upload; manual entry remains a future enhancement
- Embed audio link / URL-based beat import — file upload only
- Replace Beat flow (replacing an already-uploaded beat) — deferred
- Offline / local-first `bar_content` caching (IndexedDB)
- Modifying any UI component below `EditorPage` — `BarsEditor`, `BeatPlayerBar`, atoms/molecules/organisms are unchanged

## Decisions

### D1 — Extract `editor.service.ts` and `beat.service.ts` rather than editing `workspace.service.ts` in place

**Decision:** Create `src/modules/workspace/services/editor.service.ts` (owns `getSession` and `saveDraft` using Supabase) and `src/modules/workspace/services/beat.service.ts` (owns `uploadBeat` and `deleteBeat` using Supabase Storage). `workspace.service.ts` becomes an empty shell and is deleted.

**Rationale:** Consistent with the `session.service.ts` extraction in the previous change. Two services with distinct concerns (bar persistence vs. audio file storage) are easier to test and maintain than a single file mixing both. Naming by concern (`editor`, `beat`) rather than transport makes the boundary self-documenting.

**Alternative considered:** A single `editor.service.ts` owning all three operations. Rejected — beat storage (Supabase Storage SDK) and bar persistence (Supabase DB SDK) are sufficiently different that co-location would produce a god-service.

---

### D2 — `bar_content` is stored as a JSON string of the full `Bar[]` array

**Decision:** `saveDraft` serializes the `Bar[]` array to `JSON.stringify(bars)` before writing to `sessions.bar_content`. `getSession` deserializes with `JSON.parse(barContent ?? "[]")`, validating with the Zod `barSchema` array to reject malformed data. If parsing fails, the function returns an empty bars array and logs a warning.

**Rationale:** The Supabase `sessions` table already has a `bar_content text` column. Full-array replacement (not a diff) keeps the semantics identical to the existing `PATCH /sessions/:id/draft` REST contract — the client sends the full state, the server overwrites. No migration is needed.

**Alternative considered:** Store bars in a separate `bars` table with individual row `INSERT`/`UPDATE`/`DELETE` per bar edit. Rejected for this change — normalized bar storage requires transactions and a schema migration; the text column is sufficient for the current word-limit scale (≤ 1000 words).

---

### D3 — Beat storage path pattern and bucket configuration

**Decision:** Files are uploaded to the `beats` Supabase Storage bucket using the path `{userId}/{sessionId}/{timestamp}-{sanitizedFileName}`. The bucket is configured with `public = false` (private). Beat playback URLs are generated via `supabase.storage.from("beats").createSignedUrl(storagePath, 3600)` (1-hour TTL) at session load time.

**Rationale:** User-scoped paths (`{userId}/…`) allow a simple RLS policy: `(storage.foldername(name))[1] = auth.uid()::text`. Signed URLs keep audio files private to the owner. A 1-hour TTL is sufficient for a single editing session; the URL refreshes on the next `getSession` call.

**Alternative considered:** Public bucket with no signed URLs. Rejected — audio files are user-created content and should not be publicly accessible by URL guessing.

**Alternative considered:** Direct URL stored as a column in `beat_files`. Rejected — signed URLs expire; storing the `storage_path` and generating a fresh signed URL at query time is correct.

---

### D4 — `WritingSession` schema extended with optional `beat` sub-object

**Decision:** `writingSessionSchema` gains an optional `beat` field:
```ts
beat: z.object({
  beatFileId: z.string(),
  beatStorageUrl: z.string(),
  bpm: z.number().nullable(),
  fileName: z.string(),
}).nullable().optional()
```
`getSession` populates `beat` from the `beat_files` join (first row if multiple exist). `EditorPage` passes `beat` to `useBeatPlayer` via a new `loadUrl(url, metadata)` method called in a `useEffect` on initial mount.

**Rationale:** Extending the existing `WritingSession` type is non-breaking (the field is optional) and allows the already-implemented `EditorPage` → `useBeatPlayer` path to rehydrate without new prop drilling. Consumers that do not use `beat` are unaffected.

**Alternative considered:** A separate `useGetBeatQuery(sessionId)` hook that fetches beat data independently. Rejected — adds a second network round-trip on mount and requires coordinating two loading states in `EditorPage`.

---

### D5 — `useBeatPlayer` gains a `loadUrl` method alongside the existing `loadFile`

**Decision:** Add `loadUrl(url: string, metadata: { fileName: string; bpm: number | null }): void` to the `useBeatPlayer` hook. This method sets the `HTMLAudioElement`'s `src` directly (no object URL) and updates the hook's internal state. `loadFile` continues to work as before for new uploads.

**Rationale:** Persisted beats come back as storage URLs, not `File` objects. Rather than simulating a `File`, a `loadUrl` variant keeps the hook's interface honest and avoids a redundant HTTP fetch just to turn a URL back into a `File`.

**Alternative considered:** Always fetch the URL to a `Blob` and then create an object URL. Rejected — unnecessary bytes-over-the-wire for a URL the browser can play natively.

---

### D6 — `BpmBadge` atom updated to accept `bpm: number | null`

**Decision:** Change `BpmBadge`'s `bpm` prop type from `number` to `number | null`. When `null`, render "-- BPM" as a placeholder. This is a non-breaking change — the only call site (`BeatPlayerBar`) currently passes the mock-hardcoded `120`; after this change it passes the value from the hook.

**Rationale:** Supabase `beat_files.bpm` is nullable (BPM auto-detection is deferred). The UI must handle a null BPM gracefully.

---

### D7 — MSW handlers for REST editor endpoints are retained but inert

**Decision:** `workspace.handlers.ts` keeps the `GET /sessions/:id` and `PATCH /sessions/:id/draft` handlers. They are no longer called by any hook but remain as scaffolding. The `POST /sessions/:id/beat` handler is also retained. Supabase calls go directly to `https://<project>.supabase.co` and bypass MSW.

**Rationale:** Consistent with Decision 4 from the sessions integration change. Removing inert handlers is a cleanup task deferred to avoid scope creep. The Supabase dev project is the development environment for all integration-level work.

## Risks / Trade-offs

- **`bar_content` JSON parse failure** → `getSession` wraps `JSON.parse` in a try/catch; on failure returns `bars: []` and logs a `console.warn`. The editor opens empty, and the next auto-save overwrites the corrupted data.
- **Signed URL expiry mid-session** → URLs are 1-hour TTL. If a user keeps the editor open for more than an hour, beat playback fails silently when the URL expires. Mitigation: future work to refresh the URL on re-focus; acceptable for current scope.
- **Storage upload failure leaves orphaned `beat_files` row** → `uploadBeat` inserts the `beat_files` row only after a successful storage upload. If the DB insert fails after storage succeeds, the file becomes an orphan. Mitigation: a Supabase Storage lifecycle policy can clean up unreferenced files; for MVP, the user can re-upload.
- **`useBeatPlayer` `loadUrl` called on every session re-fetch** → `EditorPage` must gate the `loadUrl` call with a `useEffect` dependency on `session?.beat?.beatFileId` to avoid re-setting the audio source on unrelated re-renders (e.g., auto-save completion).

## Migration Plan

1. **Supabase Storage bucket:** Create a private `beats` bucket in the Supabase project. Set the RLS storage policy: `CREATE POLICY "Users can manage their own beats" ON storage.objects FOR ALL TO authenticated USING ((storage.foldername(name))[1] = auth.uid()::text) WITH CHECK ((storage.foldername(name))[1] = auth.uid()::text)`.
2. **Existing mock beat files:** No migration needed — no real beats exist yet (all uploads were mock-only).
3. **Deploy frontend:** No database migration required; the `beat_files` and `sessions` tables already exist with the correct schema.
4. **Rollback:** Remove the `editor.service.ts` and `beat.service.ts` imports from hooks and repoint hooks at the removed `workspace.service.ts` REST functions (or the MSW mocks which remain active).

## Open Questions

- **Signed URL TTL:** Is 1 hour acceptable or should the session player use a longer TTL (e.g., 24 hours)? Long-lived signed URLs reduce fetch overhead but increase exposure if the URL leaks. Decision deferred to the security review.
- **Multi-tab editing:** If the user edits the same session in two browser tabs, the last auto-save wins. No conflict resolution is planned. Acceptable for MVP?
