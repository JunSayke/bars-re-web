## ADDED Requirements

### Requirement: User can set a new password using a reset token
The system SHALL provide a form where a user enters a new password and confirms it, then submits the new password along with a valid token from the URL query parameter (`?token=`). The system SHALL validate the password meets all requirements before allowing submission.

#### Scenario: Successful password reset
- **WHEN** the user enters a valid new password, matching confirmation, and a valid token exists in the URL
- **THEN** the system SHALL call the reset-password API and navigate the user to `/login` on success

#### Scenario: Passwords do not match
- **WHEN** the user enters different values in the new-password and confirm-password fields and submits
- **THEN** the system SHALL display an inline error on the confirm-password field and NOT call the API

#### Scenario: Password does not meet minimum length
- **WHEN** the user enters a password shorter than 8 characters
- **THEN** the system SHALL display a validation error and the password-requirements checklist SHALL mark the minimum-length rule as unmet

### Requirement: Password requirements checklist reflects live input
The system SHALL display a "PASSWORD REQUIREMENTS" section below the password fields that updates in real-time as the user types. Each rule SHALL show a visual indicator (checked/passed vs unchecked/failed).

#### Scenario: Minimum length rule passes
- **WHEN** the new password field contains 8 or more characters
- **THEN** the "Must be at least 8 characters" checklist item SHALL show a passing (green check) state

#### Scenario: Number rule passes
- **WHEN** the new password field contains at least one numeric digit
- **THEN** the "Include at least one number" checklist item SHALL show a passing state

#### Scenario: Special character rule passes
- **WHEN** the new password field contains at least one special character (non-alphanumeric)
- **THEN** the "Include one special character" checklist item SHALL show a passing state

#### Scenario: All rules unmet on empty field
- **WHEN** the new password field is empty
- **THEN** all three checklist items SHALL show a failing (muted/gray) state

### Requirement: Token is read from URL and validated before form renders
The system SHALL read the `token` query parameter from the URL. If the token is absent or empty, the page SHALL display an error state informing the user the link is invalid, and SHALL NOT render the password form.

#### Scenario: Valid token present in URL
- **WHEN** the page mounts with `?token=<non-empty-string>` in the URL
- **THEN** the system SHALL render the password reset form

#### Scenario: Token missing from URL
- **WHEN** the page mounts without a `token` query parameter
- **THEN** the system SHALL display an error message (e.g., "Invalid or expired reset link") and hide the form

#### Scenario: API rejects the token
- **WHEN** the reset-password API returns an error indicating the token is invalid or expired
- **THEN** the system SHALL display the API error message on the form

#### Scenario: Loading state during submission
- **WHEN** the API call is in-flight
- **THEN** the submit button SHALL be disabled and show a loading indicator

#### Scenario: Navigation back to login
- **WHEN** the user clicks "← Back to Login"
- **THEN** the system SHALL navigate to the `/login` route
