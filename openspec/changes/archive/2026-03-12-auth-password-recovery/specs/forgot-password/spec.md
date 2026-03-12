## ADDED Requirements

### Requirement: User can request a password reset email
The system SHALL provide a form where a user enters their email address and submits it to receive a password reset link. The form SHALL validate that the input is a properly formatted email address before submission.

#### Scenario: Successful submission with valid email
- **WHEN** the user enters a valid email address and clicks "Send Reset Link"
- **THEN** the system SHALL call the forgot-password API endpoint and show a success message indicating the email was sent

#### Scenario: Submission with invalid email format
- **WHEN** the user enters a string that is not a valid email format and submits the form
- **THEN** the system SHALL display an inline validation error and NOT call the API

#### Scenario: Submission with empty field
- **WHEN** the user submits the form with an empty email field
- **THEN** the system SHALL display a required-field validation error and NOT call the API

#### Scenario: API error on submission
- **WHEN** the API returns an error (e.g., server unavailable or known-bad email in mock)
- **THEN** the system SHALL display a descriptive error message on the form

#### Scenario: Loading state during submission
- **WHEN** the API call is in-flight
- **THEN** the submit button SHALL be disabled and show a loading indicator

#### Scenario: Navigation back to login
- **WHEN** the user clicks "← Back to Login"
- **THEN** the system SHALL navigate to the `/login` route
