## 1. Utility Layer — `beat-link.utils.ts`

- [x] 1.1 Create `src/modules/workspace/utils/beat-link.utils.ts` with `detectProvider(url)` function that returns `"spotify" | "youtube" | "soundcloud"` based on URL regex matching
- [x] 1.2 Move `toSpotifyEmbedUrl(url)` from `spotify.utils.ts` into `beat-link.utils.ts`
- [x] 1.3 Add `toYouTubeEmbedUrl(url)` that extracts the video ID from watch or short-link URLs and returns `https://www.youtube.com/embed/<id>`
- [x] 1.4 Add `toSoundCloudEmbedUrl(url)` that returns the SoundCloud widget iframe URL with `encodeURIComponent(url)` as the `url` query parameter
- [x] 1.5 Add `toBeatLinkEmbedUrl(url, provider)` dispatcher that delegates to the correct per-provider function
- [x] 1.6 Delete `src/modules/workspace/utils/spotify.utils.ts` (content moved to `beat-link.utils.ts`)

## 2. Schema — Multi-Provider URL Validation

- [x] 2.1 In `src/modules/workspace/schemas/workspace.schema.ts`, add `youtubeLinkSchema` (Zod regex for `youtube.com/watch?v=` and `youtu.be/` patterns)
- [x] 2.2 Add `soundcloudLinkSchema` (Zod regex for `soundcloud.com/<user>/<track>` pattern)
- [x] 2.3 Add `beatLinkUrlSchema` as `z.union([spotifyLinkSchema, youtubeLinkSchema, soundcloudLinkSchema])` with a `.superRefine` that emits "Invalid URL. Paste a link from Spotify, YouTube, or SoundCloud." when all three fail
- [x] 2.4 Keep `spotifyLinkSchema` exported for backward compatibility (still used by `SpotifyEmbedPlayer` indirectly)

## 3. Service — Dynamic Provider Detection

- [x] 3.1 In `src/modules/workspace/services/beat-link.service.ts`, import `detectProvider` from `beat-link.utils.ts`
- [x] 3.2 Replace the hardcoded `provider: "spotify"` in `upsertBeatLink` with `provider: detectProvider(url)`

## 4. Components — New Embed Players

- [x] 4.1 Create `src/modules/workspace/components/molecules/YouTubeEmbedPlayer.tsx` that accepts `{ url: string }`, calls `toYouTubeEmbedUrl(url)`, and renders an `<iframe>` with `width="100%"`, `height="152"`, and the same sandbox attribute set as `SpotifyEmbedPlayer`
- [x] 4.2 Create `src/modules/workspace/components/molecules/SoundCloudEmbedPlayer.tsx` that accepts `{ url: string }`, calls `toSoundCloudEmbedUrl(url)`, and renders an `<iframe>` with `width="100%"`, `height="166"`, and appropriate sandbox attributes
- [x] 4.3 Update `SpotifyEmbedPlayer.tsx` to import `toSpotifyEmbedUrl` from `beat-link.utils.ts` instead of the deleted `spotify.utils.ts`

## 5. Components — `BeatLinkForm` Update

- [x] 5.1 In `src/modules/workspace/components/molecules/BeatLinkForm.tsx`, replace `zodResolver(z.object({ url: spotifyLinkSchema }))` with `zodResolver(z.object({ url: beatLinkUrlSchema }))`
- [x] 5.2 Update the input placeholder text to indicate all three accepted platforms (e.g. "Paste a Spotify, YouTube, or SoundCloud link")
- [x] 5.3 Update any help/instructional text in the form to reflect all three providers

## 6. Components — `BeatLinkPanel` Provider Dispatch

- [x] 6.1 In `src/modules/workspace/components/templates/BeatLinkPanel.tsx`, add a `renderEmbedPlayer(beatLink)` helper that switches on `beatLink.provider` and returns the correct player component (`SpotifyEmbedPlayer`, `YouTubeEmbedPlayer`, or `SoundCloudEmbedPlayer`)
- [x] 6.2 Replace the direct `<SpotifyEmbedPlayer url={beatLink.url}>` render call with `renderEmbedPlayer(beatLink)`
- [x] 6.3 Import `YouTubeEmbedPlayer` and `SoundCloudEmbedPlayer` in `BeatLinkPanel.tsx`

## 7. Mocks — MSW Handler Update

- [x] 7.1 In `src/modules/workspace/mocks/beat-link.handlers.ts`, update the POST handler to read `provider` from the request body instead of hardcoding `"spotify"`, so mock rows persist the correct provider
- [x] 7.2 Update `src/modules/workspace/mocks/beat-link.fixtures.ts` to include fixture entries for YouTube and SoundCloud providers

## 8. Barrel Exports

- [x] 8.1 Ensure `src/modules/workspace/index.ts` does not expose internal utility paths; verify no public API changes are needed
- [x] 8.2 Verify all new component files are not re-exported from the module barrel (they are internal molecules, not public API)
