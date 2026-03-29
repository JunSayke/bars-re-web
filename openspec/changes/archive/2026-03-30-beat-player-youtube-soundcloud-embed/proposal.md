## Why

The Beat Link panel currently only accepts Spotify URLs, excluding producers who distribute beats on YouTube and SoundCloud — the two most common platforms for rap beat libraries. Extending embed support to these providers removes that friction without any new UI surface.

## What Changes

- Accept YouTube watch/shorts URLs and SoundCloud track URLs in the Beat Link input field alongside Spotify URLs
- Replace the hardcoded `provider: "spotify"` value in `upsertBeatLink` with dynamic provider detection derived from the submitted URL
- Replace the single `spotifyLinkSchema` Zod validator with a multi-provider validator that accepts URLs from any of the three platforms
- Add a `toBeatLinkEmbedUrl` utility that dispatches to the correct embed URL builder per provider (`spotify`, `youtube`, `soundcloud`)
- Rename / extend `spotify.utils.ts` into a `beat-link.utils.ts` that covers all three providers
- Add `YouTubeEmbedPlayer` molecule component (renders `<iframe src="https://www.youtube.com/embed/<id>">`)
- Add `SoundCloudEmbedPlayer` molecule component (renders `<iframe src="https://w.soundcloud.com/player/?url=<encoded-url>&...">`)
- Update `BeatLinkPanel` to select the correct embed player component based on `beatLink.provider`
- Update the `BeatLinkForm` help text to indicate all three accepted platforms
- Update MSW mock handlers to support GET/DELETE/POST with YouTube and SoundCloud providers
- Update the `beat_links` migration validation comment to note the `provider` can be `spotify`, `youtube`, or `soundcloud`

## Capabilities

### New Capabilities

- `beat-link-youtube-embed`: User can submit a YouTube URL and have the video rendered as an embed in the Beat Link panel
- `beat-link-soundcloud-embed`: User can submit a SoundCloud track URL and have the track rendered as an embed in the Beat Link panel

### Modified Capabilities

- `beat-link-embed`: URL validation, provider detection, embed rendering, and mock layer must be extended to cover `youtube` and `soundcloud` providers in addition to `spotify` — all via the same single input field
- `import-and-play-beat`: The beat-source description now covers three link providers; the input field descriptor and validation messaging must reflect all three

## Impact

- `src/modules/workspace/schemas/workspace.schema.ts` — replace `spotifyLinkSchema` with a `beatLinkUrlSchema` that accepts YouTube, SoundCloud, and Spotify URLs; update error message
- `src/modules/workspace/utils/spotify.utils.ts` → replace with `beat-link.utils.ts` containing `detectProvider`, `toSpotifyEmbedUrl`, `toYouTubeEmbedUrl`, `toSoundCloudEmbedUrl`, and a unified `toBeatLinkEmbedUrl` dispatcher
- `src/modules/workspace/services/beat-link.service.ts` — use `detectProvider(url)` instead of hardcoded `"spotify"` for the `provider` field
- `src/modules/workspace/components/molecules/BeatLinkForm.tsx` — update Zod resolver to `beatLinkUrlSchema`; update placeholder/help text
- `src/modules/workspace/components/molecules/SpotifyEmbedPlayer.tsx` — no change (remains for the Spotify case)
- New: `src/modules/workspace/components/molecules/YouTubeEmbedPlayer.tsx`
- New: `src/modules/workspace/components/molecules/SoundCloudEmbedPlayer.tsx`
- `src/modules/workspace/components/templates/BeatLinkPanel.tsx` — render the correct embed player based on `beatLink.provider`
- `src/modules/workspace/mocks/beat-link.handlers.ts` — support all three providers in fixture data and handler logic
- No database schema change required — `provider varchar(20)` already exists and supports arbitrary string values
