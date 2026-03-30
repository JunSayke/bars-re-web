## MODIFIED Requirements

### Requirement: Create session via API and navigate to editor
The system SHALL insert a new session record into the Supabase `sessions` table, and on success navigate the user to the editor page with the new session ID.

#### Scenario: Successful session creation
- **WHEN** the user submits the New Session form with a valid title
- **THEN** the system calls the Supabase session service to insert a new row into the `sessions` table with the provided title and optional topic, and upon receiving a successful response navigates to `/workspaces/editor?id=<sessionId>`

#### Scenario: Loading state during creation
- **WHEN** the Supabase insert request is in flight
- **THEN** the "CREATE SESSION" button shows a loading/disabled state and the form cannot be resubmitted

---

### Requirement: Show error feedback on creation failure
The system SHALL display an error toast when the session creation operation fails.

#### Scenario: Error toast on operation failure
- **WHEN** the Supabase insert returns an error (e.g., network failure or database constraint violation)
- **THEN** the dialog remains open with the user's input intact and a toast notification is shown describing the failure

#### Scenario: Session limit reached error
- **WHEN** the user already has 100 sessions and attempts to create a new one
- **THEN** the system performs a count check against the `sessions` table before inserting, detects the limit is reached, and the toast reads "Session limit reached. Delete an existing session to continue."

## ADDED Requirements

### Requirement: Enforce session limit via Supabase count query
The system SHALL check the user's current session count in the `sessions` table before attempting to insert a new session record.

#### Scenario: Count check prevents insert at limit
- **WHEN** the Supabase count query returns 100 or more sessions for the authenticated user
- **THEN** the system throws a `{ message: "Session limit reached" }` error and does not issue an insert to the `sessions` table

#### Scenario: Count check allows insert below limit
- **WHEN** the Supabase count query returns fewer than 100 sessions for the authenticated user
- **THEN** the system proceeds with the Supabase insert operation
