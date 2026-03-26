# create-new-session Specification

## Purpose
Add a dedicated feature to create a new workspace session via modal dialog from the Workspaces page.

## Requirements

### Requirement: Open New Session dialog from Workspaces page
The system SHALL render a modal dialog when the user clicks the "New Session" button on the Workspaces page, replacing the previous direct navigation behavior.

#### Scenario: Dialog opens on button click
- **WHEN** the user clicks the "New Session" button on the Workspaces page
- **THEN** a modal dialog titled "New Rap Session" appears with a required SESSION TITLE input and an optional TOPIC OR IDEA textarea

#### Scenario: Dialog can be dismissed
- **WHEN** the user clicks the Cancel button or the close (×) icon in the dialog
- **THEN** the dialog closes without creating a session and the Workspaces page is unchanged

---

### Requirement: Validate session title before submission
The system SHALL prevent form submission when the SESSION TITLE field is empty.

#### Scenario: Submit blocked on empty title
- **WHEN** the SESSION TITLE input is empty and the user clicks "CREATE SESSION"
- **THEN** the system displays a validation error below the SESSION TITLE field and does not send a request to the server

#### Scenario: Submit allowed with non-empty title
- **WHEN** the SESSION TITLE input contains at least one non-whitespace character
- **THEN** the "CREATE SESSION" button is enabled and the form may be submitted

---

### Requirement: Create session via API and navigate to editor
The system SHALL submit the session form to POST /sessions, and on success navigate the user to the editor page with the new session ID.

#### Scenario: Successful session creation
- **WHEN** the user submits the New Session form with a valid title
- **THEN** the system sends a POST /sessions request with the title and optional topic, and upon receiving a 201 response navigates to /workspaces/editor?id=<sessionId>

#### Scenario: Loading state during creation
- **WHEN** the POST /sessions request is in flight
- **THEN** the "CREATE SESSION" button shows a loading/disabled state and the form cannot be resubmitted

---

### Requirement: Show error feedback on creation failure
The system SHALL display an error toast when the session creation request fails.

#### Scenario: Error toast on API failure
- **WHEN** the POST /sessions request returns an error (e.g., 429 session limit reached or 500 server error)
- **THEN** the dialog remains open with the user's input intact and a toast notification is shown describing the failure

#### Scenario: Session limit reached error
- **WHEN** the user already has 100 sessions and attempts to create a new one
- **THEN** the system returns a 429 response and the toast reads "Session limit reached. Delete an existing session to continue."
