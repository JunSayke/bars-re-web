# Tasks: Supabase Auth Client Integration

## Setup
- [x] 1.1 Install `@supabase/supabase-js` via pnpm
- [x] 1.2 Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` and `.env.example`

## Supabase Client Setup
- [x] 2.1 Create `src/shared/config/supabase.ts` — instantiate and export a named typed Supabase client singleton using env vars; throw a clear error if either var is missing

## Auth Types Update
- [x] 3.1 Update `src/modules/auth/types/auth.types.ts` — replace `AuthUser` fields to match Supabase `User` / `Session` shape (`id`, `email`, `accessToken`); remove legacy `token` field
- [x] 3.2 Update `AuthError` in `auth.types.ts` to align with Supabase's `AuthError` shape
- [x] 3.3 Remove `ForgotPasswordResponse` and `ResetPasswordResponse` if they no longer map to a real Supabase return shape, or update them if they do

## Auth Service Migration
- [x] 4.1 Rewrite `loginUser` in `auth.service.ts` to call `supabase.auth.signInWithPassword` and map result to `AuthUser`
- [x] 4.2 Rewrite `signupUser` in `auth.service.ts` to call `supabase.auth.signUp` and map result to `AuthUser`
- [x] 4.3 Rewrite `forgotPassword` in `auth.service.ts` to call `supabase.auth.resetPasswordForEmail`
- [x] 4.4 Rewrite `resetPassword` in `auth.service.ts` to call `supabase.auth.updateUser` with the new password
- [x] 4.5 Remove all `fetch` calls and `NEXT_PUBLIC_API_URL` references from `auth.service.ts`

## Auth Session Management
- [x] 5.1 Create `src/modules/auth/hooks/useAuthSession.ts` — subscribe to `supabase.auth.onAuthStateChange` and return current `AuthUser` or `null`
- [x] 5.2 Add a `signOut` function to the hook that calls `supabase.auth.signOut` and redirects to `ROUTES.AUTH.LOGIN`
- [x] 5.3 Export `useAuthSession` from `src/modules/auth/index.ts`

## Auth Hooks Update
- [x] 6.1 Update error handling in `useLoginMutation.ts` to handle Supabase `AuthError` shape
- [x] 6.2 Update error handling in `useSignupMutation.ts` to handle Supabase `AuthError` shape
- [x] 6.3 Update error handling in `useForgotPasswordMutation.ts` to handle Supabase `AuthError` shape
- [x] 6.4 Update error handling in `useResetPasswordMutation.ts` to handle Supabase `AuthError` shape

## Auth Mocks Update
- [x] 7.1 Update `auth.fixtures.ts` — replace all fixtures with Supabase-shaped responses (`access_token`, `token_type`, `user.id`, etc.); remove NestJS-shaped fixtures
- [x] 7.2 Update `auth.handlers.ts` — replace all NestJS endpoint paths with Supabase REST paths (`<SUPABASE_URL>/auth/v1/token`, `/auth/v1/signup`, `/auth/v1/recover`, `/auth/v1/user`)

## Cleanup
- [x] 8.1 Confirm `NEXT_PUBLIC_API_URL` is not referenced anywhere in `src/modules/auth/`
- [x] 8.2 Confirm no `as any` casts were introduced in service or type files
- [x] 8.3 Confirm TypeScript compilation passes with `pnpm tsc --noEmit`
