## ADDED Requirements

### Requirement: Panel opens from workspace window menu
The system SHALL render a `ThesaurusPanel` floating window when the user enables the "Thesaurus" toggle in `WorkspaceWindowMenu`. The panel SHALL be dismissed when the toggle is unchecked or the panel's close button is clicked.

#### Scenario: Open panel via workspace menu
- **WHEN** the user checks "Thesaurus" in the workspace window menu
- **THEN** the `ThesaurusPanel` floating window appears on screen

#### Scenario: Close panel via close button
- **WHEN** the user clicks the close (×) button inside the `ThesaurusPanel`
- **THEN** the panel is removed from the screen and "Thesaurus" is unchecked in the menu

### Requirement: Panel is draggable
The `ThesaurusPanel` SHALL be repositionable by dragging its header bar anywhere within the viewport. Position SHALL be clamped so the panel cannot be dragged fully off-screen.

#### Scenario: Drag panel to a new position
- **WHEN** the user presses and holds on the panel header, then moves the cursor
- **THEN** the panel follows the cursor position

#### Scenario: Panel stays within viewport bounds
- **WHEN** the user drags the panel toward the edge of the viewport
- **THEN** the panel position is clamped so at least the header remains visible

### Requirement: Panel is resizable
The `ThesaurusPanel` SHALL be resizable by dragging the bottom-right resize handle. Width and height SHALL not fall below a minimum size (300 × 400 px).

#### Scenario: Resize panel by dragging handle
- **WHEN** the user drags the bottom-right resize handle
- **THEN** the panel dimensions update proportionally

#### Scenario: Minimum size is enforced
- **WHEN** the user drags the resize handle beyond the minimum dimensions
- **THEN** the panel size is clamped to the minimum (300 × 400 px)

### Requirement: Tab navigation shell
The `ThesaurusPanel` SHALL display five tabs: Word Lookup, Rhyme, Synonyms, Anagrams, Wordplay. Word Lookup SHALL be selected by default. The active tab SHALL have a purple bottom-border indicator. The remaining four tabs SHALL be visually de-emphasised (stub state) and non-functional.

#### Scenario: Word Lookup tab active by default
- **WHEN** the `ThesaurusPanel` first opens
- **THEN** the "Word Lookup" tab is active and its content is visible

#### Scenario: Stub tabs are disabled
- **WHEN** the user clicks Rhyme, Synonyms, Anagrams, or Wordplay
- **THEN** the tab receives no visual active state and no new content appears

### Requirement: Query input accepts a Bisaya term
The Word Lookup tab SHALL display a single-line text input labelled "Query" with placeholder "Enter Bisaya term…". Submitting the form (pressing Enter or a submit trigger) SHALL fire the word lookup request with the trimmed, non-empty term.

#### Scenario: Submit a valid term
- **WHEN** the user types a non-empty term and presses Enter
- **THEN** the lookup request is fired and a loading state is shown

#### Scenario: Empty input is ignored
- **WHEN** the user attempts to submit with an empty or whitespace-only input
- **THEN** no request is fired

### Requirement: Results card shows word, definition, homonyms, and translations
After a successful word lookup, the Results card SHALL display:
1. The queried word as a prominent header.
2. A "Definition" section with one or more definition strings.
3. A "Homonyms" section with pill/chip buttons for each homonym.
4. A "Translations" section with English translation lines.

Each section SHALL have a small expand/collapse toggle icon (chevron or arrow).

#### Scenario: Successful lookup renders result card
- **WHEN** the API returns a `WordLookupResult` for the queried term
- **THEN** the word header, definition, homonyms, and translations are rendered in the results card

#### Scenario: Homonym chip triggers new lookup
- **WHEN** the user clicks a homonym chip
- **THEN** the query input is populated with that homonym and a new lookup request fires

### Requirement: Loading skeleton state
While a word lookup request is in-flight, the results area SHALL display animated skeleton placeholder bars in place of the word header, definition, homonyms, and translations.

#### Scenario: Loading state while fetching
- **WHEN** a lookup request is in-flight
- **THEN** skeleton placeholder bars are shown instead of real content

### Requirement: Empty and error states
If the API returns no matching entry, the results card SHALL display a "No results found for '<term>'" message. If the request fails, a generic error message SHALL be shown.

#### Scenario: No results returned
- **WHEN** the API returns an empty result for the queried term
- **THEN** a "No results found" message is displayed

#### Scenario: API error
- **WHEN** the API request fails with a non-2xx status
- **THEN** an error message is displayed in the results area

### Requirement: Navigate to Tool button
The results card SHALL include a diamond-shaped purple icon button in the bottom-right corner. Clicking it SHALL be a no-op stub in this change (placeholder for future cross-tab navigation).

#### Scenario: Navigate button is visible after a result is displayed
- **WHEN** a word lookup result is shown
- **THEN** the diamond navigate button is visible

#### Scenario: Navigate button click is a no-op stub
- **WHEN** the user clicks the diamond navigate button
- **THEN** nothing navigates (stub; no error thrown)

### Requirement: MSW mock handler for word lookup
In development and test environments, `GET /thesaurus/lookup?query=<term>` SHALL be handled by MSW and return a fixture `WordLookupResult`. A small set of Bisaya fixture words (e.g., balak, kanta, damgo) SHALL be defined and returned on exact match; all other terms return an empty result.

#### Scenario: Known fixture term returns mock data
- **WHEN** the MSW handler receives a query for a known fixture term (e.g., "balak")
- **THEN** it returns a `WordLookupResult` with definition, homonyms, and translations

#### Scenario: Unknown term returns empty result
- **WHEN** the MSW handler receives a query for an unrecognised term
- **THEN** it returns a `WordLookupResult` with empty definition, homonyms, and translations arrays
