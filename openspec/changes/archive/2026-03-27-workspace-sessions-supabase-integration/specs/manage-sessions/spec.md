## MODIFIED Requirements

### Requirement: Rename session
The system SHALL allow the user to rename a session via a dialog triggered from the session overflow menu.

#### Scenario: User opens rename dialog
- **WHEN** the user clicks the three-dot overflow menu on a session card and selects "Rename"
- **THEN** a modal dialog appears with a text input pre-filled with the current session title

#### Scenario: Successful rename
- **WHEN** the user enters a non-empty title and confirms the dialog
- **THEN** the system calls the Supabase session service to update the session title in the `sessions` table and reloads the session list on success, reflecting the new title in the card

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
- **THEN** the session card is immediately removed from the list (optimistic update) and the Supabase session service deletes the session record from the `sessions` table; any associated `beat_files` row is removed via ON DELETE CASCADE

#### Scenario: Delete failure restores card
- **WHEN** the Supabase delete operation fails
- **THEN** the session card is restored in the list and an error toast is displayed informing the user the session was retained

#### Scenario: User cancels delete
- **WHEN** the user dismisses the confirmation dialog without confirming
- **THEN** the session card remains in the list and no database operation is performed
