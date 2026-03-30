# beat-link-embed Specification

## Purpose
TBD - created by archiving change beat-player-youtube-soundcloud-embed. Update Purpose after archive.
## Requirements
### Requirement: User can submit a link from any supported provider as the session beat source
The system SHALL accept a valid URL from Spotify, YouTube, or SoundCloud from the user and persist it as the session's active beat source in the `beat_links` table. The provider SHALL be detected automatically from the URL — no provider selector is shown to the user.

#### Scenario: Valid Spotify track link submitted
- **WHEN** the user enters a valid Spotify track URL (e.g. `https://open.spotify.com/track/<id>`) in the Beat Link input and submits
- **THEN** the system validates the URL, detects `provider = "spotify"`, inserts a row in `beat_links` with `session_id`, `url`, `provider = "spotify"`, and `bpm = null`, and the Spotify embed player becomes visible in the Beat Link panel

#### Scenario: Valid Spotify album link submitted
- **WHEN** the user enters a valid Spotify album URL and submits
- **THEN** the system persists the link with `provider = "spotify"` and renders the Spotify embed iframe for the album

#### Scenario: Valid Spotify playlist link submitted
- **WHEN** the user enters a valid Spotify playlist URL and submits
- **THEN** the system persists the link with `provider = "spotify"` and renders the Spotify embed iframe for the playlist

#### Scenario: Valid YouTube watch URL submitted
- **WHEN** the user enters a valid YouTube watch URL (e.g. `https://www.youtube.com/watch?v=<id>`) and submits
- **THEN** the system validates the URL, detects `provider = "youtube"`, persists the row, and renders the YouTube embed player

#### Scenario: Valid YouTube short URL submitted
- **WHEN** the user enters a valid short YouTube URL (`https://youtu.be/<id>`) and submits
- **THEN** the system detects `provider = "youtube"`, persists the row, and renders the YouTube embed player

#### Scenario: Valid SoundCloud track URL submitted
- **WHEN** the user enters a valid SoundCloud track URL (`https://soundcloud.com/<user>/<track>`) and submits
- **THEN** the system detects `provider = "soundcloud"`, persists the row, and renders the SoundCloud embed player

#### Scenario: Unsupported or malformed URL submitted
- **WHEN** the user enters a URL that does not match the Spotify, YouTube, or SoundCloud URL patterns
- **THEN** the system SHALL display a validation error below the input field ("Invalid URL. Paste a link from Spotify, YouTube, or SoundCloud.") and SHALL NOT submit the request

---

### Requirement: Provider-specific embed player is rendered in the Beat Link panel
The system SHALL render the appropriate embed player iframe in the Beat Link panel based on the `provider` field of the stored `beat_links` row.

#### Scenario: Beat Link panel opened with existing Spotify link
- **WHEN** the user opens the Beat Link panel and a `beat_links` row with `provider = "spotify"` exists for the active session
- **THEN** the Spotify embed iframe SHALL be visible and the link input SHALL be pre-filled with the stored URL

#### Scenario: Beat Link panel opened with existing YouTube link
- **WHEN** the user opens the Beat Link panel and a `beat_links` row with `provider = "youtube"` exists for the active session
- **THEN** the YouTube embed iframe SHALL be visible and the link input SHALL be pre-filled with the stored URL

#### Scenario: Beat Link panel opened with existing SoundCloud link
- **WHEN** the user opens the Beat Link panel and a `beat_links` row with `provider = "soundcloud"` exists for the active session
- **THEN** the SoundCloud embed iframe SHALL be visible and the link input SHALL be pre-filled with the stored URL

#### Scenario: Beat Link panel opened with no stored link
- **WHEN** the user opens the Beat Link panel and no `beat_links` row exists for the session
- **THEN** only the URL input and a submit button SHALL be shown; no iframe SHALL be rendered

#### Scenario: Spotify iframe embed URL construction
- **WHEN** a Spotify URL is stored
- **THEN** the iframe `src` SHALL be `https://open.spotify.com/embed/<type>/<id>?utm_source=generator`

#### Scenario: YouTube iframe embed URL construction
- **WHEN** a YouTube URL is stored
- **THEN** the iframe `src` SHALL be `https://www.youtube.com/embed/<videoId>`

#### Scenario: SoundCloud iframe embed URL construction
- **WHEN** a SoundCloud URL is stored
- **THEN** the iframe `src` SHALL be `https://w.soundcloud.com/player/?url=<encodeURIComponent(url)>&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`

---

### Requirement: Session rehydration loads stored link on editor mount
The system SHALL query `beat_links` for the active session when the editor loads and render the correct provider-specific embed if a row is found.

#### Scenario: Editor mounted with stored Spotify beat link
- **WHEN** the user opens the editor with a session that has a `beat_links` row with `provider = "spotify"`
- **THEN** the Beat Link panel SHALL automatically show the Spotify embed iframe

#### Scenario: Editor mounted with stored YouTube beat link
- **WHEN** the user opens the editor with a session that has a `beat_links` row with `provider = "youtube"`
- **THEN** the Beat Link panel SHALL automatically show the YouTube embed iframe

#### Scenario: Editor mounted with stored SoundCloud beat link
- **WHEN** the user opens the editor with a session that has a `beat_links` row with `provider = "soundcloud"`
- **THEN** the Beat Link panel SHALL automatically show the SoundCloud embed iframe

#### Scenario: Editor mounted with no beat link
- **WHEN** the user opens the editor with no `beat_links` row
- **THEN** the Beat Link panel SHALL show only the empty URL input
