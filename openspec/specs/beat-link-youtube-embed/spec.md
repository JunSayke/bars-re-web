# beat-link-youtube-embed Specification

## Purpose
TBD - added by spec sync for beat-player-youtube-soundcloud-embed.
## Requirements
### Requirement: YouTube embed player supports watch and short link formats
The system SHALL accept YouTube links in both `https://www.youtube.com/watch?v=<id>` and `https://youtu.be/<id>` forms and render a standard YouTube iframe in the Beat Link panel.

#### Scenario: YouTube watch URL
- **WHEN** the user submits `https://www.youtube.com/watch?v=<id>`
- **THEN** provider is detected as "youtube" and the iframe src is `https://www.youtube.com/embed/<id>`

#### Scenario: YouTube short URL
- **WHEN** the user submits `https://youtu.be/<id>`
- **THEN** provider is detected as "youtube" and the iframe src is `https://www.youtube.com/embed/<id>`
