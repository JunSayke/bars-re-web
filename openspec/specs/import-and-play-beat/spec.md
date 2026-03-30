# import-and-play-beat Specification

## Purpose
TBD - created by archiving change beat-player-youtube-soundcloud-embed. Update Purpose after archive.
## Requirements
### Requirement: Beat source selection presents two modes — file upload and link embed
The import flow SHALL offer the user two distinct modes for setting a session beat: uploading a local audio file or embedding a link from Spotify, YouTube, or SoundCloud. The existing file-upload path MUST remain functionally unchanged.

#### Scenario: File upload mode selected (unchanged)
- **WHEN** the user interacts with the `BeatPlayerBar` upload trigger (file icon / "Upload Beat" button)
- **THEN** the file-picker dialog SHALL open and the upload flow SHALL proceed as before

#### Scenario: Link embed mode accessed via Beat Link panel
- **WHEN** the user opens the `Beat Link` panel via the workspace checkbox menu
- **THEN** the user SHALL be presented with a URL input and submit button that accepts links from Spotify, YouTube, or SoundCloud — independent of the `BeatPlayerBar` file-upload trigger

#### Scenario: Active beat source indicator — link vs. file
- **WHEN** a link from any supported provider is the most recently set beat source for the session
- **THEN** the `BeatPlayerBar` SHALL NOT show the embed (playback happens inside the Beat Link panel's provider-specific iframe); the `BeatPlayerBar` remains available for file upload if the user wants to switch sources

#### Scenario: Switching from link back to file
- **WHEN** the user uploads a new audio file while a `beat_links` row exists for the session
- **THEN** the `useImportBeatMutation` flow completes as usual and the `beat_links` row is NOT deleted but is visually superseded
