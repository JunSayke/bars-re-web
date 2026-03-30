## Context

The workspace editor currently supports one beat source: a locally-uploaded audio file (MP3/WAV/OGG ≤ 20 MB) persisted in Supabase Storage via **`beat_files`**. The `useBeatPlayer` hook drives HTML5 audio, `useImportBeatMutation` handles the upload, and `BeatPlayerBar` renders the file-upload trigger and controls.

Users frequently compose to Spotify tracks without a local file. The SDD (section 4.4) already anticipated an "embed link" alternate flow alongside file upload, so this change completes that design intent — scoped to Spotify only as the first provider.

The `Library` panel in `WorkspaceWindowMenu` is currently unimplemented; it will be replaced by a `Beat Link` panel that houses the link-embed input.

---

## Goals / Non-Goals

**Goals:**
- Add a `Beat Link` panel (replacing the `Library` entry in the workspace checkbox menu) that accepts Spotify URLs
- Validate Spotify URLs client-side with Zod (track, album, playlist patterns) before submission
- Embed the Spotify player via an `<iframe>` using Spotify's published embed URL pattern (`https://open.spotify.com/embed/...`)
- Persist the link in a new **`beat_links`** Supabase table (mirrors `beat_files` schema) so the embed survives page reload
- Rehydrate the Spotify embed on session load from `beat_links`
- Coexist with file-upload beats: if both a file and a link exist for a session, the most recently set one wins (only one active beat source at a time)

**Non-Goals:**
- YouTube and SoundCloud support (future changes)
- BPM auto-detection from Spotify links (BPM will be `null`; manual entry stays possible)
- Accessing the Spotify Web Playback SDK or requiring a paid Spotify subscription — the embed iframe is publicly available
- Modifying the existing file-upload flow in `beat.service.ts` or `useBeatPlayer`

---

## Decisions

### 1. Spotify Embed — plain `<iframe>`, no SDK

**Decision**: Use Spotify's public embed endpoint (`https://open.spotify.com/embed/<type>/<id>`) directly as an `<iframe>`. No npm dependency, no OAuth, no SDK.

**Rationale**: Spotify provides a free, publicly accessible embed that works without authentication. Adding the Spotify Web Playback SDK would require OAuth scopes, a Spotify Developer app, and a paid account. An iframe covers the composing-while-listening use case at zero cost.

**Alternative considered**: `react-spotify-embed` npm package — rejected because it's a thin wrapper around the same iframe and adds an unnecessary dependency.

### 2. Separate `beat_links` table (not extending `beat_files`)

**Decision**: Create a new `beat_links` table (`id`, `session_id`, `url`, `provider`, `bpm`) rather than adding a `link_url` column to `beat_files`.

**Rationale**: `beat_files` is storage-centric (`storage_path`, `file_size_bytes`); those columns are meaningless for a link. A separate table keeps both schemas clean and avoids nullable columns that would never apply. It mirrors the `beat_files` pattern (FK → `sessions`, cascade delete) so the service layer stays symmetric.

**Alternative considered**: Single `beats` table with a discriminator column — rejected as it forces nullable columns on both sides.

### 3. `Beat Link` panel replaces `Library` in `WorkspaceWindowMenu`

**Decision**: Replace the `{ key: "library", label: "Library" }` entry with `{ key: "beat-link", label: "Beat Link" }`. The panel renders a URL input form; when submitted it shows the Spotify embed inline (not in the `BeatPlayerBar`).

**Rationale**: The `Library` panel was a placeholder with no implementation. The new panel needs a persistent surface for the link input and the iframe, which maps naturally to the panel pattern already used for Thesaurus and Snippets.

### 4. Beat source priority — last-written wins

**Decision**: When a user submits a Spotify link, any existing `beat_files` record for the session is **not deleted** — it is simply superseded as the active source. The session editor reads the active source by checking `beat_links` first (most recent), then `beat_files`.

**Rationale**: Avoids surprising data loss. If a user switches back to file upload, `useImportBeatMutation` already deletes and replaces the existing `beat_files` row. This keeps state transitions owned by the mutation that initiates them.

**Alternative considered**: Always delete the other source type when switching — rejected because destroying uploaded files silently is destructive.

### 5. Spotify URL validation — Zod + regex, client-only

**Decision**: Validate Spotify URLs with a Zod `z.string().regex(...)` on the client. Pattern covers:

```
https://open.spotify.com/(track|album|playlist)/<id>
https://open.spotify.com/intl-*/track/(track|album|playlist)/<id>
```

Server-side validation is deferred (no backend in this frontend-only repo).

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Spotify blocks the embed iframe with CSP/X-Frame-Options on certain tracks | The embed URL (`open.spotify.com/embed/...`) is explicitly permitted by Spotify; the `open.spotify.com` origin allows framing. If a track blocks embedding, show an error toast. |
| Session loads with both a `beat_files` row and a `beat_links` row | The session query service prioritizes `beat_links` as the active source. Users see the Spotify embed; the file beat is retained but inactive. |
| `beat_links` migration not applied in local Supabase | Document migration step. The new service function will throw a PostgREST 42P01 error (table not found) which surfaces via the existing error toast pattern. |
| Spotify iframe size on small screens | The iframe is placed inside a resizable side panel, not the BeatPlayerBar, so it doesn't break the bottom toolbar layout on small screens. |

---

## Migration Plan

1. Run Supabase migration: `20260329000000_create_beat_links_table.sql`
2. No data migration needed — existing sessions without a beat link row continue to load file beats normally
3. Rollback: drop the `beat_links` table; remove `Beat Link` panel from `WorkspaceWindowMenu`; revert `Library` entry

---

## Open Questions

- Should a manually entered BPM for a Spotify-linked beat be stored in `beat_links.bpm`? (Assumption: yes — the `BpmBadge` can be made editable in a future task)
- Should the Spotify embed iframe have a fixed or configurable height? (Assumption: `152px` — Spotify's recommended compact height)
