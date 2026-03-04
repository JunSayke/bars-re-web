# Clean Architecture File Organization for Next.js (App Router)

This guide defines a **Clean Architecture** file organization for this project (`bars-re-web`) using **Next.js App Router**.

It is tailored to the current codebase structure (routes in `app/`, UI components in `src/components`, and feature areas like `auth`, `editor`, and `settings`).

---

## Goals

- Keep routes simple and focused on navigation/rendering.
- Isolate business rules from framework and UI details.
- Organize by **feature/domain** first, then by architectural layer.
- Enable incremental migration without breaking existing routes.

---

## Core Principles

1. **Framework at the edges**
   - Next.js (`app/`, server actions, route handlers) should be an outer detail, not your core logic.

2. **Feature-first organization**
   - Group files by domain (`auth`, `editor`, `settings`) instead of global “hooks/utils/services” buckets.

3. **Dependency direction**
   - `presentation -> application -> domain`
   - `infrastructure -> application/domain`
   - `domain` depends on nothing from Next.js/React.

4. **Thin routes**
   - Files in `app/` should mostly compose layouts/pages and call feature entry points.

5. **Safe colocation**
   - Use Next.js colocation and private folders (`_folder`) for route-local implementation details.

---

## Recommended Top-Level Structure

```text
.
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  ├─ signup/page.tsx
│  │  ├─ forgot/page.tsx
│  │  └─ reset/page.tsx
│  ├─ workspaces/
│  │  └─ editor/page.tsx
|  |  └─ page.tsx
│  ├─ settings/
│  │  ├─ profile/page.tsx
│  │  └─ account/page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ src/
│  ├─ components/              # shared design system (atoms/molecules/organisms)
│  │
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ domain/
│  │  │  ├─ application/
│  │  │  ├─ infrastructure/
│  │  │  └─ presentation/
│  │  │
│  │  ├─ editor/
│  │  │  ├─ domain/
│  │  │  ├─ application/
│  │  │  ├─ infrastructure/
│  │  │  └─ presentation/
│  │  │
│  │  └─ settings/
│  │     ├─ domain/
│  │     ├─ application/
│  │     ├─ infrastructure/
│  │     └─ presentation/
│  │
│  └─ shared/
│     ├─ lib/                  # framework-agnostic utilities
│     ├─ types/
│     ├─ constants/
│     └─ config/
│
├─ clean-architecture.md
└─ package.json
```

---

## Layer Definitions (Per Feature)

Each feature module (`src/modules/<feature>`) should use these layers.

### 1) `domain/`

Contains pure business concepts:

- Entities
- Value objects
- Domain services
- Domain errors
- Domain rules/validators (framework-independent)

**Rules**
- No React imports
- No Next.js imports
- No HTTP/database details

---

### 2) `application/`

Contains use-case orchestration:

- Use cases (`login`, `resetPassword`, `saveProfile`, etc.)
- Input/output DTOs
- Interfaces (ports) for repositories/services

**Rules**
- May depend on `domain`
- Must not depend on Next.js route files/pages
- Talks to abstractions, not concrete infra

---

### 3) `infrastructure/`

Contains concrete external implementations:

- API clients
- Repository implementations
- Data mappers
- Persistence and external service adapters

**Rules**
- Implements interfaces from `application`
- Can use `fetch`, cookies, headers, env vars, etc.

---

### 4) `presentation/`

Contains feature-facing UI integration:

- Feature components
- Feature hooks
- Form schemas/adapters
- View models

**Rules**
- Can depend on `application`
- Can use shared UI components from `src/components`
- Avoid direct infra calls from deeply nested UI components when a use case can orchestrate instead

---

## Next.js App Router Organization Rules

