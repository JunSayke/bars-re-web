## ADDED Requirements

### Requirement: User can upload a beat file to the editor session
The system SHALL allow the user to upload a local audio file (MP3, WAV, or OGG, maximum 20 MB) from within the editor workspace. After a successful upload, the beat SHALL be linked to the active session and the audio player SHALL appear at the bottom of the editor.

#### Scenario: Successful beat file upload
- **WHEN** the user activates the "Upload Beat" trigger and selects a valid audio file (MP3/WAV/OGG, ≤ 20 MB)
- **THEN** the system SHALL display the audio player bar at the bottom of the editor with the uploaded file name and the detected BPM badge

#### Scenario: Unsupported file format rejected
- **WHEN** the user attempts to upload a file with an unsupported MIME type (e.g., MP4, PDF)
- **THEN** the system SHALL reject the file and display an error toast indicating the accepted formats (MP3, WAV, OGG)

#### Scenario: File exceeds maximum size rejected
- **WHEN** the user attempts to upload an audio file larger than 20 MB
- **THEN** the system SHALL reject the file and display an error toast stating the 20 MB size limit

---

### Requirement: Audio player bar is rendered at the bottom of the editor
The system SHALL render a persistent `BeatPlayerBar` fixed to the bottom of the editor viewport once a beat has been successfully uploaded. The player bar SHALL NOT scroll with the lyrics content.

#### Scenario: Player bar appears after upload
- **WHEN** a beat file has been successfully uploaded and linked to the session
- **THEN** the `BeatPlayerBar` SHALL be visible at the bottom of the editor with the file name, transport controls, BPM badge, timestamp, and seek bar

#### Scenario: Player bar absent before upload
- **WHEN** no beat has been linked to the active session
- **THEN** the bottom of the editor SHALL display the "Upload Beat" placeholder trigger and NO audio player controls

---

### Requirement: User can play and pause the beat
The system SHALL allow the user to toggle playback of the imported beat using a play/pause button in the audio player bar.

#### Scenario: User starts playback
- **WHEN** the user clicks the play button while the audio is paused
- **THEN** the audio SHALL begin playing and the button icon SHALL change to a pause state

#### Scenario: User pauses playback
- **WHEN** the user clicks the pause button while the audio is playing
- **THEN** the audio SHALL pause and the button icon SHALL change to a play state

---

### Requirement: User can see and control playback position
The system SHALL display the current playback position and total duration as `MM:SS / MM:SS`. The system SHALL allow the user to scrub to any position using the seek bar.

#### Scenario: Timestamp updates during playback
- **WHEN** the beat is playing
- **THEN** the timestamp display SHALL update in real time to reflect the current playback position

#### Scenario: User scrubs to a new position
- **WHEN** the user drags the seek bar to a new position
- **THEN** playback SHALL resume from the selected position

---

### Requirement: User can skip to the start of the beat
The system SHALL provide a skip-back control that restarts the beat from the beginning.

#### Scenario: Skip back during playback
- **WHEN** the user clicks the skip-back button
- **THEN** the playback position SHALL be reset to 0:00

---

### Requirement: BPM badge is displayed alongside the player controls
The system SHALL display an auto-detected BPM value as a read-only badge. In the mock environment, the mock server SHALL return BPM = 120 for all uploads.

#### Scenario: BPM badge shows detected value
- **WHEN** the beat has been uploaded and the import response contains a BPM value
- **THEN** the BPM badge SHALL display the returned integer followed by "BPM" (e.g., "120 BPM")

#### Scenario: BPM badge uses mock value during development
- **WHEN** the application is running with MSW mocks active and a beat is uploaded
- **THEN** the BPM badge SHALL display "120 BPM" as returned by the mock handler
