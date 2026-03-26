# manage-verse-snippets

## Purpose

Add support for an in-editor Verse Snippets workspace panel with search, filter, CRUD, insert, and draggable/resizable behavior, plus MSW mock API handlers.

## Requirements

### Requirement: Toggle Verse Snippets panel from workspace window menu
The editor workspace SHALL include a workspace window menu button (bottom-right corner) that opens a floating checklist panel. The checklist SHALL include a "Snippets" toggle. Checking "Snippets" SHALL open the Verse Snippets panel; unchecking it SHALL close the panel.

#### Scenario: Workspace window menu opens
- **WHEN** the user clicks the workspace window menu button (bottom-right corner of the editor page)
- **THEN** a floating checklist panel SHALL appear with toggleable workspace tools including "Snippets"

#### Scenario: Snippets panel opens from menu
- **WHEN** the "Snippets" checkbox in the workspace window menu is checked
- **THEN** the Verse Snippets panel SHALL appear as a floating window overlaid on the editor

#### Scenario: Snippets panel closes from menu
- **WHEN** the "Snippets" checkbox is unchecked
- **THEN** the Verse Snippets panel SHALL be hidden from the editor view

---

### Requirement: Display verse snippets list with search and tag filter
The Verse Snippets panel SHALL display all of the user's snippets as a scrollable list. The panel SHALL include a text search input and a tag filter row (All, Chorus, Verse, Hook, Freestyle, Bridge). The panel SHALL display a count badge showing `N / 200 snippets`.

#### Scenario: Panel renders snippet list
- **WHEN** the Verse Snippets panel is open
- **THEN** it SHALL display up to 80 snippets sorted by most recently modified, each showing: title, content preview (truncated skeleton lines), and tag badges

#### Scenario: Search filters snippets by keyword
- **WHEN** the user types in the search input and presses the Search button (or Enter)
- **THEN** the snippet list SHALL be filtered to show only snippets whose content contains the search keyword (case-insensitive)

#### Scenario: Tag filter narrows snippet list
- **WHEN** the user clicks a tag button (e.g., "Chorus")
- **THEN** only snippets tagged with that tag SHALL be shown; clicking "All" removes the filter

#### Scenario: Snippet count badge displays correctly
- **WHEN** the panel is open
- **THEN** a badge SHALL show the number of currently visible snippets relative to the user's total (e.g., `80 / 200 snippets`)

#### Scenario: Empty state when no snippets match
- **WHEN** the search or tag filter returns no results
- **THEN** the panel SHALL display an empty state message (e.g., "No snippets found")

---

### Requirement: Create a new verse snippet
The Verse Snippets panel SHALL provide a "+ New Snippet" button at the bottom of the panel. Clicking it SHALL open a dialog where the user can enter a title, freeform content, and optional tags. On save, the snippet SHALL be added to the list.

#### Scenario: New snippet dialog opens
- **WHEN** the user clicks "+ New Snippet"
- **THEN** a dialog SHALL appear with a title input (required), a content textarea (required), and a tag multi-select (optional)

#### Scenario: Snippet created successfully
- **WHEN** the user fills in title and content and submits the dialog
- **THEN** a `POST /snippets` request SHALL be dispatched, the dialog SHALL close, and the new snippet SHALL appear at the top of the list

#### Scenario: Snippet creation blocked at 200-snippet limit
- **WHEN** the user already has 200 snippets and attempts to create a new one
- **THEN** the dialog SHALL show an error "You have reached the maximum limit of 200 snippets." and the request SHALL NOT be sent

#### Scenario: Snippet creation blocked when content exceeds 200 words
- **WHEN** the user's content field has more than 200 words
- **THEN** the dialog SHALL show a validation error "Snippet exceeds the maximum limit of 200 words." and the submit button SHALL be disabled

#### Scenario: Live word count in snippet form
- **WHEN** the user is typing in the content textarea
- **THEN** a live word count indicator SHALL display the current count relative to the 200-word limit (e.g., `120 / 200 words`)

---

