## ADDED Requirements

### Requirement: User can register with username, email, and password
The system SHALL render a signup form with username, email address, password, and confirm-password fields. Upon submission with valid data the system SHALL call the `signupUser` mock service and display a loading state. Upon mock success the system SHALL navigate the user to `/workspaces`.

#### Scenario: Successful signup
- **WHEN** the user fills all fields correctly, checks the terms checkbox, and clicks "Sign Up"
- **THEN** the button displays a loading indicator and the mock `signupUser` is called with `{ username, email, password }`

#### Scenario: Empty form submission
- **WHEN** the user clicks "Sign Up" with empty fields
- **THEN** inline validation errors SHALL appear beneath each required field without calling the service

#### Scenario: Passwords do not match
- **WHEN** the user enters different values in "Password" and "Confirm" fields
- **THEN** the confirm field SHALL display "Passwords do not match" and the form SHALL NOT be submitted

#### Scenario: Weak password
- **WHEN** the user enters a password shorter than 8 characters
- **THEN** the password field SHALL display "Password must be at least 8 characters"

### Requirement: Signup form requires terms agreement
The system SHALL render a checkbox labelled "I agree to the Terms and Privacy Policy" with links to the respective pages. The "Sign Up" button SHALL remain disabled until the checkbox is checked.

#### Scenario: Submit blocked without terms
- **WHEN** the user fills in all fields but leaves the terms checkbox unchecked
- **THEN** the "Sign Up" button SHALL be disabled and the form SHALL NOT submit

#### Scenario: Terms links are navigable
- **WHEN** the user clicks the "Terms" or "Privacy Policy" links
- **THEN** the browser SHALL navigate to `/terms` or `/privacy` respectively

### Requirement: Signup page provides Google OAuth entry point
The system SHALL render a Google OAuth button below the divider. In the mock implementation the button SHALL be present and clickable but not trigger real OAuth.

#### Scenario: Google button visible
- **WHEN** the signup page renders
- **THEN** a button labelled "Google" with the Google icon SHALL be visible below the "OR CONTINUE WITH" divider

### Requirement: Signup page links to login
The system SHALL display an "Already a member? Log in" link at the bottom of the form panel that navigates to `/login`.

#### Scenario: Navigate to login
- **WHEN** the user clicks "Log in"
- **THEN** the browser SHALL navigate to `/login`

### Requirement: Signup page renders branded left panel
The system SHALL display a left panel (visible on `lg+` screens) containing the app logo name, a waveform illustration, a tagline headline, and a supporting description about the platform.

#### Scenario: Left panel renders on desktop
- **WHEN** the signup page is viewed on a viewport ≥ 1024 px
- **THEN** the left panel SHALL be visible alongside the form panel
