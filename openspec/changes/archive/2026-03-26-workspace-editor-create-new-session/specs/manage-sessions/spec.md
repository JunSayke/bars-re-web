## MODIFIED Requirements

### Requirement: New Session button opens creation dialog
The "New Session" button on the Workspaces page SHALL open the New Rap Session dialog to capture session metadata before creating a session record, replacing the previous behavior of navigating directly to the editor.

#### Scenario: Button click opens dialog
- **WHEN** the user clicks the "New Session" button on the Workspaces page
- **THEN** the system opens the New Rap Session modal dialog instead of navigating to /workspaces/editor