### Requirement: Edit an existing verse snippet
Each snippet card in the list SHALL include an Edit action. Activating it SHALL open the same snippet dialog pre-populated with the existing title, content, and tags. On save, the snippet SHALL be updated.

#### Scenario: Edit dialog opens pre-populated
- **WHEN** the user activates the edit action on a snippet card
- **THEN** the snippet dialog SHALL open with the existing title, content, and tags pre-filled

#### Scenario: Snippet updated successfully
- **WHEN** the user modifies the content and submits the edit dialog
- **THEN** a `PATCH /snippets/:id` request SHALL be dispatched and the updated snippet SHALL be reflected in the list

#### Scenario: Edit dialog validation enforces 200-word limit
- **WHEN** the user edits the content to exceed 200 words
- **THEN** the dialog SHALL show a validation error and the submit button SHALL be disabled

---

### Requirement: Delete a verse snippet
Each snippet card SHALL include a Delete button. Clicking it SHALL immediately remove the snippet (optimistic) and dispatch a `DELETE /snippets/:id` request. If the request fails, the snippet SHALL be restored to the list.

#### Scenario: Snippet deleted successfully
- **WHEN** the user clicks "Delete" on a snippet card
- **THEN** the snippet SHALL be removed from the list immediately (optimistic delete) and a `DELETE /snippets/:id` request SHALL be dispatched

#### Scenario: Delete failure restores snippet
- **WHEN** the `DELETE /snippets/:id` request returns an error
- **THEN** the snippet SHALL be restored to the list and a toast error SHALL be displayed

---

### Requirement: Insert snippet content into active session
Each snippet card SHALL include an "Insert" button. Clicking it SHALL append the snippet's content as a new bar (or multiple bars, one per line) to the currently active section in the bars editor.

#### Scenario: Insert appends snippet content to current section
- **WHEN** the user clicks "Insert" on a snippet card
- **THEN** each non-empty line of the snippet's content SHALL be inserted as a new bar appended to the last active section in the bars editor

#### Scenario: Insert when no bars are focused uses last section
- **WHEN** no bar is currently focused and the user clicks "Insert"
- **THEN** the snippet content lines SHALL be appended to the last section in the current bars list

---

### Requirement: Draggable and resizable floating panel
The Verse Snippets panel SHALL be implemented as a floating window that the user can drag (by the header) and resize (by the bottom-right corner handle) anywhere within the viewport.

#### Scenario: Panel can be dragged by header
- **WHEN** the user presses and drags the panel header
- **THEN** the panel SHALL follow the pointer and reposition within the viewport bounds

#### Scenario: Panel position clamped to viewport
- **WHEN** the user drags the panel toward the viewport edge
- **THEN** the panel SHALL be clamped so it does not move fully off-screen (at least the header remains visible)

#### Scenario: Panel can be resized from bottom-right handle
- **WHEN** the user drags the bottom-right resize handle
- **THEN** the panel width and height SHALL update according to the pointer delta with a minimum size of 300×400 px

---

### Requirement: MSW mock for snippet API endpoints
The workspace module SHALL register MSW handlers for `GET /snippets`, `POST /snippets`, `PATCH /snippets/:id`, and `DELETE /snippets/:id` with fixture data.

#### Scenario: Mock snippet list returns fixture data
- **WHEN** the Verse Snippets panel loads in MSW-enabled development mode
- **THEN** `GET /snippets` SHALL return at least 3 fixture snippets with varied tags matching the UI mockup

#### Scenario: Mock create snippet returns new snippet
- **WHEN** a `POST /snippets` request is dispatched in MSW-enabled development mode
- **THEN** the handler SHALL return a 201 Created with the new snippet object

#### Scenario: Mock delete snippet returns success
- **WHEN** a `DELETE /snippets/:id` request is dispatched in MSW-enabled development mode
- **THEN** the handler SHALL return a 200 OK and the mock state SHALL reflect removal

#### Scenario: Mock enforces 200-snippet limit
- **WHEN** `POST /snippets` is dispatched and the fixture already has 200 snippets
- **THEN** the handler SHALL return 422 with `SnippetLimitError`
