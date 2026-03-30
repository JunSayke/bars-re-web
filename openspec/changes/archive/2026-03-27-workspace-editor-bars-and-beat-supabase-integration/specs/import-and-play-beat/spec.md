## MODIFIED Requirements

### Requirement: User can upload a beat file to the editor session
The system SHALL allow the user to upload a local audio file (MP3, WAV, or OGG, maximum 20 MB) from within the editor workspace. After a successful upload, the file SHALL be stored in Supabase Storage under the `beats` bucket using the path `{userId}/{sessionId}/{timestamp}-{sanitizedFileName}`, a corresponding `beat_files` row SHALL be inserted with the `storage_path`, `session_id`, `file_size_bytes`, and `source_type = "upload"`, and the audio player SHALL appear at the bottom of the editor.

#### Scenario: Successful beat file upload persists to Supabase
- **WHEN** the user activates the "Upload Beat" trigger and selects a valid audio file (MP3/WAV/OGG, ≤ 20 MB)
- **THEN** the system SHALL upload the file to Supabase Storage, insert a `beat_files` row linked to the current session, generate a signed URL for playback, and display the audio player bar with the file name and BPM badge

#### Scenario: Unsupported file format rejected
- **WHEN** the user attempts to upload a file with an unsupported MIME type (e.g., MP4, PDF)
- **THEN** the system SHALL reject the file client-side before any Supabase call and display an error toast indicating the accepted formats (MP3, WAV, OGG)

#### Scenario: File exceeds maximum size rejected
- **WHEN** the user attempts to upload an audio file larger than 20 MB
- **THEN** the system SHALL reject the file client-side before any Supabase call and display an error toast stating the 20 MB size limit

#### Scenario: Supabase Storage upload failure shows error toast
- **WHEN** the Supabase Storage upload returns an error (e.g., network failure, bucket permission error)
- **THEN** the system SHALL display an error toast and the beat player SHALL NOT appear

---

### Requirement: BPM badge displays stored value or placeholder
The system SHALL display the BPM value stored in `beat_files.bpm` alongside the player controls. Because server-side BPM detection is deferred, the initial upload stores `bpm = null` and the badge SHALL render a placeholder.

#### Scenario: BPM badge shows stored value
- **WHEN** the beat has been uploaded and `beat_files.bpm` contains a non-null integer
- **THEN** the BPM badge SHALL display that integer followed by "BPM" (e.g., "120 BPM")

#### Scenario: BPM badge shows placeholder when BPM is null
- **WHEN** the beat has been uploaded and `beat_files.bpm` is `null`
- **THEN** the BPM badge SHALL display "-- BPM" as a placeholder indicating no value has been detected

---

### Requirement: Beat persists across page reloads
The system SHALL restore the beat player state when the editor is reopened for a session that already has a linked beat.

#### Scenario: Beat player restores on session reload
- **WHEN** a user navigates away from the editor and returns to a session that has a linked `beat_files` row
- **THEN** `getSession` SHALL return the beat's signed storage URL, file name, and BPM, and the editor SHALL automatically render the beat player bar in its ready-to-play state

#### Scenario: Session with no linked beat shows upload trigger
- **WHEN** a user opens a session that has no associated `beat_files` row
- **THEN** the bottom of the editor SHALL display only the "Upload Beat" placeholder trigger and no audio player controls

## REMOVED Requirements

### Requirement: BPM badge uses mock value during development
**Reason:** Replaced by actual Supabase-persisted BPM data. The MSW mock handler (`POST /sessions/:id/beat`) is no longer in the code path for beat uploads; `useImportBeatMutation` calls `beat.service.ts` which writes to Supabase Storage directly.
**Migration:** The `BpmBadge` atom now renders the value returned from `beat_files.bpm` (nullable). The mock handler in `workspace.handlers.ts` remains in the file for reference but is no longer invoked by any hook.
