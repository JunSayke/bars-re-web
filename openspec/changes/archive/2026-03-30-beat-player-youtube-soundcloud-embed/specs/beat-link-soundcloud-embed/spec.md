## ADDED Requirements

### Requirement: User can submit a SoundCloud link as the session beat source
The system SHALL accept a valid SoundCloud track URL from the user and persist it as the session's active beat source in the `beat_links` table with `provider = "soundcloud"`.

#### Scenario: Valid SoundCloud track URL submitted
- **WHEN** the user enters a valid SoundCloud track URL (e.g. `https://soundcloud.com/<user>/<track>`) in the Beat Link input and submits
- **THEN** the system validates the URL against the SoundCloud URL pattern, detects `provider = "soundcloud"`, inserts a row in `beat_links` with the correct `session_id`, `url`, and `provider`, and the SoundCloud embed player becomes visible in the Beat Link panel

#### Scenario: SoundCloud URL embed construction
- **WHEN** a SoundCloud URL of the form `https://soundcloud.com/<user>/<track>` is stored
- **THEN** the iframe `src` SHALL be constructed as `https://w.soundcloud.com/player/?url=<encodeURIComponent(url)>&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false` and the iframe height SHALL be `166px`

#### Scenario: Unsupported SoundCloud URL variant rejected
- **WHEN** the user enters a soundcloud.com URL that does not match the track pattern (e.g. a set or user profile URL that the regex cannot confirm as a track)
- **THEN** the system SHALL display the unified validation error and SHALL NOT submit the request

#### Scenario: Duplicate link replaced for same session (SoundCloud)
- **WHEN** the user submits a new SoundCloud link while a `beat_links` row already exists for the session
- **THEN** the system MUST delete the previous `beat_links` row before inserting the new one; at most one link record SHALL exist per session at any time
