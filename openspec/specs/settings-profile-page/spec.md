# settings-profile-page Specification

## Purpose
TBD - created by sync from change settings-profile-page-design.

## Requirements
### Requirement: Profile settings page header
The system SHALL display a styled page header at the top of the Profile Settings page containing a title ("Profile Settings") and a subtitle ("Manage your display name and avatar.").

#### Scenario: Header renders on load
- **WHEN** the user navigates to `/settings/profile`
- **THEN** the page displays a prominent heading "Profile Settings" and a muted subtitle line below it

---

### Requirement: Avatar preview section
The system SHALL render an avatar preview above the profile form, showing the user's current avatar image when `avatarUrl` is a non-empty string, or a fallback initials circle derived from `displayName` (first letter, uppercased) when no valid URL exists.

#### Scenario: Avatar image shown when URL is populated
- **WHEN** the user has a non-empty `avatarUrl` stored in their profile
- **THEN** the page displays a circular avatar image using that URL above the form

#### Scenario: Fallback initials shown when no URL
- **WHEN** the user has no `avatarUrl` or the field is empty
- **THEN** the page displays a circular initials avatar using the first letter of `displayName` with the primary background color

#### Scenario: Preview updates live as user types
- **WHEN** the user edits the `avatarUrl` input field
- **THEN** the avatar preview above the form updates in real time to reflect the new URL without requiring form submission

---

### Requirement: Avatar URL field with helper text
The system SHALL keep the `avatarUrl` form field and display helper text below it indicating that the user should paste an image URL.

#### Scenario: Helper text always visible
- **WHEN** the user views the Profile Settings page
- **THEN** a helper text "Paste a link to your avatar image." is visible below the Avatar URL input

#### Scenario: Validation error shown on invalid URL
- **WHEN** the user enters a string that fails the `avatarUrl` Zod schema validation and submits
- **THEN** an inline error message is shown below the Avatar URL field
