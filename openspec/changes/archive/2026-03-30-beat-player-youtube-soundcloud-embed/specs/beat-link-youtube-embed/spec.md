## ADDED Requirements

### Requirement: User can submit a YouTube link as the session beat source
The system SHALL accept a valid YouTube watch URL or short URL from the user and persist it as the session's active beat source in the `beat_links` table with `provider = "youtube"`.

#### Scenario: Valid YouTube watch URL submitted
- **WHEN** the user enters a valid YouTube watch URL (e.g. `https://www.youtube.com/watch?v=<id>`) in the Beat Link input and submits
- **THEN** the system validates the URL against the YouTube URL pattern, detects `provider = "youtube"`, inserts a row in `beat_links` with the correct `session_id`, `url`, and `provider`, and the YouTube embed player becomes visible in the Beat Link panel

#### Scenario: Valid YouTube short URL submitted
- **WHEN** the user enters a valid short YouTube URL (e.g. `https://youtu.be/<id>`) and submits
- **THEN** the system validates the URL, extracts the video ID, persists the row with `provider = "youtube"`, and renders the YouTube embed iframe

#### Scenario: YouTube URL embed construction
- **WHEN** a YouTube URL of the form `https://www.youtube.com/watch?v=<id>` or `https://youtu.be/<id>` is stored
- **THEN** the iframe `src` SHALL be set to `https://www.youtube.com/embed/<id>`

#### Scenario: Unsupported YouTube URL variant rejected
- **WHEN** the user enters a URL from YouTube that does not match the watch or short-link pattern (e.g. a channel URL, shorts URL, or music.youtube.com URL)
- **THEN** the system SHALL display the unified validation error ("Invalid URL. Paste a link from Spotify, YouTube, or SoundCloud.") and SHALL NOT submit the request

#### Scenario: Duplicate link replaced for same session (YouTube)
- **WHEN** the user submits a new YouTube link while a `beat_links` row already exists for the session
- **THEN** the system MUST delete the previous `beat_links` row before inserting the new one; at most one link record SHALL exist per session at any time
