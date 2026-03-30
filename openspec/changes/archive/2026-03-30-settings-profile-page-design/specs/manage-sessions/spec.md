## MODIFIED Requirements

### Requirement: Settings gear icon navigates to profile settings
The system SHALL navigate the user to `/settings/profile` when the gear icon in the Workspaces top navigation bar (`WorkspacesTopNav`) or the Editor top navigation bar (`EditorTopNav`) is clicked, replacing the previous callback-prop pattern.

#### Scenario: Gear icon click navigates to profile settings
- **WHEN** the user clicks the gear icon in `WorkspacesTopNav` or `EditorTopNav`
- **THEN** the browser navigates to `/settings/profile`

---

## ADDED Requirements

### Requirement: Workspaces top nav displays user avatar
The system SHALL display the authenticated user's avatar image in `WorkspacesTopNav` using the `avatarUrl` from the user's profile. When no avatar URL is available or the image fails to load, a fallback circle with the user's first initial SHALL be shown.

#### Scenario: Avatar image shown when profile has URL
- **WHEN** the authenticated user has a non-empty `avatarUrl` in their profile
- **THEN** the `WorkspacesTopNav` renders a circular avatar image using that URL

#### Scenario: Fallback initial shown when no avatar URL
- **WHEN** the authenticated user has no `avatarUrl` in their profile or it is empty
- **THEN** the `WorkspacesTopNav` renders a circular button with the first letter of the user's display name or `"U"` as fallback

#### Scenario: Avatar loads without blocking navigation
- **WHEN** the profile is still loading
- **THEN** the avatar area renders the fallback initials circle rather than a blank space
