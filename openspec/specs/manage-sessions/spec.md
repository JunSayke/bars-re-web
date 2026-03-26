# manage-sessions Specification

## Purpose
TBD - created by archiving change workspace-editor-manage-sessions. Update Purpose after archive.
## Requirements
### Requirement: Display session list
The system SHALL fetch and render all sessions belonging to the authenticated user as a scrollable card list, sorted by `lastModifiedAt` descending.

#### Scenario: Sessions exist
- **WHEN** the user navigates to the workspaces page
- **THEN** the page renders one `SessionCard` per session, each showing the session title, topic badge, bar preview snippet, and last modified timestamp

#### Scenario: Session count indicator shown
- **WHEN** the user navigates to the workspaces page
- **THEN** a count label "X/100 SESSIONS" and a proportional progress bar are displayed above the session list

---

### Requirement: Open session in editor
The system SHALL navigate the user to the editor page when they click on a session card.

#### Scenario: Card click navigates to editor
- **WHEN** the user clicks a session card
- **THEN** the browser navigates to `/workspaces/editor?id=<sessionId>`

---

### Requirement: Rename session
The system SHALL allow the user to rename a session via a dialog triggered from the session overflow menu.

#### Scenario: User opens rename dialog
- **WHEN** the user clicks the three-dot overflow menu on a session card and selects "Rename"
- **THEN** a modal dialog appears with a text input pre-filled with the current session title

#### Scenario: Successful rename
- **WHEN** the user enters a non-empty title and confirms the dialog
- **THEN** the system sends a PATCH request to `/sessions/:id/rename` and updates the card title in the list upon success

#### Scenario: Empty title rejected
- **WHEN** the user clears the title input and attempts to confirm
- **THEN** the confirm button is disabled and the field shows a validation error

---

### Requirement: Delete session with confirmation
The system SHALL allow the user to delete a session after confirming via a confirmation dialog triggered from the session overflow menu.

#### Scenario: User sees confirmation before delete
- **WHEN** the user clicks the three-dot overflow menu on a session card and selects "Delete"
- **THEN** a confirmation dialog appears asking the user to confirm permanent deletion

#### Scenario: Confirmed delete removes session
- **WHEN** the user confirms deletion in the dialog
- **THEN** the session card is immediately removed from the list (optimistic update) and a DELETE request is sent to `/sessions/:id`

#### Scenario: Delete failure restores card
- **WHEN** the DELETE request fails
- **THEN** the session card is restored in the list and an error toast is displayed informing the user the session was retained

#### Scenario: User cancels delete
- **WHEN** the user dismisses the confirmation dialog without confirming
- **THEN** the session card remains in the list and no request is sent

---

### Requirement: Empty state for sessions page
The system SHALL display an empty state message when the authenticated user has no sessions.

#### Scenario: No sessions exist
- **WHEN** the sessions query returns an empty array
- **THEN** the page renders an empty state UI with the message "You have no saved sessions. Click 'New Session' to start writing." instead of a session list

---

### Requirement: Session thumbnail icon
The system SHALL render a thumbnail icon on each session card that reflects the session's content type.

#### Scenario: Session card shows thumbnail
- **WHEN** a session card is rendered
- **THEN** a thumbnail icon (e.g., document or waveform icon based on `thumbnailType`) is displayed on the left side of the card

---

### Requirement: Play button on session card (stub)
The system SHALL render a play button on each session card. In this transaction the button is a non-functional stub.

#### Scenario: Play button is visible
- **WHEN** a session card is rendered
- **THEN** a circular play button icon is visible on the right side of the card

#### Scenario: Play button is a stub
- **WHEN** the user clicks the play button
- **THEN** no audio plays and no error occurs (the action is a no-op pending beat playback implementation in transaction 4.4)

