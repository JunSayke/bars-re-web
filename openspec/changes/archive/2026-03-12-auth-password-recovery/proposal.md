## Why

Users who forget their password have no way to recover access to their account. The auth module currently only supports login and signup — there is no forgot-password or reset-password flow. This is a critical missing piece before the app can go to production.

## What Changes

- Add a **Forgot Password** page (`/forgot`) where users submit their email to receive a password reset link.
- Add a **Reset Password** page (`/reset`) where users set a new password using a token from the reset link.
- Add mock API calls (`POST /auth/forgot-password` and `POST /auth/reset-password`) backed by MSW handlers and fixture data.
- Add Zod schemas, React Hook Form validation, and TanStack Query mutations for both flows.
- Wire both pages into the existing `AuthShell` template used by the auth module.

## Capabilities

### New Capabilities

- `forgot-password`: Allows a user to submit their email address to receive a password reset link. Covers the form, validation, API call, and success/error state.
- `reset-password`: Allows a user to set a new password using a valid reset token (from the link). Covers the two-field form, password requirements checklist, validation, API call, and success/error state.

### Modified Capabilities

<!-- No existing spec-level requirements are changing. -->

## Impact

- **Auth module** (`src/modules/auth/`): New pages, organisms, schemas, hooks, service methods, and mock handlers added.
- **App Router** (`app/(auth)/forgot/page.tsx`, `app/(auth)/reset/page.tsx`): Already scaffolded, will be wired to new page components.
- **No breaking changes** to existing login or signup flows.
- **Dependencies**: No new dependencies — reuses existing Zod, React Hook Form, TanStack Query, Lucide React, and shadcn/ui.
