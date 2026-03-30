# write-and-edit-bars Specification

## Purpose
TBD - created by archiving change workspace-editor-write-and-edit-bars. Update Purpose after archive.
## Requirements
### Requirement: Display bar input rows organized by section
The editor SHALL render a scrollable list of bar input rows grouped under named section labels (e.g., VERSE 1, CHORUS, VERSE 2). Each section label SHALL be displayed as a left-bordered uppercase heading. Bar rows SHALL be numbered sequentially across all sections (01, 02, 03…). Each row SHALL contain a single-line text input where the user types one lyric line. The Thesaurus panel accessible from the editor SHALL resolve word data from the bundled `@junsayke/cebuano-thesaurus` dictionary via the internal Route Handler instead of an external API.

The `BarsEditor` organism SHALL accept a `zoomScale: number` prop and apply it as an inline `fontSize` style on its root element so all text within the writing area scales uniformly.

#### Scenario: Bars display in correct section groupings
- **WHEN** the editor loads a session with bars belonging to multiple sections
- **THEN** bars SHALL be visually grouped under their respective section labels in the order: verse sections ascending, then chorus, then bridge/other

#### Scenario: Bar rows are globally numbered
- **WHEN** the editor renders bars across multiple sections
- **THEN** each bar row SHALL show a sequential two-digit line number (01, 02, 03…) that increments across all sections

#### Scenario: Empty session shows at least one input row
- **WHEN** a new session with no bars is opened in the editor
- **THEN** the editor SHALL display one empty bar input row in a default "VERSE 1" section ready for input

#### Scenario: BarsEditor root applies zoom font size
- **WHEN** `zoomScale` prop is set to a value other than 1.0
- **THEN** the root `<div>` of `BarsEditor` SHALL have an inline `fontSize` equal to `${zoomScale}rem` causing all descendant text to scale proportionally

---

### Requirement: Add a new bar row
The editor SHALL allow the user to append a new empty bar input row to a section.

#### Scenario: Add bar to a section
- **WHEN** the user presses Enter at the end of a bar input or clicks the add-bar control
- **THEN** a new empty bar input row SHALL be inserted immediately after the current bar in the same section and focused automatically

#### Scenario: Add bar at end of section
- **WHEN** the user activates the add-bar action with the last bar in a section selected
- **THEN** a new empty bar SHALL be appended at the end of that section

---

### Requirement: Remove a bar row
The editor SHALL allow the user to delete an existing bar row.

#### Scenario: Remove a bar
- **WHEN** the user activates the remove-bar action on a non-empty bar row
- **THEN** the bar SHALL be removed from the section and remaining bars renumbered

#### Scenario: Remove last bar in section
- **WHEN** the user removes the last bar in a section that has more than one section
- **THEN** the empty section group SHALL be removed along with the bar

#### Scenario: Cannot remove the only remaining bar
- **WHEN** the session has exactly one bar row and the user attempts to remove it
- **THEN** the remove action SHALL be disabled and the bar SHALL remain

---

### Requirement: Real-time syllable and bar count badge per section
The editor SHALL display a read-only badge below each section showing `SYLLABLES: N | BARS: N`, where N is computed from the current section's bar texts.

#### Scenario: Badge updates on text change
- **WHEN** the user types in any bar input within a section
- **THEN** the syllable count and bar count badge for that section SHALL update reactively without requiring a save

#### Scenario: Badge reflects all bars in section
- **WHEN** a section contains multiple bars with mixed content
- **THEN** the badge SHALL show the sum of syllable counts across all bars and the total count of bars in that section

#### Scenario: Empty bars are excluded from syllable count
- **WHEN** a bar input row is empty
- **THEN** it SHALL NOT contribute syllables to the section badge but SHALL be counted in the bar count

---

### Requirement: Word count indicator
The editor SHALL display a running word count across all bars relative to the 1000-word limit.

