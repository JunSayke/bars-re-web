# Spec: Supabase Client Setup

## Requirements

### Requirement: Singleton client instance
A single typed Supabase client is created once and reused across the entire app.

#### Scenario: Client is imported by the auth service
- **WHEN** `auth.service.ts` imports the Supabase client
- **THEN** it receives the same singleton instance every time
- **AND** no second client is instantiated

#### Scenario: Missing environment variables
- **WHEN** `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is absent at build time
- **THEN** the app throws a clear configuration error on startup
- **AND** the error message names the missing variable explicitly

### Requirement: Correct placement per architecture
The client file lives in `src/shared/config/` as a pure configuration export.

#### Scenario: File location and export shape
- **WHEN** any module needs the Supabase client
- **THEN** it imports `supabase` from `@/shared/config/supabase`
- **AND** the export is a named export (not default)
- **AND** the file contains no React components, hooks, or business logic
