## ADDED Requirements

### Requirement: System detects BPM from uploaded beat audio client-side
After a beat file is uploaded to Supabase Storage, the system SHALL decode the audio client-side using the Web Audio API (`OfflineAudioContext`) and compute the dominant tempo as an integer BPM. The detected value SHALL be written to `beat_files.bpm` via a Supabase `update` before the upload flow completes. If detection fails for any reason (unsupported codec, corrupt file, low confidence), the system SHALL silently leave `bpm` as `null` and SHALL NOT fail the overall upload.

#### Scenario: BPM detected and persisted for a valid beat file
- **WHEN** the user imports a valid audio file (MP3, WAV, OGG) and the BPM detection algorithm returns a value in the range 40–240
- **THEN** the system SHALL update `beat_files.bpm` with the detected integer and the returned `Beat` object SHALL carry the non-null `bpm` value

#### Scenario: Detection silently skipped on unsupported or corrupt audio
- **WHEN** `OfflineAudioContext.decodeAudioData` throws during BPM detection
- **THEN** the system SHALL catch the error, leave `beat_files.bpm` as `null`, and return the `Beat` object with `bpm: null` — the upload SHALL still succeed

#### Scenario: Detection silently skipped when confidence is below threshold
- **WHEN** the peak-energy analysis does not produce a dominant BPM candidate with sufficient confidence
- **THEN** the system SHALL not write to `beat_files.bpm`, leave the value as `null`, and continue normally

#### Scenario: Detected BPM is clamped to valid range
- **WHEN** the raw analysis produces a value outside 40–240 BPM
- **THEN** the system SHALL discard that value (treat as detection failure), leave `bpm` as `null`, and SHALL NOT store the out-of-range integer

---

### Requirement: `detectBpm` utility is a pure, side-effect-free function
The `detectBpm` function in `src/modules/workspace/utils/beat.utils.ts` SHALL accept an `ArrayBuffer` and return `Promise<number | null>`. It SHALL have no Supabase imports, no React imports, and no side effects beyond the `OfflineAudioContext` audio decoding.

#### Scenario: `detectBpm` returns integer for analyzable audio
- **WHEN** passed a valid audio `ArrayBuffer`
- **THEN** the function SHALL return a `Promise` that resolves to a positive integer in the range 40–240

#### Scenario: `detectBpm` returns null for undecodable audio
- **WHEN** passed an `ArrayBuffer` that cannot be decoded by `OfflineAudioContext`
- **THEN** the function SHALL return a `Promise` that resolves to `null` without throwing
