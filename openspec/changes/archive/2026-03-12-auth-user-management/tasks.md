## 1. Module Scaffold

- [x] 1.1 Create directory tree `src/modules/auth/` with sub-folders: `components/atoms`, `components/molecules`, `components/organisms`, `components/templates`, `hooks`, `services`, `schemas`, `types`
- [x] 1.2 Create `src/modules/auth/index.ts` barrel (export `LoginPage`, `SignupPage`, and `meta`)
- [x] 1.3 Create `src/modules/auth/meta.ts` with Next.js `metadata` exports for login and signup pages

## 2. Schemas & Types

- [x] 2.1 Create `src/modules/auth/schemas/auth.schema.ts` — define `loginSchema` (identifier, password) and `signupSchema` (username, email, password, confirmPassword, terms) with Zod; export inferred types `LoginDto` and `SignupDto`
- [x] 2.2 Create `src/modules/auth/types/auth.types.ts` — define `AuthUser` (id, username, email, token) and `AuthError` types

## 3. Mock Service

- [x] 3.1 Create `src/modules/auth/services/auth.service.ts` — implement `loginUser(dto: LoginDto): Promise<AuthUser>` returning mock data after 800 ms, throwing a typed error on invalid credentials (e.g. `identifier === "error@test.com"`)
- [x] 3.2 Add `signupUser(dto: SignupDto): Promise<AuthUser>` to the same service with 800 ms mock delay and a conflict error path for a reserved test username

## 4. Hooks

- [x] 4.1 Create `src/modules/auth/hooks/queryKeys.ts` — define query key factory for the auth module
- [x] 4.2 Create `src/modules/auth/hooks/useLoginMutation.ts` — wrap `loginUser` service with TanStack Query `useMutation`, expose `mutate`, `isPending`, `error`
- [x] 4.3 Create `src/modules/auth/hooks/useSignupMutation.ts` — wrap `signupUser` with `useMutation`, same surface

## 5. Atoms & Molecules

- [x] 5.1 Create `src/modules/auth/components/atoms/OAuthDivider.tsx` — renders the "OR CONTINUE WITH" horizontal rule with center label
- [x] 5.2 Create `src/modules/auth/components/molecules/PasswordField.tsx` — wraps shadcn `Input` with a lock icon prefix and an eye/eye-off toggle button suffix; accepts standard input props + `label`

## 6. Organisms

- [x] 6.1 Create `src/modules/auth/components/organisms/LoginForm.tsx` — assembles the login form using React Hook Form + `zodResolver(loginSchema)`, renders email field, `PasswordField`, "Forgot Password?" link, submit button, `OAuthDivider`, Google button, and "Create an account" link; accepts `onSubmit` callback + `isPending` prop
- [x] 6.2 Create `src/modules/auth/components/organisms/SignupForm.tsx` — assembles the signup form using React Hook Form + `zodResolver(signupSchema)`, renders username field (with mic icon), email field, two `PasswordField` instances (password + confirm), terms checkbox with Terms/Privacy links, submit button, `OAuthDivider`, Google button, and "Already a member?" link; submit button disabled when terms unchecked
- [x] 6.3 Create `src/modules/auth/components/organisms/LoginBrandPanel.tsx` — left-column branding panel for login: logo + app name, studio background image (or gradient placeholder), "SYSTEM ONLINE" badge, headline "Drop bars faster / powered by AI.", avatar group + "Join 2,000+ Bisaya artists today."
- [x] 6.4 Create `src/modules/auth/components/organisms/SignupBrandPanel.tsx` — left-column branding panel for signup: logo name "Bisaya AI Rap System", waveform illustration (SVG or placeholder), headline "Elevate Your Flow with AI", supporting description

## 7. Template

- [x] 7.1 Create `src/modules/auth/components/templates/AuthShell.tsx` — two-column template accepting `aside: ReactNode` and `form: ReactNode` slot props; `lg:grid-cols-2` layout, left column hidden on mobile (`hidden lg:flex`), dark background matching `globals.css` `--background` token

## 8. Page Components

- [x] 8.1 Create `src/modules/auth/components/LoginPage.tsx` — calls `useLoginMutation`, passes `mutate` + `isPending` to `LoginForm`, composes `AuthShell` with `LoginBrandPanel` as `aside` and `LoginForm` as `form`
- [x] 8.2 Create `src/modules/auth/components/SignupPage.tsx` — calls `useSignupMutation`, passes `mutate` + `isPending` to `SignupForm`, composes `AuthShell` with `SignupBrandPanel` as `aside` and `SignupForm` as `form`

## 9. Route Wiring

- [x] 9.1 Replace `app/(auth)/login/page.tsx` stub with a thin re-export of `LoginPage` from `@/modules/auth` (≤ 10 lines)
- [x] 9.2 Replace `app/(auth)/signup/page.tsx` stub with a thin re-export of `SignupPage` from `@/modules/auth` (≤ 10 lines)

## 10. Visual Polish & Validation

- [x] 10.1 Verify dark theme renders correctly — all colors use semantic CSS variable tokens (`bg-background`, `bg-primary`, `text-muted-foreground`, etc.) from `globals.css`; no hardcoded hex/rgb values
- [x] 10.2 Verify login form validation: empty submit shows errors; invalid email shows error; password toggle works
- [x] 10.3 Verify signup form validation: password mismatch error; password < 8 chars error; terms checkbox blocks submit; confirm toggle works
- [x] 10.4 Verify mock mutation flow: spinner appears on submit; mock success path resolves; mock error path (reserved test credentials) shows error feedback
- [x] 10.5 Verify responsive layout: on mobile, left brand panel is hidden and form panel fills full width
