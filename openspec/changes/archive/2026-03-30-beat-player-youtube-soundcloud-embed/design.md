## Context

The Beat Link panel has a working Spotify embed flow: the user submits a Spotify URL, it is validated client-side, persisted to `beat_links` with `provider = "spotify"`, and a `SpotifyEmbedPlayer` iframe is displayed inside the panel. The `provider` column was designed for multi-provider support from the start — it is `varchar(20)` with no check constraint — so no database migration is required.

The change extends this flow to YouTube and SoundCloud. All three platforms are accessible from the same single text input. The code changes are concentrated in four areas: URL validation schema, provider detection utility, embed URL construction, and panel rendering.

Current state of relevant files:
- `workspace.schema.ts` — contains `spotifyLinkSchema` (Zod regex for Spotify only)
- `utils/spotify.utils.ts` — contains `toSpotifyEmbedUrl` (Spotify-only)
- `services/beat-link.service.ts` — hardcodes `provider: "spotify"`
- `components/molecules/BeatLinkForm.tsx` — uses `spotifyLinkSchema`
- `components/templates/BeatLinkPanel.tsx` — always renders `<SpotifyEmbedPlayer>`

## Goals / Non-Goals

**Goals:**
- Accept YouTube watch URLs (`youtube.com/watch?v=`, `youtu.be/`) and SoundCloud track URLs (`soundcloud.com/<user>/<track>`) in the same Beat Link input field
- Detect provider dynamically from the submitted URL (no user-facing provider selector)
- Render the correct embed iframe based on `beatLink.provider`
- Keep the Spotify flow functionally identical
- Update mock handlers so all three providers are testable in MSW dev mode

**Non-Goals:**
- BPM detection for YouTube or SoundCloud (out of scope — BPM detection exists only for audio file uploads)
- Supporting more than one active link per session (the delete-then-insert upsert pattern is unchanged)
- Supporting YouTube Shorts or YouTube Music sub-domains in this iteration
- Adding a provider selector dropdown — the platform is always inferred from the URL

## Decisions

### Decision 1: URL validation — union Zod schema over a single mega-regex

**Chosen:** Three separate Zod string schemas (one per provider) plus a `beatLinkUrlSchema` union: `z.union([spotifyLinkSchema, youtubeLinkSchema, soundcloudLinkSchema])` with a `.superRefine` or catch-all `.refine` to produce a unified error message when all three fail.

**Alternative considered:** A single regex with alternation (`spotify|youtube|soundcloud` branches). Rejected: the combined regex becomes hard to read and individual provider error messages become impossible.

**Rationale:** The union keeps each provider's regex isolated and independently testable. A custom `.transform` on the union is not needed — the raw URL is stored as-is in the DB.

**Unified error message** (shown when all three fail):
> "Invalid URL. Paste a link from Spotify, YouTube, or SoundCloud."

---

### Decision 2: Provider detection — utility function, not form-time enum

**Chosen:** A `detectProvider(url: string): "spotify" | "youtube" | "soundcloud"` function in `beat-link.utils.ts` that the service calls before inserting the row. The form itself passes only the raw URL, not a provider enum.

**Alternative considered:** Detecting provider in the Zod schema via `.transform` and threading it through as a form value. Rejected: mutation payload would need a new field; the service is the right owner of provider normalization.

**Rationale:** The service already owns the upsert — adding `detectProvider(url)` there is a minimal, single-responsibility change.

---

### Decision 3: Utility file consolidation — rename `spotify.utils.ts` to `beat-link.utils.ts`

**Chosen:** Rename `utils/spotify.utils.ts` to `utils/beat-link.utils.ts` and move all embed URL helpers into it: `toSpotifyEmbedUrl`, `toYouTubeEmbedUrl`, `toSoundCloudEmbedUrl`, `detectProvider`, and a dispatcher `toBeatLinkEmbedUrl(url, provider)`.

**Alternative considered:** Keep `spotify.utils.ts` and create sibling files. Rejected: three small files with one export each is unnecessary fragmentation.

**Rationale:** All provider logic is co-located and importable from one path. Any future fourth provider only adds a function to this one file.

---

### Decision 4: Embed player dispatch in `BeatLinkPanel` — switch over provider string

**Chosen:** In `BeatLinkPanel`, replace the direct `<SpotifyEmbedPlayer>` render with a `renderEmbedPlayer(beatLink)` helper that switches on `beatLink.provider` and renders the correct player component.

**Alternative considered:** Separate page-level components for each provider, selected before `BeatLinkPanel` is mounted. Rejected: over-engineered — all three providers use the same panel chrome (drag/resize, close button, replace link).

**Rationale:** The panel template already owns the conditional between "form view" and "embed view". Adding a sub-switch for provider type is minimal and contained.

---

### Decision 5: YouTube embed approach — nocookie domain not required

**Chosen:** Standard `https://www.youtube.com/embed/<videoId>` iframe. The sandbox attribute set is same as Spotify: `allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox`.

**Alternative considered:** `https://www.youtube-nocookie.com/embed/<videoId>`. Not required — this is an internal productivity tool, not a public-facing site; using the standard domain is simpler and avoids potential iframe blocking.

---

### Decision 6: SoundCloud embed approach — Widget API iFrame URL

**Chosen:** `https://w.soundcloud.com/player/?url=<encodeURIComponent(url)>&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`

Height is set to `166px` (SoundCloud's minimum compact-player height).

**Rationale:** The Widget API URL accepts any SoundCloud public track URL directly as a query parameter — no API key needed; no oEmbed call needed. This keeps the implementation stateless on the client side.

## Risks / Trade-offs

- **SoundCloud URL patterns are liberal** — SoundCloud track URLs follow `soundcloud.com/<user>/<track>` but the user portion can include hyphens, underscores, and numbers. A permissive regex like `^https?://soundcloud\.com/[^/]+/[^/?#]+` covers the common case but could match playlist or set URLs. Mitigation: Accept and attempt to embed any matched SoundCloud URL; the SoundCloud widget itself handles invalid URLs gracefully with an error state inside the iframe.
- **YouTube short URLs** (`youtu.be/<id>`) and standard watch URLs both need to extract the video ID via different regex patterns. Mitigation: handle both in `toYouTubeEmbedUrl` with a fallback case.
- **Renaming `spotify.utils.ts`** — any file that currently imports from `spotify.utils.ts` will need the import path updated. Risk is low since only one component (`SpotifyEmbedPlayer`) imports from it.

## Migration Plan

1. Deploy code changes — no database migration needed (`provider` column already exists)
2. Existing sessions with `provider = "spotify"` rows continue to render the Spotify embed unchanged
3. No rollback procedure needed — the code change is additive; Spotify-only code is preserved

## Open Questions

- **None.** The provider column already exists, no DB change is required, and all three embed iframes are well-documented by their respective platforms.
