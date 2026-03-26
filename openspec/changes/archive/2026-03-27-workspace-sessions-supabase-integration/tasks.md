## 1. Verify Supabase Schema Preconditions

- [x] 1.1 Confirm the `sessions` table exists in the Supabase project with columns: `id uuid`, `user_id uuid`, `title varchar(200)`, `topic text`, `bar_content text`, `last_modified_at timestamp with time zone`, `created_at timestamp with time zone`
- [x] 1.2 Confirm the `beat_files` table exists with columns: `id uuid`, `session_id uuid`, `storage_path varchar(500)`, `bpm int`, `file_size_bytes int`, `source_type varchar(20)`, and an `ON DELETE CASCADE` foreign key on `session_id`
- [x] 1.3 Confirm RLS is enabled on the `sessions` table with a policy `auth.uid() = user_id` covering SELECT, INSERT, UPDATE, DELETE
- [x] 1.4 Confirm RLS is enabled on the `beat_files` table with a policy that restricts access to rows whose parent session is owned by the authenticated user (e.g., `auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id)`)

## 2. Create `session.service.ts`

- [x] 2.1 Create `src/modules/workspace/services/session.service.ts`; add module-level JSDoc comment with `@module: workspace`, `@layer: service`, `@scope: module`, `@deps: @/shared/config/supabase`
- [x] 2.2 Import `supabase` from `@/shared/config/supabase`; import `SessionSummary`, `CreateSessionPayload` from `../schemas/workspace.schema` (`RenameSessionPayload` omitted — `renameSession` takes primitive args, no payload type needed)
- [x] 2.3 Implement private helper `getAuthUser(): Promise<string>` — calls `supabase.auth.getUser()`, throws `{ message: "Unauthorized" }` if `data.user` is null, returns `data.user.id`
- [x] 2.4 Implement private helper `toPreviewSnippet(barContent: string | null): string` — splits `barContent` by `\n`, returns first non-empty line truncated to 100 characters, returns `""` if null/empty
- [x] 2.5 Implement private helper `toThumbnailType(hasBeat: boolean): "lyrics" | "beat-linked"` — returns `"beat-linked"` if `hasBeat`, otherwise `"lyrics"`
- [x] 2.6 Implement `getSessions(): Promise<SessionSummary[]>` — calls `getAuthUser()`, queries `supabase.from("sessions").select("*, beat_files(id)").eq("user_id", userId).order("last_modified_at", { ascending: false })`, maps DB rows to `SessionSummary` using `toPreviewSnippet` and `toThumbnailType`, throws on Supabase error
- [x] 2.7 Implement `createSession(payload: CreateSessionPayload): Promise<SessionSummary>` — calls `getAuthUser()`, performs `supabase.from("sessions").select("id", { count: "exact", head: true }).eq("user_id", userId)` count check, throws `{ message: "Session limit reached" }` if count >= 100, then inserts new row with `title`, `topic`, `user_id`, `bar_content: ""`, `last_modified_at: new Date().toISOString()`, returns the inserted row mapped to `SessionSummary`
- [x] 2.8 Implement `renameSession(id: string, title: string): Promise<SessionSummary>` — calls `getAuthUser()`, updates `supabase.from("sessions").update({ title, last_modified_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single()`, returns the updated row mapped to `SessionSummary`, throws on Supabase error
- [x] 2.9 Implement `deleteSession(id: string): Promise<void>` — calls `getAuthUser()`, deletes `supabase.from("sessions").delete().eq("id", id).eq("user_id", userId)`, throws on Supabase error
- [x] 2.10 Export all four functions from `session.service.ts` (`getSessions`, `createSession`, `renameSession`, `deleteSession`; `getSession` remains in `workspace.service.ts` per Non-Goals)

## 3. Update Session Hooks

- [x] 3.1 Update `src/modules/workspace/hooks/useSessionsQuery.ts` — change import of `getSessions` from `../services/workspace.service` to `../services/session.service`
- [x] 3.2 Update `src/modules/workspace/hooks/useCreateSessionMutation.ts` — change import of `createSession` from `../services/workspace.service` to `../services/session.service`
- [x] 3.3 Update `src/modules/workspace/hooks/useRenameSessionMutation.ts` — change import of `renameSession` from `../services/workspace.service` to `../services/session.service`
- [x] 3.4 Update `src/modules/workspace/hooks/useDeleteSessionMutation.ts` — change import of `deleteSession` from `../services/workspace.service` to `../services/session.service`

## 4. Clean Up `workspace.service.ts`

- [x] 4.1 Remove the `getSessions` function from `src/modules/workspace/services/workspace.service.ts` (no longer called by any hook)
- [x] 4.2 Remove the `createSession` function from `workspace.service.ts`
- [x] 4.3 Remove the `renameSession` function from `workspace.service.ts`
- [x] 4.4 Remove the `deleteSession` function from `workspace.service.ts`
- [x] 4.5 Remove unused imports (`CreateSessionPayload`, `CreateSessionResponse`, `SessionSummary`, `RenameSessionPayload`, `RenameSessionResponse`) from `workspace.service.ts` if no longer referenced; retain `WritingSession`, `SaveDraftPayload`, `SaveResult`

## 5. Update Supabase TypeScript Types (Optional but Recommended)

- [x] 5.1 If a `database.types.ts` generated from Supabase CLI exists or is created, add the `sessions` and `beat_files` table row types so `session.service.ts` benefits from typed query results; update the Supabase client initialisation to use `createClient<Database>(...)`

## 6. Smoke Testing

- [x] 6.1 Start the dev server with a valid `.env.local` pointing to the Supabase dev project; navigate to `/workspaces` and verify sessions load from Supabase (network tab shows calls to `supabase.co`, not `localhost:3001`)
- [x] 6.2 Create a new session via the "New Session" dialog and verify the session appears in the list and navigates to the editor
- [x] 6.3 Rename an existing session via the overflow menu and verify the updated title reflects immediately in the session list
- [x] 6.4 Delete a session via the overflow menu, confirm the dialog, and verify the session card is removed and does not reappear on page refresh
- [x] 6.5 Verify that the session count indicator ("X/100 SESSIONS") reflects the real count from Supabase
- [x] 6.6 Verify that the error toast "Session limit reached..." fires correctly when 100 sessions exist (can be tested by temporarily lowering the limit constant to 1 and creating a second session)
