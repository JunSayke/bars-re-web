## Context

The application currently has four empty auth route stubs under `app/(auth)/`. There is no `src/modules/auth/` module at all. Users cannot log in or register, making the entire workspace feature inaccessible.

The UI target is defined by two Figma-quality mockups:
- **Login**: Dark two-column layout — left: branded panel with studio photo + social proof; right: email/password form, "Forgot Password?" link, Google OAuth, link to signup.
- **Signup**: Dark two-column layout — left: illustrated waveform branding + tagline; right: username, email, password+confirm, terms checkbox, Google OAuth, link to login.

Stack constraints: Next.js App Router · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (new-york) · React Hook Form · Zod · TanStack Query v5 · Vertical Slice + Atomic Design (see `structure-architecture.md`).

## Goals / Non-Goals

**Goals:**
- Scaffold the full `src/modules/auth/` vertical slice end-to-end.
- Render pixel-faithful implementations of both mockup screens (dark theme, purple accent palette from `globals.css`).
- Integrate React Hook Form + Zod for client-side validation on both forms.
- Use TanStack Query `useMutation` for form submissions wired to mock service functions.
- Provide typed mock API responses with simulated 800 ms latency so the UI behaves like a real integration.
- Keep `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` as thin re-exports (≤ 10 lines each).

**Non-Goals:**
- Real backend integration (deferred to a future change).
- JWT token storage, session management, or protected route middleware.
- Forgot-password and reset-password page implementations (separate stories).
- Unit/integration tests (separate change).
- Accessibility audit beyond semantic HTML form elements.

## Decisions

### D1 — Two-column layout via `AuthShell` template

**Decision**: Create a module-scoped template `src/modules/auth/components/templates/AuthShell.tsx` that accepts `aside` and `form` slot props. It renders a 50/50 split on `lg+` screens and collapses to form-only on mobile.

**Rationale**: Both login and signup share identical structural layout. Extracting it to a template keeps both page components to pure composition. Following the architecture promotion rule, it stays module-scoped until a second module (e.g., onboarding) needs it.

**Alternative considered**: Inline layout per page — rejected because it duplicates layout logic and breaks the template layer contract.

---

### D2 — Mock API via service + TanStack Query mutation

**Decision**: `src/modules/auth/services/auth.service.ts` exports `loginUser(dto)` and `signupUser(dto)` functions that return a `Promise` resolved after 800 ms with a typed mock payload. `useLoginMutation` and `useSignupMutation` hooks wrap these with `useMutation`.

**Rationale**: The Page layer must never call fetch directly. Using the service + hook pattern now means swapping mock → real API requires only changing the service function — all hook, form, and page code stays the same.

**Alternative considered**: `useState` + direct `fetch` in the organism — rejected as it violates the architecture contract and makes the real API swap invasive.

---

### D3 — Zod schemas as single source of truth for form types

**Decision**: `src/modules/auth/schemas/auth.schema.ts` defines `loginSchema` and `signupSchema` with Zod. TypeScript types are inferred via `z.infer<>`. React Hook Form uses `zodResolver` for validation.

**Rationale**: Single definition point for validation rules and types. Avoids type drift between the form shape and what the service function receives.

---

### D4 — Component hierarchy for auth module

```
AuthShell (template)
├── BrandPanel (organism) — left column
└── LoginForm / SignupForm (organism) — right column
      ├── PasswordField (molecule) — input + toggle visibility
      ├── OAuthDivider (atom) — "OR CONTINUE WITH" rule
      └── shadcn/ui primitives (Button, Input, Label, Checkbox)
```

**Rationale**: Follows atomic design contract. Organisms own the form wiring. The template owns only layout. The page only composes template + organisms + hooks.

---

### D5 — Dark theme via CSS variables from `globals.css`

**Decision**: Use Tailwind utility classes that reference the CSS custom properties already defined in `globals.css` (e.g., `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`). Do not hardcode color values.

**Rationale**: The dark palette (`--background: oklch(0.2077...)`, `--primary: oklch(0.6056...)`) is already configured. Using semantic tokens makes the component automatically correct in both light and dark modes.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Mock latency hides real API edge cases (network errors, 401, 422) | Add typed error simulation to the mock service so error UI paths are exercised |
| `AuthShell` template promoted too early | Keep it module-scoped; only promote when a real second consumer exists |
| Password field visibility toggle duplicating shadcn Input logic | Implement as a `PasswordField` molecule wrapping `Input` + an icon button — reusable, no duplication |
| Google OAuth button is non-functional | Render as a disabled/visual-only button with a `// TODO: integrate OAuth` comment |
