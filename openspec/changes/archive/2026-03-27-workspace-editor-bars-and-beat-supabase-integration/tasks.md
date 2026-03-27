## 1. Verify Supabase Schema and Storage Preconditions

- [x] 1.1 Confirm the `sessions` table exists with `bar_content text` column and RLS policy `auth.uid() = user_id` covering SELECT, INSERT, UPDATE, DELETE
- [x] 1.2 Confirm the `beat_files` table has columns: `id uuid`, `session_id uuid`, `storage_path varchar(500)`, `bpm int`, `file_size_bytes int`, `source_type varchar(20)`, with `ON DELETE CASCADE` on `session_id` and RLS restricting access to rows whose parent session is owned by the authenticated user
- [x] 1.3 Create a private `beats` Supabase Storage bucket in the project dashboard (if it doesn't exist)
- [x] 1.4 Add a storage RLS policy on the `beats` bucket: `CREATE POLICY "Users manage their beats" ON storage.objects FOR ALL TO authenticated USING ((storage.foldername(name))[1] = auth.uid()::text) WITH CHECK ((storage.foldername(name))[1] = auth.uid()::text)`

## 2. Update `WritingSession` Schema and Types

- [x] 2.1 In `src/modules/workspace/schemas/workspace.schema.ts`, add the `beatSchema` object: `z.object({ beatFileId: z.string(), beatStorageUrl: z.string(), bpm: z.number().nullable(), fileName: z.string() }).nullable().optional()`
- [x] 2.2 Add `beat: beatSchema` field to `writingSessionSchema` so the type becomes `WritingSession & { beat?: { beatFileId, beatStorageUrl, bpm, fileName } | null }`
- [x] 2.3 Export `Beat` as a new inferred type: `export type Beat = z.infer<typeof beatSchema>`

## 3. Create `editor.service.ts`

- [x] 3.1 Create `src/modules/workspace/services/editor.service.ts`; add module-level JSDoc: `@module: workspace`, `@layer: service`, `@scope: module`, `@deps: @/shared/config/supabase`
- [x] 3.2 Import `supabase` from `@/shared/config/supabase`; import `Bar`, `WritingSession` from `../schemas/workspace.schema`
- [x] 3.3 Implement private helper `getAuthUser(): Promise<string>` — calls `supabase.auth.getUser()`, throws `{ message: "Unauthorized" }` if `data.user` is null, returns `data.user.id`
- [x] 3.4 Implement private helper `deserializeBars(barContent: string | null): Bar[]` — wraps `JSON.parse(barContent ?? "[]")` in a try/catch; on failure, logs `console.warn` and returns `[]`; validates the result with `.array(barSchema).safeParse` and returns the parsed array or `[]`
- [x] 3.5 Implement `getSession(sessionId: string): Promise<WritingSession>` — calls `getAuthUser()`, queries `supabase.from("sessions").select("*, beat_files(id, storage_path, bpm, file_size_bytes, source_type)").eq("id", sessionId).eq("user_id", userId).single()`, maps the result: deserializes `bar_content` with `deserializeBars`, generates a signed URL with `supabase.storage.from("beats").createSignedUrl(storagePath, 3600)` if a `beat_files` row exists, returns the full `WritingSession` including the optional `beat` field
- [x] 3.6 Implement `saveDraft(sessionId: string, bars: Bar[]): Promise<{ success: boolean }>` — calls `getAuthUser()`, serializes bars with `JSON.stringify(bars)`, calls `supabase.from("sessions").update({ bar_content: serialized, last_modified_at: new Date().toISOString() }).eq("id", sessionId).eq("user_id", userId)`, throws on Supabase error, returns `{ success: true }`
- [x] 3.7 Export both `getSession` and `saveDraft` from `editor.service.ts`

## 4. Create `beat.service.ts`

- [x] 4.1 Create `src/modules/workspace/services/beat.service.ts`; add module-level JSDoc comment
- [x] 4.2 Import `supabase` from `@/shared/config/supabase`; import `Beat` from `../schemas/workspace.schema`
- [x] 4.3 Implement private helper `sanitizeFileName(name: string): string` — replaces spaces and special characters with hyphens, preserves extension
- [x] 4.4 Implement `uploadBeat(sessionId: string, file: File): Promise<Beat>` — calls `getAuthUser()` (from a local helper or re-implement inline), constructs the storage path `{userId}/{sessionId}/{Date.now()}-{sanitizeFileName(file.name)}`, uploads via `supabase.storage.from("beats").upload(path, file)`, throws on storage error, inserts a `beat_files` row with `session_id`, `storage_path`, `file_size_bytes: file.size`, `source_type: "upload"`, `bpm: null`, generates and returns a signed URL for the newly uploaded file as a `Beat` object
- [x] 4.5 Implement `deleteBeat(beatFileId: string, storagePath: string): Promise<void>` — calls `getAuthUser()`, removes the file via `supabase.storage.from("beats").remove([storagePath])`, deletes the `beat_files` row with `.eq("id", beatFileId)`, throws on either error
- [x] 4.6 Export both `uploadBeat` and `deleteBeat` from `beat.service.ts`

## 5. Update Hooks

- [x] 5.1 Update `src/modules/workspace/hooks/useGetSessionQuery.ts` — change import of `getSession` from `../services/workspace.service` to `../services/editor.service`; the return type automatically reflects the extended `WritingSession` with optional `beat`
- [x] 5.2 Update `src/modules/workspace/hooks/useSaveDraftMutation.ts` — change import of `saveDraft` from `../services/workspace.service` to `../services/editor.service`
- [x] 5.3 Update `src/modules/workspace/hooks/useImportBeatMutation.ts` — replace the inline `importBeat` fetch function with a call to `uploadBeat` from `../services/beat.service`; update the return type from `BeatRecord` to `Beat`; after a successful upload, call `queryClient.invalidateQueries({ queryKey: workspaceKeys.session(sessionId) })` so the session query refreshes with the new `beat` data

## 6. Remove `workspace.service.ts`

- [x] 6.1 Confirm no remaining imports of `getSession` or `saveDraft` from `workspace.service.ts` in any hook or component; run a workspace-wide search for `from "../services/workspace.service"` under `src/modules/workspace/hooks/`
- [x] 6.2 Delete `src/modules/workspace/services/workspace.service.ts` — the file's two remaining functions (`getSession`, `saveDraft`) are now in `editor.service.ts`

## 7. Update `useBeatPlayer` Hook

- [x] 7.1 Add `loadUrl(url: string, metadata: { fileName: string; bpm: number | null }): void` method to `src/modules/workspace/hooks/useBeatPlayer.ts` — sets `audioRef.current.src = url`, calls `audioRef.current.load()`, updates internal state (`fileName`, `bpm`, `isPlaying: false`, `currentTime: 0`); does NOT create an object URL (no cleanup needed)
- [x] 7.2 Expose `loadUrl` in the hook's return object alongside the existing `loadFile`

## 8. Update `BpmBadge` Atom

- [x] 8.1 Update `src/modules/workspace/components/atoms/BpmBadge.tsx` — change `bpm` prop type from `number` to `number | null`
- [x] 8.2 When `bpm` is `null`, render `"-- BPM"` as placeholder text instead of `"{bpm} BPM"`

## 9. Hydrate Beat Player in `EditorPage`

- [x] 9.1 In `src/modules/workspace/components/EditorPage.tsx`, add a `useEffect` with dependency `[session?.beat?.beatFileId]` — when `session?.beat` is non-null and `loadUrl` has not yet been called for the current `beatFileId`, call `loadUrl(session.beat.beatStorageUrl, { fileName: session.beat.fileName, bpm: session.beat.bpm })`
- [x] 9.2 Ensure the `useEffect` guard prevents repeated `loadUrl` calls on unrelated re-renders (e.g., track `initializedBeatId` in a `useRef`)

## 10. Update `BeatRecord` / `Beat` Type Reference

- [x] 10.1 In `src/modules/workspace/types/beat.types.ts`, re-export `Beat` from the schema (or update `BeatRecord` to align with `Beat`) so no type mismatch exists between `useBeatPlayer` and `useImportBeatMutation`
- [x] 10.2 Update any remaining references to `BeatRecord` in `useBeatPlayer.ts` and `BeatPlayerBar.tsx` to use the unified `Beat` type

## 11. Smoke Testing

- [x] 11.1 Start the dev server with `.env.local` pointing to the Supabase dev project; open an existing session and verify bars load from Supabase (network tab shows calls to `supabase.co/rest/v1/sessions`, not `localhost:3001`)
- [x] 11.2 Type in the bar editor and wait 1 second; verify the auto-save status indicator shows "Saving…" then "Saved"; verify `bar_content` is updated in the Supabase dashboard
- [x] 11.3 Reload the page and verify the bars are restored from Supabase
- [x] 11.4 Upload a beat file (MP3/WAV/OGG ≤ 20 MB); verify the file appears in the Supabase `beats` bucket under `{userId}/{sessionId}/`, a `beat_files` row is inserted, and the beat player appears with "-- BPM"
- [/] 11.5 Reload the page and verify the beat player is restored with the file name and "-- BPM" badge without requiring a re-upload (perform this later. A BPM detector must be implemented first before this can be tested)
- [x] 11.6 Attempt to upload an unsupported format (e.g., MP4); verify the error toast appears and no storage upload is triggered
- [x] 11.7 Attempt to upload a file > 20 MB; verify the error toast appears and no storage upload is triggered
- [x] 11.8 Run `pnpm lint` and resolve any TypeScript or ESLint errors introduced by this change

## 12. Changes and Fixes
- [x] 12.1 Disable playback controls during loading the beat to prevent DOMException - The play() request was interrupted
- [x] 12.2 When uploading a beat then returning to the Workspace Page and opening the session back, the beat is already uploaded but I cannot use the Playback control and Timeline. These are disabled until I attempt to upload again.
- [x] 12.3 On the 'sessions list' on the Workspace Page, session card bars preview includes JSON information, possible security issue as users can see bar ID
- [x] 12.4 On the Editor Page, when copy+pasting multiple bars on a song section, it pastes only on one bar line. If there is a new line on the pasted content, add that to the next bar line
- [x] 12.5 On the Editor Page, add a global copy+paste where the whole song can be copied to clipboard