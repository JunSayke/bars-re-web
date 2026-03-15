## Why

The auth routes (`/login`, `/signup`) are bare placeholder stubs. Users have no way to authenticate or create an account, which blocks access to all protected workspace features. Building this now establishes the auth module as the entry point for the entire application.

## What Changes

- Replace the stub `LoginPage` with a fully implemented two-column login screen: left branded panel + right form panel with email/password fields, "Forgot Password?" link, and Google OAuth button.
- Replace the stub `SignupPage` with a fully implemented two-column signup screen: left illustrated branding panel + right form with username, email, password, confirm-password, terms checkbox, and Google OAuth button.
- Scaffold the complete `src/modules/auth/` vertical slice including components (atoms → molecules → organisms → template → pages), hooks, services (mock), schemas (Zod), and types.
- Wire `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` as thin re-exports from the auth module.
- Implement mock API service functions (`loginUser`, `signupUser`) with simulated latency and typed mock responses — no real backend required at this stage.
- Add a shared `AuthShell` template (two-column layout) usable by all four auth pages (login, signup, forgot, reset).

## Capabilities

### New Capabilities

- `user-login`: Email/password login form with Google OAuth fallback, "Forgot Password?" link, and navigation to signup. Submits to mock `loginUser` service.
- `user-signup`: Username + email + password + confirm-password form with terms agreement checkbox, Google OAuth fallback, and navigation to login. Submits to mock `signupUser` service.

### Modified Capabilities

<!-- No existing spec-level capabilities are changing. -->

## Impact

- **New files**: entire `src/modules/auth/` tree (components, hooks, services, schemas, types, meta, index).
- **Modified files**: `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx` — converted from stubs to thin re-exports.
- **Shared components promoted**: `AuthShell` template (two-column layout) lives in `src/modules/auth/components/templates/` — eligible for promotion to `src/components/templates/` once reused by a second module.
- **Dependencies**: React Hook Form, Zod, TanStack Query (all already in `package.json`). No new packages needed.
- **No backend**: mock service layer only. Real API integration is a future change.
