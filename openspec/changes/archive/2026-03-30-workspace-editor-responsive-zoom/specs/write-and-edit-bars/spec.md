## MODIFIED Requirements

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
- **THEN** the root `<div>` of `BarsEditor` SHALL have an inline `fontSize` equal to `\${zoomScale}rem` causing all descendant text to scale proportionally
