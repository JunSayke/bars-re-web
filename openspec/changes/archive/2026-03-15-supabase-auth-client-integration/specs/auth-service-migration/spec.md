# Spec: Auth Service Migration

## Requirements

### Requirement: Login via Supabase client
The login function calls Supabase directly instead of the NestJS backend.

#### Scenario: Successful login
- **WHEN** a user submits valid credentials
- **THEN** `auth.service.ts` calls `supabase.auth.signInWithPassword`
- **AND** returns a typed `AuthUser` derived from the Supabase session
- **AND** no fetch call is made to the NestJS backend

#### Scenario: Invalid credentials
- **WHEN** Supabase returns an `AuthError` on login
- **THEN** the service throws a typed error the mutation hook can catch
- **AND** the error contains a human-readable message

### Requirement: Signup via Supabase client
The signup function calls Supabase directly instead of the NestJS backend.

#### Scenario: Successful signup
- **WHEN** a user submits valid signup data
- **THEN** `auth.service.ts` calls `supabase.auth.signUp`
- **AND** returns a typed `AuthUser` on success
- **AND** no fetch call is made to the NestJS backend

#### Scenario: Email already in use
- **WHEN** Supabase returns a conflict error on signup
- **THEN** the service throws a typed error with a clear message

### Requirement: Password recovery via Supabase client

#### Scenario: Forgot password request
- **WHEN** a user submits their email for password recovery
- **THEN** `auth.service.ts` calls `supabase.auth.resetPasswordForEmail`
- **AND** returns a success response on completion

#### Scenario: Reset password submission
- **WHEN** a user submits a new password with a valid recovery token
- **THEN** `auth.service.ts` calls `supabase.auth.updateUser`
- **AND** returns a success response on completion

### Requirement: No backend passthrough
All direct `fetch` calls to `NEXT_PUBLIC_API_URL` are removed from `auth.service.ts`.

#### Scenario: No residual fetch calls
- **WHEN** the migrated `auth.service.ts` is reviewed
- **THEN** it contains zero references to `NEXT_PUBLIC_API_URL`
- **AND** it contains zero raw `fetch` calls
