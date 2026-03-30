## 1. BPM Detection Utility

- [x] 1.1 Create `src/modules/workspace/utils/beat.utils.ts` with a `detectBpm(buffer: ArrayBuffer): Promise<number | null>` function using `OfflineAudioContext` energy-peak analysis
- [x] 1.2 Add a low-pass filter step in `detectBpm` to isolate kick/bass frequencies before peak analysis
- [x] 1.3 Add clamping logic: discard any raw BPM estimate outside the 40–240 range and return `null`
- [x] 1.4 Wrap `decodeAudioData` and the peak-analysis pass in `try/catch`; return `null` on any error (never throw)

## 2. Service Layer Update

- [x] 2.1 In `src/modules/workspace/services/beat.service.ts`, after the `beat_files` insert succeeds, call `detectBpm` with `await file.arrayBuffer()`
- [x] 2.2 If `detectBpm` returns a non-null value, issue a Supabase `update` on `beat_files` setting `bpm` for the newly inserted row id
- [x] 2.3 Wrap the detection + update block in `try/catch` so any error silently skips the BPM write without aborting the upload
- [x] 2.4 Update the `Beat` object returned by `uploadBeat` to carry the detected `bpm` value (instead of always `null`)

## 3. Mock Update

- [x] 3.1 Verify `workspace.handlers.ts` mock already returns `bpm: 120` for the upload endpoint — no change needed if confirmed
- [x] 3.2 Update `workspace.fixtures.ts` `mockBeat` fixture to reflect `bpm: 120` (confirm it is not `null`) to keep mock data consistent with the new real behavior

## 4. Verification

- [x] 4.1 Manually test: upload an MP3 beat in the editor — confirm the `BpmBadge` shows a detected integer (not empty) in the production Supabase environment
- [x] 4.2 Manually test: confirm the upload still succeeds when given an audio file that fails decoding (expected: `bpm` stays `null`, no error toast)
- [x] 4.3 Check `beat_files` table in Supabase dashboard — confirm `bpm` column is populated after a new upload
