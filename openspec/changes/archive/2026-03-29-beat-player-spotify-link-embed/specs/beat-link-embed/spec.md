## ADDED Requirements

### Requirement: User can submit a Spotify link as the session beat source
The system SHALL accept a valid Spotify track, album, or playlist URL from the user and persist it as the session's active beat source in the `beat_links` table.

#### Scenario: Valid Spotify track link submitted
- **WHEN** the user enters a valid Spotify track URL (e.g. `https://open.spotify.com/track/<id>`) in the Beat Link input and submits
- **THEN** the system validates the URL against the Spotify URL pattern, inserts a row in `beat_links` with `session_id`, `url`, `provider = "spotify"`, and `bpm = null`, and the Spotify embed player becomes visible in the Beat Link panel

#### Scenario: Valid Spotify album link submitted
- **WHEN** the user enters a valid Spotify album URL and submits
- **THEN** the system persists the link and renders the Spotify embed iframe for the album

#### Scenario: Valid Spotify playlist link submitted
- **WHEN** the user enters a valid Spotify playlist URL and submits
- **THEN** the system persists the link and renders the Spotify embed iframe for the playlist

#### Scenario: Unsupported or malformed URL submitted
- **WHEN** the user enters a URL that does not match the Spotify URL pattern
- **THEN** the system SHALL display a validation error below the input field ("Invalid Spotify URL. Use a Spotify track, album, or playlist link.") and SHALL NOT submit the request

#### Scenario: Duplicate link for same session
- **WHEN** the user submits a new Spotify link while a `beat_links` row already exists for the session
- **THEN** the system MUST delete the previous `beat_links` row for the session before inserting the new one, so at most one link record exists per session

---

### Requirement: Spotify embed iframe is rendered in the Beat Link panel
The system SHALL render a Spotify embed iframe (`https://open.spotify.com/embed/<type>/<id>`) in the Beat Link panel once a valid link is stored for the active session.

#### Scenario: Beat Link panel opened with existing Spotify link
- **WHEN** the user opens the Beat Link panel and a `beat_links` row exists for the active session
- **THEN** the embed iframe SHALL be visible and the link input SHALL be pre-filled with the stored URL

#### Scenario: Beat Link panel opened with no stored link
- **WHEN** the user opens the Beat Link panel and no `beat_links` row exists for the session
- **THEN** only the URL input and a submit button SHALL be shown; no iframe SHALL be rendered

#### Scenario: Iframe embed URL construction
- **WHEN** a Spotify URL of the form `https://open.spotify.com/<type>/<id>` is stored
- **THEN** the iframe `src` SHALL be set to `https://open.spotify.com/embed/<type>/<id>?utm_source=generator`

---

### Requirement: `beat_links` table persists embedded link metadata
The `beat_links` Supabase table SHALL exist with the following schema:

```sql
create table public.beat_links (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references sessions(id) on delete cascade,
  url          varchar(2048) not null,
  provider     varchar(20) not null default 'spotify',
  bpm          integer null
);
```

#### Scenario: Row inserted on link submission
- **WHEN** the user successfully submits a Spotify link
- **THEN** a row MUST exist in `beat_links` with the correct `session_id`, `url`, and `provider = 'spotify'`

#### Scenario: Row deleted on session deletion
- **WHEN** the parent session is deleted
- **THEN** all associated `beat_links` rows SHALL be cascade-deleted

---

### Requirement: Session rehydration loads stored Spotify link on editor mount
The system SHALL query `beat_links` for the active session when the editor loads and render the stored Spotify embed if a row is found.

#### Scenario: Editor mounted with stored beat link
- **WHEN** the editor mounts for a session that has a `beat_links` row
- **THEN** the Beat Link panel SHALL automatically show the Spotify embed iframe without the user having to resubmit the URL

#### Scenario: Editor mounted with no beat link
- **WHEN** the editor mounts for a session that has no `beat_links` row
- **THEN** the Beat Link panel SHALL show only the empty URL input

---

### Requirement: Beat Link panel is accessible from the WorkspaceWindowMenu
The Beat Link panel SHALL replace the `Library` checkbox entry in the `WorkspaceWindowMenu` at the bottom-right of the editor.

#### Scenario: Beat Link checkbox toggled on
- **WHEN** the user checks the `Beat Link` checkbox in the workspace menu
- **THEN** the Beat Link panel SHALL slide open/become visible in the editor layout

#### Scenario: Beat Link checkbox toggled off
- **WHEN** the user unchecks the `Beat Link` checkbox
- **THEN** the Beat Link panel SHALL close; the stored embed link is not affected
