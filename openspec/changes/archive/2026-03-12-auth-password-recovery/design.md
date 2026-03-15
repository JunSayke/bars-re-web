## Context

The auth module already implements login and signup using:
- `AuthShell` template (two-column: brand panel left, form right)
- `PasswordField` molecule (input with show/hide toggle)
- `useLoginMutation` / `useSignupMutation` TanStack Query hooks pattern
- `auth.service.ts` mock service with simulated delay and error cases
- `auth.schema.ts` Zod schemas
- App Router pages at `app/(auth)/forgot/page.tsx` and `app/(auth)/reset/page.tsx` are already scaffolded but empty

The target UI (from design reference) shows both forgot-password and reset-password as single centered cards — **not** the two-column AuthShell layout used by login/signup. The background is the dark `--background` token, and the card is the `--card` surface.

## Goals / Non-Goals

**Goals:**
- `ForgotPage`: email input → submit → mock API call → success/error state
- `ResetPage`: new-password + confirm-password inputs → password requirements checklist (live validation) → submit → mock API call → success/error state
- Mock service functions (`forgotPassword`, `resetPassword`) in `auth.service.ts`
- MSW handlers in `auth.handlers.ts` and fixture data in `auth.fixtures.ts`
- Zod schemas for both DTOs (`forgotPasswordSchema`, `resetPasswordSchema`)
- TanStack Query mutations (`useForgotPasswordMutation`, `useResetPasswordMutation`)
- Wire `app/(auth)/forgot/page.tsx` and `app/(auth)/reset/page.tsx` to the new Page components
- No page-level header/navbar (per design reference)

**Non-Goals:**
- Real backend integration (all API is mocked via `auth.service.ts`)
- Email delivery or token verification logic
- Authenticated session after reset (user is redirected to login)
- Modifying the AuthShell template or any existing login/signup pages

## Decisions

### 1. Centered-card layout instead of AuthShell two-column
The reference design shows forgot and reset pages as a single centered card — no brand panel. Rather than forcing these into AuthShell (which requires an `aside` and a `form` slot), a new `CenteredCardShell` template is added **within the auth module** (`src/modules/auth/components/templates/CenteredCardShell.tsx`). It wraps the content in a full-screen centering div with the card surface. This keeps AuthShell unchanged and follows the promotion rule (only promote to `src/components/templates/` when a second module needs it).

**Alternative considered:** Passing `null` to the `aside` slot of AuthShell — rejected because AuthShell always renders the left column grid cell, making a null aside visually broken.

### 2. Password requirements checklist as a local molecule
The reset-password form shows a live "PASSWORD REQUIREMENTS" checklist (min 8 chars, at least one number, one special character). This logic belongs in a new `PasswordRequirements` molecule scoped to the auth module. It receives the current password string and derives checked states from it.

**Rationale:** Reactive checklist state is derived from the watched form field — no extra hook needed. The molecule stays pure (props in, UI out).

### 3. Mock layer uses MSW per `structure-architecture.md` §9
`forgotPassword(dto)` and `resetPassword(dto)` are standard `fetch` wrappers in `auth.service.ts`, consistent with `loginUser` and `signupUser`. MSW intercepts these `fetch` calls at the network level during development — no changes to services, hooks, or components are needed to switch between real and mock.

`auth.handlers.ts` registers two fully wired MSW handlers:
- `POST /auth/forgot-password` — returns `mockForgotPasswordSuccess` for all emails except `fail@test.com`, which returns `mockForgotPasswordError` (HTTP 500).
- `POST /auth/reset-password` — returns `mockResetPasswordError` (HTTP 400) when `token === "invalid-token"`, otherwise `mockResetPasswordSuccess`.

`auth.fixtures.ts` provides typed static data (`mockForgotPasswordSuccess`, `mockForgotPasswordError`, `mockResetPasswordSuccess`, `mockResetPasswordError`) referenced by the handlers.

Handlers are registered through `src/shared/mocks/browser.ts` — modules never start MSW themselves (per `structure-architecture.md` §3: `<module>/mocks/` is never imported by production code).

### 4. `token` sourced from URL query param on ResetPage
The reset link delivered by email contains a `?token=<value>` query param. `ResetPage` reads the token from `useSearchParams()` (Next.js) and passes it into the mutation DTO. If no token is present, the page renders an error state.

**Rationale:** This matches the standard password-reset URL pattern and avoids coupling to any session or cookie mechanism.

### 5. Schemas extend the existing `auth.schema.ts`
`forgotPasswordSchema` and `resetPasswordSchema` (with `.refine` for password match) are added to `auth.schema.ts` alongside the existing `loginSchema` / `signupSchema`.

## Risks / Trade-offs

- **Token not validated on frontend** → The mock always accepts any non-empty token except the hard-coded `invalid-token` fixture. Real validation happens on the backend. Risk is low for the mock phase.
- **`useSearchParams` requires Suspense boundary** → `ResetPage` must be wrapped in `<Suspense>` in the app router page file (or the page component itself provides the boundary). Mitigation: wrap `ResetPage`'s `useSearchParams` usage in a child component suspended at the page level.
