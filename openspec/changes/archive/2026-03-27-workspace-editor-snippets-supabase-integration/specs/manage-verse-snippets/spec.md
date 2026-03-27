## ADDED Requirements

### Requirement: Verse snippets are persisted to Supabase and survive page reloads
The system SHALL persist all snippet CRUD operations to Supabase using the authenticated user's identity. Snippets SHALL be stored in a `snippets` table scoped to the user via Row Level Security. Upon page reload, the system SHALL retrieve the user's saved snippets from Supabase and display them in the Verse Snippets panel.

#### Scenario: Snippets persist after page reload
- **WHEN** the user creates a snippet in the Verse Snippets panel and then reloads the page
- **THEN** the newly created snippet SHALL appear in the panel after reload, retrieved from Supabase

#### Scenario: Snippets are isolated per user
- **WHEN** two different authenticated users access the Verse Snippets panel
- **THEN** each user SHALL only see their own snippets; no cross-user data SHALL be visible

#### Scenario: Unauthenticated snippet access is rejected
- **WHEN** the snippet service is called without a valid authenticated session
- **THEN** the service SHALL throw an `Unauthorized` error and no Supabase query SHALL be executed

---

## MODIFIED Requirements

### Requirement: Create a new verse snippet
The Verse Snippets panel SHALL provide a "+ New Snippet" button at the bottom of the panel. Clicking it SHALL open a dialog where the user can enter a title, freeform content, and optional tags. On save, the snippet SHALL be persisted to Supabase and added to the list.

#### Scenario: New snippet dialog opens
- **WHEN** the user clicks "+ New Snippet"
- **THEN** a dialog SHALL appear with a title input (required), a content textarea (required), and a tag multi-select (optional)

#### Scenario: Snippet created successfully
- **WHEN** the user fills in title and content and submits the dialog
- **THEN** the snippet SHALL be inserted into Supabase, the dialog SHALL close, and the new snippet SHALL appear at the top of the list

#### Scenario: Snippet creation blocked at 200-snippet limit
- **WHEN** the user already has 200 snippets in Supabase and attempts to create a new one
- **THEN** the service SHALL throw `{ message: "Snippet limit reached" }` and the dialog SHALL show the error "You have reached the maximum limit of 200 snippets."

#### Scenario: Snippet creation blocked when content exceeds 200 words
- **WHEN** the user's content field has more than 200 words
- **THEN** the dialog SHALL show a validation error "Snippet exceeds the maximum limit of 200 words." and the submit button SHALL be disabled

#### Scenario: Live word count in snippet form
- **WHEN** the user is typing in the content textarea
- **THEN** a live word count indicator SHALL display the current count relative to the 200-word limit (e.g., `120 / 200 words`)

---

### Requirement: Edit an existing verse snippet
Each snippet card in the list SHALL include an Edit action. Activating it SHALL open the same snippet dialog pre-populated with the existing title, content, and tags. On save, the changes SHALL be persisted to Supabase and reflected in the list.

#### Scenario: Edit dialog opens pre-populated
- **WHEN** the user activates the edit action on a snippet card
- **THEN** the snippet dialog SHALL open with the existing title, content, and tags pre-filled

#### Scenario: Snippet updated successfully
- **WHEN** the user modifies the content and submits the edit dialog
- **THEN** the snippet SHALL be updated in Supabase and the updated snippet SHALL be reflected in the list

#### Scenario: Edit dialog validation enforces 200-word limit
- **WHEN** the user edits the content to exceed 200 words
- **THEN** the dialog SHALL show a validation error and the submit button SHALL be disabled

---

### Requirement: Delete a verse snippet
Each snippet card SHALL include a Delete button. Clicking it SHALL immediately remove the snippet (optimistic) and delete the row from Supabase. If the Supabase delete fails, the snippet SHALL be restored to the list.

#### Scenario: Snippet deleted successfully
- **WHEN** the user clicks "Delete" on a snippet card
- **THEN** the snippet SHALL be removed from the list immediately (optimistic delete) and the corresponding row SHALL be deleted from Supabase

#### Scenario: Delete failure restores snippet
- **WHEN** the Supabase delete returns an error
- **THEN** the snippet SHALL be restored to the list and a toast error SHALL be displayed

---

### Requirement: MSW mock for snippet API endpoints
The workspace module SHALL retain MSW handlers for `GET /snippets`, `POST /snippets`, `PATCH /snippets/:id`, and `DELETE /snippets/:id` as development scaffolding. These handlers SHALL remain registered in `browser.ts` but are inert — production snippet operations go directly to Supabase and do not trigger the MSW `localhost:3001` endpoints.

#### Scenario: MSW handlers are inert when Supabase is the backend
- **WHEN** the application runs with a valid Supabase configuration
- **THEN** snippet CRUD operations SHALL call Supabase directly and NOT route through MSW `localhost:3001` handlers

#### Scenario: Mock snippet list returns fixture data in isolated MSW dev mode
- **WHEN** the Verse Snippets panel loads in MSW-enabled development mode (no Supabase configured)
- **THEN** `GET /snippets` SHALL return at least 3 fixture snippets with varied tags

#### Scenario: Mock create snippet returns new snippet
- **WHEN** a `POST /snippets` request is dispatched in MSW-enabled development mode
- **THEN** the handler SHALL return a 201 Created with the new snippet object

#### Scenario: Mock delete snippet returns success
- **WHEN** a `DELETE /snippets/:id` request is dispatched in MSW-enabled development mode
- **THEN** the handler SHALL return a 200 OK and the mock state SHALL reflect removal

#### Scenario: Mock enforces 200-snippet limit
- **WHEN** `POST /snippets` is dispatched in MSW-enabled development mode and the fixture already has 200 snippets
- **THEN** the handler SHALL return 422 with `SnippetLimitError`
