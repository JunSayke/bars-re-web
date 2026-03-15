# Spec: Auth Session Management

## Requirements

### Requirement: Reactive session state
The app exposes the current user and session via a hook backed by Supabase's auth state listener.

#### Scenario: User is logged in
- **WHEN** a valid Supabase session exists
- **THEN** `useAuthSession` returns the current `AuthUser`
- **AND** the session is available synchronously after hydration

#### Scenario: User is logged out
- **WHEN** no session exists or the session has expired
- **THEN** `useAuthSession` returns `null` for the user
- **AND** consuming components can gate rendering on this state

#### Scenario: Session changes at runtime
- **WHEN** the user logs in or logs out
- **THEN** `onAuthStateChange` triggers a re-render
- **AND** `useAuthSession` reflects the updated state immediately

### Requirement: Correct placement per architecture
Session state logic lives inside the auth module, not in shared.

#### Scenario: Hook file location
- **WHEN** the session hook is implemented
- **THEN** it lives at `src/modules/auth/hooks/useAuthSession.ts`
- **AND** it is exported via the auth module's `index.ts` barrel
- **AND** it is not imported directly from its internal path by outside code

### Requirement: Logout capability

#### Scenario: User triggers logout
- **WHEN** the logout action is invoked
- **THEN** `supabase.auth.signOut` is called
- **AND** the session state clears reactively
- **AND** the user is redirected to the login page via `ROUTES.AUTH.LOGIN`
