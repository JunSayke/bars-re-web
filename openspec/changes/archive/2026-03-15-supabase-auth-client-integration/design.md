# Design: Supabase Auth Client Integration

## Context
The auth module currently performs all auth operations by calling a NestJS backend
over HTTP (`fetch` to `NEXT_PUBLIC_API_URL`). The backend acts as a passthrough to
Supabase. This change removes that indirection — the frontend will call the Supabase
JS client directly. The existing UI, forms, schemas, and mutation hooks remain intact;
only the service layer, types, session management, and mocks change.

## Goals
- Replace all `fetch`-based auth calls with `@supabase/supabase-js` client calls
- Introduce a typed singleton Supabase client in `src/shared/config/supabase.ts`
- Expose reactive session state via `useAuthSession` in the auth module
- Align `AuthUser` and `AuthError` types with Supabase's actual response shapes
- Update MSW handlers and fixtures to intercept Supabase REST endpoints
- Remove all references to `NEXT_PUBLIC_API_URL` from the auth module

## Non-Goals
- Google Social Login (out of scope)
- Any changes to the NestJS backend
- Changes to auth UI components, forms, schemas, or validation logic
- Changes to any module outside of `auth` and `src/shared/config/`

## Decisions

### D1: Supabase client lives in `src/shared/config/supabase.ts`
Per the architecture decision tree, configuration singletons (QueryClient, env-backed
clients) belong in `src/shared/config/`. The Supabase client is a pure config export
with no React or business logic — this placement is correct and keeps it importable
by any module without violating the one-way dependency rule.

### D2: `useAuthSession` lives in `src/modules/auth/hooks/`
Session state is auth-specific business logic. It must not live in `src/shared/`
(which is zero-feature) or in a global context provider until a second module needs
it. It is exported via the auth barrel (`index.ts`) for controlled access.

### D3: `onAuthStateChange` drives session state
Rather than reading the session once on mount, the hook subscribes to Supabase's
`onAuthStateChange` listener. This ensures session state stays reactive across
tab focus, token refresh, and logout — without additional polling.

### D4: Service functions remain plain async functions (no React)
`auth.service.ts` stays a plain TypeScript module of async functions. Hooks
(`useLoginMutation`, etc.) continue to wrap these functions via TanStack Query.
This keeps the service layer testable in isolation and consistent with the
existing architecture.

### D5: MSW handlers target Supabase REST paths
Supabase JS client calls map to deterministic REST endpoints under
`<SUPABASE_URL>/auth/v1/`. MSW handlers are updated to intercept these paths,
keeping dev and test environments fully offline-capable without hitting real
Supabase infrastructure.

### D6: `NEXT_PUBLIC_API_URL` is not removed globally
Only the auth module stops using it. Other modules (workspace, settings) may
still need it for NestJS calls. The env var stays in the project but is removed
from `auth.service.ts` specifically.
