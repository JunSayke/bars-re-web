## 1. Database Migration

- [x] 1.1 Create `supabase/migrations/20260329000001_create_beat_links_table.sql` with the `beat_links` table schema (`id`, `session_id` FK → `sessions` cascade delete, `url`, `provider`, `bpm`)

## 2. Supabase Types

- [x] 2.1 Update `src/shared/config/database.types.ts` to add the `beat_links` table row/insert/update types

## 3. Spotify URL Validation Schema

- [x] 3.1 Add `spotifyLinkSchema` (Zod `z.string().regex(...)`) to `src/modules/workspace/schemas/workspace.schema.ts` covering `track`, `album`, and `playlist` URL patterns
- [x] 3.2 Add `BeatLink` type export derived from a `beatLinkSchema` Zod object (`{ id, sessionId, url, provider, bpm }`)

## 4. Beat Link Service

- [x] 4.1 Create `src/modules/workspace/services/beat-link.service.ts` with `upsertBeatLink(sessionId, url): Promise<BeatLink>` — deletes existing row for the session, inserts new row, returns the inserted record
- [x] 4.2 Add `getBeatLink(sessionId): Promise<BeatLink | null>` function to the same service file — queries `beat_links` for the most recent row for the session

## 5. Beat Link Hook

- [x] 5.1 Create `src/modules/workspace/hooks/useGetBeatLinkQuery.ts` — TanStack Query `useQuery` that calls `getBeatLink(sessionId)`; uses `workspaceKeys.beatLink(sessionId)` query key
- [x] 5.2 Create `src/modules/workspace/hooks/useUpsertBeatLinkMutation.ts` — TanStack Query `useMutation` that calls `upsertBeatLink(sessionId, url)` and invalidates `workspaceKeys.beatLink(sessionId)` on success
- [x] 5.3 Add `beatLink: (sessionId: string) => [...]` key factory to `src/modules/workspace/hooks/queryKeys.ts`

## 6. Spotify Embed Helper Utility

- [x] 6.1 Create `src/modules/workspace/utils/spotify.utils.ts` with `toSpotifyEmbedUrl(url: string): string` — converts `https://open.spotify.com/<type>/<id>` → `https://open.spotify.com/embed/<type>/<id>?utm_source=generator`

## 7. Beat Link Panel UI Components

- [x] 7.1 Create `src/modules/workspace/components/molecules/BeatLinkForm.tsx` — form with a text input (Zod + React Hook Form for Spotify URL), submit button labeled "Embed", and inline validation error display
- [x] 7.2 Create `src/modules/workspace/components/molecules/SpotifyEmbedPlayer.tsx` — renders the Spotify `<iframe>` with `src={toSpotifyEmbedUrl(url)}`, `allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"`, height `152`, and `loading="lazy"`. Wraps the iframe in a sandboxed container.
- [x] 7.3 Create `src/modules/workspace/components/templates/BeatLinkPanel.tsx` — panel shell that uses `useGetBeatLinkQuery` and `useUpsertBeatLinkMutation` to coordinate `BeatLinkForm` and `SpotifyEmbedPlayer`; shows the form when no link is stored, shows the iframe + "Replace" button when a link exists
- [x] 7.4 Add instructional helper text inside `BeatLinkPanel.tsx` above the `BeatLinkForm` — display a short description ("Paste a Spotify track, album, or playlist link to play it while you write.") and a step-by-step hint list (1. Open the track on Spotify → 2. Click Share → Copy Link → 3. Paste the link below) using `muted-foreground` text and the `--font-sans` theme; shown only when no embed is active

## 8. WorkspaceWindowMenu Update

- [x] 8.1 In `src/modules/workspace/components/organisms/WorkspaceWindowMenu.tsx`, replace `{ key: "library", label: "Library" }` with `{ key: "beat-link", label: "Beat Link" }`

## 9. EditorPage Wiring

- [x] 9.1 Import `BeatLinkPanel` in `src/modules/workspace/components/EditorPage.tsx`
- [x] 9.2 Add `beat-link` panel rendering alongside the existing `thesaurus` and `snippets` panel conditionals — render `<BeatLinkPanel sessionId={sessionId} />` when `openPanels.has("beat-link")`

## 10. Mock Data

- [x] 10.1 Add a MSW handler for `beat_links` GET/POST in `src/modules/workspace/mocks/` to support dev without a live Supabase connection

## 11. Smoke Test

- [x] 11.1 Run the dev server (`pnpm dev`) and verify: Beat Link checkbox appears in the workspace menu, submitting a valid Spotify URL shows the iframe, submitting an invalid URL shows the validation error, the link persists after page reload
- [x] 11.2 Verify that uploading a file beat still works independently of the Beat Link panel
