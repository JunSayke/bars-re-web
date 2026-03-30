# beat-link-soundcloud-embed Specification

## Purpose
TBD - added by spec sync for beat-player-youtube-soundcloud-embed.
## Requirements
### Requirement: SoundCloud embed player accepts track URLs
The system SHALL accept a SoundCloud track URL of the form `https://soundcloud.com/<user>/<track>` and render the correct SoundCloud widget iframe.

#### Scenario: SoundCloud track URL
- **WHEN** the user submits `https://soundcloud.com/<user>/<track>`
- **THEN** provider is detected as "soundcloud" and the iframe src is `https://w.soundcloud.com/player/?url=<encodeURIComponent(url)>&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
