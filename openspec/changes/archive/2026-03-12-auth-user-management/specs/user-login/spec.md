## ADDED Requirements

### Requirement: User can log in with email and password
The system SHALL render a login form with an email/username field and a password field. Upon submission with valid credentials, the system SHALL call the `loginUser` mock service and display a loading state on the submit button. Upon mock success, the system SHALL navigate the user to `/workspaces`.

#### Scenario: Successful login
- **WHEN** the user enters a valid email and password and clicks "Log In"
- **THEN** the button displays a loading indicator and the mock `loginUser` is called with `{ identifier, password }`

#### Scenario: Empty form submission
- **WHEN** the user clicks "Log In" with empty fields
- **THEN** inline validation errors SHALL appear beneath each required field without calling the service

#### Scenario: Invalid email format
- **WHEN** the user enters a string without "@" in the email field
- **THEN** the field SHALL display "Invalid email address" error message

#### Scenario: Password field visibility toggle
- **WHEN** the user clicks the eye icon on the password field
- **THEN** the password input type SHALL toggle between "password" and "text"

### Requirement: Login page displays "Forgot Password?" link
The system SHALL render a "Forgot Password?" link adjacent to the password label that navigates to `/forgot`.

#### Scenario: Forgot password navigation
- **WHEN** the user clicks "Forgot Password?"
- **THEN** the browser SHALL navigate to `/forgot`

### Requirement: Login page provides Google OAuth entry point
The system SHALL render a Google OAuth button below the divider. In the mock implementation the button SHALL be present and clickable but not trigger real OAuth.

#### Scenario: Google button visible
- **WHEN** the login page renders
- **THEN** a button labelled "Google" with the Google icon SHALL be visible below the "OR CONTINUE WITH" divider

### Requirement: Login page links to signup
The system SHALL display a "Create an account" link at the bottom of the form panel that navigates to `/signup`.

#### Scenario: Navigate to signup
- **WHEN** the user clicks "Create an account"
- **THEN** the browser SHALL navigate to `/signup`

### Requirement: Login page renders branded left panel
The system SHALL display a left panel (visible on `lg+` screens) containing the app logo, a headline, a status indicator ("SYSTEM ONLINE"), and a social proof section (avatar group + member count).

#### Scenario: Left panel renders on desktop
- **WHEN** the login page is viewed on a viewport ≥ 1024 px
- **THEN** the left panel SHALL be visible alongside the form panel
