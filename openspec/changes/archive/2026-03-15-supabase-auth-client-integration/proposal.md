# Proposal: Supabase Auth Client Integration

## Why
The auth module currently calls a NestJS backend passthrough for all auth operations.
This adds unnecessary latency and coupling — Supabase can be called directly from the
frontend using its JS client, eliminating the backend intermediary entirely.

## What Changes
- A typed Supabase client singleton is introduced in `src/shared/config/`
- `auth.service.ts` is rewritten to call Supabase JS client methods directly
  instead of `fetch`-ing the NestJS backend
- `auth.types.ts` is updated to reflect Supabase's session/user shape
- Auth mutation hooks are updated to handle Supabase-specific error shapes
- MSW mock handlers are updated to intercept Supabase REST endpoints
- Environment variables are updated (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `NEXT_PUBLIC_API_URL` is removed from auth usage

## Capabilities
1. **supabase-client-setup** — Create and export a typed Supabase client singleton from `src/shared/config/`
2. **auth-service-migration** — Replace all fetch-based backend calls in `auth.service.ts` with Supabase client methods
3. **auth-session-management** — Expose session state (current user, session token) via a hook or context backed by `onAuthStateChange`
4. **auth-types-update** — Align `AuthUser` and error types with Supabase's `User` / `Session` / `AuthError` shape
5. **auth-mocks-update** — Update MSW handlers and fixtures to intercept Supabase's auth REST endpoints

## Out of Scope
- Google Social Login (explicitly excluded)
- Any NestJS backend changes
- Non-auth modules

## Impact
- `src/shared/config/supabase.ts` — new file
- `src/modules/auth/services/auth.service.ts` — rewritten
- `src/modules/auth/types/auth.types.ts` — updated
- `src/modules/auth/hooks/use*.ts` — updated error handling
- `src/modules/auth/mocks/auth.handlers.ts` — updated endpoints
- `src/modules/auth/mocks/auth.fixtures.ts` — updated fixtures
- `.env.local` / `.env.example` — new env vars added
