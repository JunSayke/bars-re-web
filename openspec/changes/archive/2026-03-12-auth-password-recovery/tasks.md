## 1. Schemas & Types

- [x] 1.1 Add `forgotPasswordSchema` (email field) to `src/modules/auth/schemas/auth.schema.ts`
- [x] 1.2 Add `resetPasswordSchema` (newPassword + confirmPassword with `.refine` match check) to `src/modules/auth/schemas/auth.schema.ts`
- [x] 1.3 Export `ForgotPasswordDto` and `ResetPasswordDto` types from `auth.schema.ts`
- [x] 1.4 Add `ForgotPasswordResponse` and `ResetPasswordResponse` types to `src/modules/auth/types/auth.types.ts`

## 2. Mock Service

- [x] 2.1 Add `forgotPassword(dto: ForgotPasswordDto)` to `src/modules/auth/services/auth.service.ts` — simulates delay, throws `AuthError` on `fail@test.com`
- [x] 2.2 Add `resetPassword(dto: ResetPasswordDto & { token: string })` to `auth.service.ts` — simulates delay, throws `AuthError` on token `invalid-token`

## 3. Mock Fixtures & Handlers

- [x] 3.1 Create `src/modules/auth/mocks/auth.fixtures.ts` with typed fixtures: `mockForgotPasswordSuccess`, `mockForgotPasswordError`, `mockResetPasswordSuccess`, `mockResetPasswordError`
- [x] 3.2 Create `src/modules/auth/mocks/auth.handlers.ts` with fully wired MSW handlers for `POST /auth/forgot-password` and `POST /auth/reset-password`

## 4. TanStack Query Mutations

- [x] 4.1 Create `src/modules/auth/hooks/useForgotPasswordMutation.ts` using `useMutation` wrapping `forgotPassword` service
- [x] 4.2 Create `src/modules/auth/hooks/useResetPasswordMutation.ts` using `useMutation` wrapping `resetPassword` service

## 5. CenteredCardShell Template

- [x] 5.1 Create `src/modules/auth/components/templates/CenteredCardShell.tsx` — full-screen centering wrapper with `bg-background` + inner card with `bg-card` rounded surface, accepts a `children` slot

## 6. PasswordRequirements Molecule

- [x] 6.1 Create `src/modules/auth/components/molecules/PasswordRequirements.tsx` — accepts `password: string` prop, derives three boolean checks (min 8 chars, has number, has special char), renders a labeled checklist with pass/fail visual indicators using theme colors

## 7. ForgotPasswordForm Organism

- [x] 7.1 Create `src/modules/auth/components/organisms/ForgotPasswordForm.tsx` — React Hook Form + `forgotPasswordSchema`, email input (shadcn `Input`/`Label`), "Send Reset Link →" submit button, server error display, loading state, "← Back to Login" link
- [x] 7.2 Wire icon at top of form card (lock icon from Lucide React, styled with accent/primary colors per design reference)

## 8. ResetPasswordForm Organism

- [x] 8.1 Create `src/modules/auth/components/organisms/ResetPasswordForm.tsx` — React Hook Form + `resetPasswordSchema`, two `PasswordField` molecules (new password + confirm), `PasswordRequirements` molecule wired to watched new-password value, "Update Password →" submit button, server error display, loading state, "← Back to Login" link
- [x] 8.2 Wire icon at top of form card (history/reset icon from Lucide React, styled per design reference)

## 9. Page Components

- [x] 9.1 Create `src/modules/auth/components/ForgotPage.tsx` — calls `useForgotPasswordMutation`, renders `CenteredCardShell` with `ForgotPasswordForm`; shows success message after mutation succeeds
- [x] 9.2 Create `src/modules/auth/components/ResetPage.tsx` — reads `token` from `useSearchParams`, guards on missing token with error state, calls `useResetPasswordMutation`, renders `CenteredCardShell` with `ResetPasswordForm`; navigates to `/login` on success
- [x] 9.3 Wrap `ResetPage`'s `useSearchParams` usage in a dedicated inner client component to satisfy Next.js Suspense requirement

## 10. App Router Wiring

- [x] 10.1 Update `app/(auth)/forgot/page.tsx` to import and default-export `ForgotPage` from `@/modules/auth`
- [x] 10.2 Update `app/(auth)/reset/page.tsx` to import and default-export `ResetPage` from `@/modules/auth`

## 11. Module Barrel

- [x] 11.1 Export `ForgotPage` and `ResetPage` from `src/modules/auth/index.ts`
