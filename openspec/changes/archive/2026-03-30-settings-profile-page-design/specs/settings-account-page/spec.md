## ADDED Requirements

### Requirement: Account settings page header
The system SHALL display a styled page header at the top of the Account Settings page containing a title ("Account Settings") and a subtitle ("Manage your profile and security preferences."), matching the reference UI.

#### Scenario: Header renders on load
- **WHEN** the user navigates to `/settings/account`
- **THEN** the page displays the heading "Account Settings" and a muted subtitle beneath it

---

### Requirement: Change email section
The system SHALL provide a "Change Email" card section on the Account Settings page. The section SHALL display the user's current email as a read-only field and a "New Email" input, and a submit button labelled "Update Email".

#### Scenario: Current email pre-populated
- **WHEN** the user views the Account Settings page
- **THEN** the "Current Email" field shows the authenticated user's current email address in a read-only input

#### Scenario: Successful email update
- **WHEN** the user enters a valid new email address and clicks "Update Email"
- **THEN** the system calls `supabase.auth.updateUser({ email: newEmail })` and displays a success message: "A confirmation link has been sent to your new email."

#### Scenario: Invalid email rejected
- **WHEN** the user enters a malformed email and clicks "Update Email"
- **THEN** an inline validation error is displayed below the "New Email" field and no Supabase call is made

#### Scenario: Loading state during submission
- **WHEN** the "Update Email" mutation is pending
- **THEN** the "Update Email" button is disabled and shows a spinner

---

### Requirement: Change password section
The system SHALL provide a "Change Password" card section on the Account Settings page with fields for "Current Password", "New Password", and "Confirm New Password", and a submit button labelled "Change Password".

#### Scenario: Successful password update
- **WHEN** the user fills in all three fields, new password matches confirmation, and clicks "Change Password"
- **THEN** the system calls `supabase.auth.updateUser({ password: newPassword })` and displays a success toast "Password updated successfully."

#### Scenario: Password mismatch rejected
- **WHEN** "New Password" and "Confirm New Password" do not match
- **THEN** an inline error is shown on the "Confirm New Password" field and the form is not submitted

#### Scenario: Weak password rejected
- **WHEN** the new password fails the minimum-length (8 characters) constraint
- **THEN** an inline validation error is shown and the form is not submitted

#### Scenario: Loading state during submission
- **WHEN** the "Change Password" mutation is pending
- **THEN** the "Change Password" button is disabled and shows a spinner