#### Scenario: Word count shows current / max
- **WHEN** the editor is open and contains bars
- **THEN** a word count indicator SHALL display in the format `Words: N / 1000`

#### Scenario: Warning at 80% of word limit
- **WHEN** the total word count across all bars reaches 800 or more
- **THEN** the word count indicator SHALL change to a warning visual state (e.g., amber color)

#### Scenario: Word count at limit
- **WHEN** the total word count reaches exactly 1000
- **THEN** the word count indicator SHALL display a "limit reached" visual state and auto-save SHALL be blocked

---

### Requirement: Debounced auto-save
The editor SHALL automatically save the current bars to the backend after the user stops typing for 1 second, with a maximum save interval of 30 seconds regardless of ongoing editing.

#### Scenario: Auto-save triggers after idle
- **WHEN** the user stops typing for 1 second
- **THEN** the editor SHALL dispatch a save request to `PATCH /sessions/:id/draft` with the full bars array

#### Scenario: Auto-save triggers at 30-second ceiling
- **WHEN** the user is continuously typing and 30 seconds have elapsed since the last save
- **THEN** the editor SHALL dispatch a save request regardless of current typing activity

#### Scenario: Word limit blocks auto-save
- **WHEN** the total word count exceeds 1000 at the time of auto-save
- **THEN** the save SHALL be rejected with a word limit error and the auto-save status SHALL show a limit warning

---

### Requirement: Auto-save status indicator
The editor SHALL display a non-intrusive status indicator reflecting the current save state.

#### Scenario: Indicator shows "Saving…" during request
- **WHEN** an auto-save request is in flight
- **THEN** the status indicator SHALL display "Saving…"

#### Scenario: Indicator shows "Saved" on success
- **WHEN** the auto-save request completes successfully
- **THEN** the status indicator SHALL display "Saved" and remain visible for at least 2 seconds before fading

#### Scenario: Indicator shows "Save failed" on error
- **WHEN** the auto-save request fails due to a network or server error
- **THEN** the status indicator SHALL display "Save failed" in a warning visual state and SHALL NOT disappear until the next successful save

---

### Requirement: Load session and bars on open
The editor SHALL fetch the active session and its bars from the backend on mount.

#### Scenario: Session loads successfully
- **WHEN** the editor page mounts with a valid session ID
- **THEN** it SHALL fetch `GET /sessions/:id` and populate the bar input rows with the returned bars and sections

#### Scenario: Session loading state
- **WHEN** the session fetch is in flight
- **THEN** the editor SHALL display a loading skeleton in place of bar rows

#### Scenario: Session fetch error
- **WHEN** the `GET /sessions/:id` request fails
- **THEN** the editor SHALL display an error state with a retry option

---

### Requirement: Editor top navigation bar
The editor page SHALL display a top navigation bar that allows the user to navigate back to the sessions library and view the current session name.

#### Scenario: Back to Library navigation
- **WHEN** the user clicks "Back to Library" in the top nav
- **THEN** the user SHALL be navigated to `/workspaces`

#### Scenario: Session name displayed in top nav
- **WHEN** the editor is open and the session has been loaded
- **THEN** the session title SHALL be displayed in the top navigation bar

---

### Requirement: MSW mock for editor API endpoints
The workspace module SHALL register MSW handlers for `GET /sessions/:id` and `PATCH /sessions/:id/draft` so the editor is fully functional in local development without a real backend.

#### Scenario: Mock session loads with pre-populated bars
- **WHEN** the editor page mounts in MSW-enabled development mode
- **THEN** `GET /sessions/:id` SHALL return a fixture session with at least two sections (VERSE 1, CHORUS) and multiple bars per section matching the UI mockup

#### Scenario: Mock draft save returns success
- **WHEN** the editor dispatches a `PATCH /sessions/:id/draft` request in MSW-enabled development mode
- **THEN** the handler SHALL return a 200 OK with a `SaveResult(success)` payload