1. **Keep `app/` route-centric**
   - `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
   - Delegate business logic to `src/modules/*`

2. **Use route groups for UX partitions**
   - Existing `(auth)` is good.
   - Add groups like `(workspace)` if section-level layouts diverge.

3. **Use private folders in route segments**
   - Example: `app/(auth)/login/_components/*`
   - Prevents accidental routable segments.

4. **Use colocation intentionally**
   - Route-local UI in `app/.../_components`
   - Shared feature UI in `src/modules/<feature>/presentation`

5. **One route, one composition entry**
   - Route files compose page structure and invoke feature-level “screen” components/use-cases.

---

## Mapping from Current Structure

Current notable areas:

- `app/(auth)/*`
- `app/workspaces/editor/*`
- `app/settings/profile/*`
- `app/settings/account/*`
- `src/components/atoms|molecules|organisms/*`

### Keep as-is

- `src/components/atoms`, `molecules`, `organisms` as your shared/component-library layer.

### Introduce gradually

- `src/modules/auth/*`
- `src/modules/workspaces/*`
- `src/modules/settings/*`
- `src/shared/*`

### Suggested first moves

- Move auth business/form orchestration from route-level files into `src/modules/auth/application` and `presentation`.
- Move editor domain logic (workspace behaviors) into `src/modules/editor`.
- Move profile/security use cases into `src/modules/settings`.

---

## Suggested Conventions

### Naming

- Use case files: `verb-noun.use-case.ts` (e.g., `login.use-case.ts`)
- Repository interfaces: `*.repository.ts`
- Infra implementations: `*-api.repository.ts` or `*-http.repository.ts`
- DTOs: `*.dto.ts`
- Domain models: `*.entity.ts`, `*.value-object.ts`

### Imports

Use TS path aliases (recommended):

- `@/modules/*`
- `@/shared/*`
- `@/components/*`

### Boundaries

- Do not import from `infrastructure` into `domain`.
- Avoid cross-feature imports unless through `application` contracts or a shared kernel.

---

## Example Feature Layout (`auth`)

```text
src/modules/auth/
├─ domain/
│  ├─ user.entity.ts
│  ├─ credential.value-object.ts
│  └─ auth.errors.ts
├─ application/
│  ├─ login.use-case.ts
│  ├─ signup.use-case.ts
│  ├─ reset-password.use-case.ts
│  ├─ auth.repository.ts
│  └─ dto/
│     ├─ login.dto.ts
│     └─ signup.dto.ts
├─ infrastructure/
│  ├─ auth-http.repository.ts
│  └─ mappers/
│     └─ auth.mapper.ts
└─ presentation/
   ├─ hooks/
   │  └─ use-login.ts
   ├─ forms/
   │  ├─ login.schema.ts
   │  └─ signup.schema.ts
   └─ components/
      └─ auth-screen.tsx
```

Route composition stays thin:

- `app/(auth)/login/page.tsx` imports and renders `auth` presentation entry component.

---

## Incremental Migration Plan

### Phase 1 — Establish structure

- Create `src/modules/{auth,editor,settings}` with empty layer folders.
- Add `src/shared/{lib,types,constants,config}`.
- Keep behavior unchanged.

### Phase 2 — Move auth

- Extract auth use-cases + schemas + adapters into `src/modules/auth`.
- Keep route and UI output stable.

### Phase 3 — Move editor

- Extract workspace-related business rules and orchestration.
- Route file becomes composition-only.

### Phase 4 — Move settings

- Separate `profile` and `security` use-cases under settings module.

### Phase 5 — Enforce boundaries

- Add ESLint import rules and TS aliases.
- Prevent accidental cross-layer/cross-feature coupling.

---

## Do / Don’t

### Do

- Keep modules cohesive and independently understandable.
- Keep `domain` pure and testable.
- Keep route files minimal.

### Don’t

- Put business logic directly in `app/**/page.tsx`.
- Mix API calls directly into low-level reusable UI atoms/molecules.
- Create shared folders too early for code used by only one feature.

---

## Definition of Done (Architecture)

You are “clean-architecture organized” when:

- Each major feature has `domain/application/infrastructure/presentation`.
- Route files primarily compose and delegate.
- Shared UI remains in `src/components`.
- Dependency direction is respected.
- New features are added as modules, not scattered global files.
