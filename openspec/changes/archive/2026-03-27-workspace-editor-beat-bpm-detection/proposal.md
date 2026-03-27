## Why

When a user imports a beat file, the `beat_files.bpm` column is always stored as `null` — there is no automatic analysis. The `BpmBadge` atom and `BeatPlayerBar` organism already surface BPM in the UI, but they always render empty because no value is ever produced. Detecting BPM at upload time closes this gap and gives users immediate, accurate tempo context while writing bars.

## What Changes

- After a beat file is uploaded to Supabase Storage, the audio is analyzed client-side to detect its BPM using the Web Audio API.
- The detected BPM integer is written back to the `beat_files.bpm` column via a Supabase `update` call.
- The `uploadBeat` service function (or a new `detectAndSaveBpm` service function) is updated to run detection and persist the value.
- The `Beat` type and schema are unchanged — `bpm: number | null` already models the optional case.
- `BpmBadge` and `BeatPlayerBar` immediately display the detected BPM without UI changes needed.
- A new util function `detectBpm(audioBuffer: AudioBuffer): number` is added to the workspace module as the pure analysis logic.

## Capabilities

### New Capabilities

- `beat-bpm-detection`: Client-side BPM analysis of an uploaded beat audio file using the Web Audio API, followed by persisting the detected BPM integer to `beat_files.bpm` in Supabase.

### Modified Capabilities

- `import-and-play-beat`: The beat import flow now includes a BPM detection step after upload. The `Beat` object returned by the service will carry a non-null `bpm` when detection succeeds, instead of always being `null`.

## Impact

- **`src/modules/workspace/services/beat.service.ts`** — `uploadBeat` gains a post-upload BPM detection and write-back step.
- **`src/modules/workspace/utils/beat.utils.ts`** (new) — Pure `detectBpm` utility wrapping the Web Audio `OfflineAudioContext` analysis algorithm.
- **`src/modules/workspace/hooks/useImportBeatMutation.ts`** — No hook changes needed; mutation calls `uploadBeat` which already returns a `Beat`.
- **`beat_files` Supabase table** — No schema changes; `bpm integer null` column exists and is already read by `editor.service.ts`.
- **No UI component changes** — `BpmBadge` and `BeatPlayerBar` already accept `bpm: number | null` and render appropriately.
- **No new npm dependencies required** — BPM detection uses the browser-native Web Audio API (`OfflineAudioContext`, `AudioBuffer`).
