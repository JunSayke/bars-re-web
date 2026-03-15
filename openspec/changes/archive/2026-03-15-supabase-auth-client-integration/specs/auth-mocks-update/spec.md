# Spec: Auth Mocks Update

## Requirements

### Requirement: MSW handlers intercept Supabase REST endpoints
Mock handlers are updated to match the Supabase auth REST API paths, not the old NestJS paths.

#### Scenario: Login handler intercepts Supabase endpoint
- **WHEN** `supabase.auth.signInWithPassword` is called in tests or dev
- **THEN** the MSW handler intercepts the correct Supabase auth URL
- **AND** returns a fixture shaped like a Supabase `Session` response
- **AND** no handler references the old `/auth/login` NestJS path

#### Scenario: Signup handler intercepts Supabase endpoint
- **WHEN** `supabase.auth.signUp` is called in tests or dev
- **THEN** the MSW handler intercepts the correct Supabase signup URL
- **AND** returns a fixture shaped like a Supabase `User` response

#### Scenario: Password recovery handler intercepts Supabase endpoint
- **WHEN** `supabase.auth.resetPasswordForEmail` or `supabase.auth.updateUser` is called
- **THEN** the MSW handler intercepts the correct Supabase endpoint
- **AND** returns a fixture matching the Supabase recovery response shape

### Requirement: Fixtures reflect Supabase response shapes
All fixture objects in `auth.fixtures.ts` conform to Supabase's actual response contracts.

#### Scenario: Fixture fields are complete and typed
- **WHEN** a fixture is used in a handler or test
- **THEN** all required Supabase fields are present (e.g. `access_token`, `token_type`, `user.id`)
- **AND** no fixture uses `Partial<T>` or `as any`
- **AND** all values are stable (no `Math.random()`, no `Date.now()`)

### Requirement: Old NestJS mock endpoints are removed
Handlers targeting the old backend paths are deleted.

#### Scenario: No residual NestJS paths in handlers
- **WHEN** `auth.handlers.ts` is reviewed post-migration
- **THEN** it contains no references to `/auth/login`, `/auth/signup`,
  `/auth/forgot-password`, or `/auth/reset-password` NestJS paths
