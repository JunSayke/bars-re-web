# Spec: Auth Types Update

## Requirements

### Requirement: AuthUser aligned with Supabase shape
The `AuthUser` type reflects what Supabase returns rather than the old backend contract.

#### Scenario: AuthUser type is consumed after login
- **WHEN** a successful login resolves
- **THEN** `AuthUser` contains at minimum `id`, `email`, and `accessToken`
- **AND** `accessToken` is sourced from the Supabase session, not a custom backend token
- **AND** the `username` field is removed or made optional if not provided by Supabase

#### Scenario: No runtime type mismatches
- **WHEN** the service maps a Supabase `Session` to `AuthUser`
- **THEN** all required fields are present and non-null
- **AND** TypeScript compilation passes with no `as any` casts

### Requirement: AuthError aligned with Supabase shape
The `AuthError` type reflects Supabase's error structure.

#### Scenario: Error thrown from service is caught by hook
- **WHEN** Supabase returns an error
- **THEN** the caught object conforms to the local `AuthError` type
- **AND** the error `message` field is always a string

### Requirement: Legacy backend types removed
Types that only existed to model the old NestJS backend contract are deleted.

#### Scenario: Stale types are cleaned up
- **WHEN** `auth.types.ts` is reviewed post-migration
- **THEN** it contains no types that reference the old `token` field on `AuthUser`
- **AND** `ForgotPasswordResponse` and `ResetPasswordResponse` are retained only
  if they still map to a real Supabase return shape
