## Context

The `beat_files` Supabase table has a `bpm integer null` column that has always been stored as `null`. The existing upload flow (`uploadBeat` in `beat.service.ts`) stores the file in Supabase Storage and inserts a `beat_files` row, but performs no audio analysis. The `BpmBadge` atom and `BeatPlayerBar` organism already accept `bpm: number | null` and render the value — they just never receive a non-null value. Detection needs to happen client-side during the import flow, after the audio file is available as a `File` object.

## Goals / Non-Goals

**Goals:**

- Detect BPM from the uploaded `File` using the browser-native Web Audio API (no new npm packages).
- Write the detected BPM integer to `beat_files.bpm` via a Supabase `update` after insert.
- Surface the BPM in `BpmBadge` / `BeatPlayerBar` without any UI changes (the plumbing already exists).
- Keep detection logic in a pure, testable util function (`detectBpm`).

**Non-Goals:**

- Server-side BPM detection (this is a pure-frontend Next.js app; no backend workers).
- BPM editing or manual override by the user (future change).
- Detection for beats imported via URL or YouTube (current `source_type: "upload"` only).
- Re-detecting BPM on subsequent plays or re-imports of the same file.

## Decisions

### 1. Client-side Web Audio API, no library

**Decision:** Use `OfflineAudioContext` + beat tracking via energy peak detection on the decoded `AudioBuffer`. No npm dependency.

**Rationale:** The browser Audio API is available in all modern browsers, avoids bundle bloat, and the detection accuracy for typical hip-hop/trap beats (60–200 BPM) is sufficient. Libraries like `music-tempo` or `bpm-detective` are unmaintained and add ~20 KB.

**Algorithm sketch:**
1. Decode the `File` as an `ArrayBuffer` via `FileReader`.
2. Decode audio via `OfflineAudioContext.decodeAudioData()`.
3. Low-pass filter the decoded buffer to isolate kick/bass energy.
4. Walk the sample data with a sliding window to find energy peaks at intervals.
5. Convert the dominant peak interval to BPM; round to integer; clamp to 40–240.
6. Return `null` if confidence is below threshold (avoids storing obviously wrong values).

**Alternatives considered:**
- `music-tempo` npm package: accurate but unmaintained, adds 30 KB.
- Server-side (NestJS + `librosa`): accurate but requires a backend job and async webhook, out of scope for a pure-frontend app.

### 2. Detection inside `uploadBeat` service, not the hook

**Decision:** `uploadBeat` in `beat.service.ts` runs detection inline after insert and issues a `supabase.from("beat_files").update({ bpm }).eq("id", ...)` before returning the `Beat`.

**Rationale:** Keeps the mutation hook (`useImportBeatMutation`) unchanged. Detection is a data concern, not a UI concern. The `Beat` object returned already has a `bpm` field, so callers automatically receive the detected value.

**Alternatives considered:**
- Detect in the hook (`useImportBeatMutation.ts`) via `onSuccess`: would mix UI-layer concerns with audio analysis; also forces the hook to know about detection logic.
- Separate mutation (`useDetectBpmMutation`): adds UI complexity — two-step mutation, loading states, and the BPM value arrives asynchronously after the import finishes.

### 3. Silent failure on detection error

**Decision:** If `detectBpm` throws (e.g., the file is corrupt, unsupported codec, or context is unavailable), `uploadBeat` catches the error, skips the `update`, and returns the `Beat` with `bpm: null`. The upload itself is never failed due to detection.

**Rationale:** BPM is a quality-of-life feature. Failing the entire upload because the analysis is uncertain would be a poor UX. `null` is already modelled in the type and renders gracefully in `BpmBadge`.

### 4. New util file `beat.utils.ts` for `detectBpm`

**Decision:** Pure analysis logic lives in `src/modules/workspace/utils/beat.utils.ts`, not inside `beat.service.ts`.

**Rationale:** Keeps the service slim and focused on I/O. The util function takes an `ArrayBuffer` and returns `Promise<number | null>`, making it independently testable without Supabase mocks.

## Risks / Trade-offs

- **Accuracy on non-standard beats** → Detection is probabilistic; wrap with `| null` fallback so inaccurate results are not stored. Users can tolerate `null` better than a wrong number.
- **Large file decode time (> 5 min beat)** → `OfflineAudioContext.decodeAudioData` may block for several seconds on very large MP3s; acceptable since it runs after upload completes and the spinner is already shown.
- **Codec support** → `AudioContext.decodeAudioData` supports MP3, WAV, AAC, OGG in all target browsers. Exotic codecs (e.g., FLAC in Safari < 16) will throw and be caught; BPM falls back to `null`.
- **Single Supabase round-trip overhead** → The extra `update` call adds ~100 ms after insert; negligible relative to upload time. Could be combined into a Supabase Edge Function in a future change.

## Migration Plan

1. `uploadBeat` changes are non-breaking: existing `beat_files` rows keep `bpm: null`; no data migration needed.
2. New beats uploaded after this change will have `bpm` populated if detection succeeds.
3. No schema changes to Supabase (column already exists).
4. No changes to the public module barrel (`index.ts`).
5. Rollback: revert `beat.service.ts` and delete `beat.utils.ts`. No data is affected.

## Open Questions

- Should we add a `useBpmDetectionQuery` hook later that allows retroactive BPM detection for existing beats (re-fetch the file from storage and run detection on demand)? Deferred to a future change.
- Should the `bpm` update be an upsert or a separate RPC to keep the service function atomic? Current design: two sequential Supabase calls (insert → update). Simple enough at this scale.
