# Structure & Architecture — Bisaya AI Rap (Frontend)

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (new-york) · Radix UI · TanStack Query v5 · React Hook Form · Zod · Lucide React · pnpm
>
> **Pattern:** Vertical Slice (modular) + Atomic Design · Next.js is a **pure frontend** — all data lives in the NestJS backend.
>
> **Vertical Slice** means each feature (e.g., `auth`, `workspace`) is a self-contained folder that owns its own UI, data fetching, validation, and types — rather than splitting those concerns into shared global layers (e.g., a global `hooks/` folder, a global `services/` folder).
>
> This document is the single source of truth for every human and LLM working on this codebase. Every rule is **strict**. Deviations require an explicit ADR (Architecture Decision Record — a short written note explaining why the rule was changed and what was decided instead).

---

## Table of Contents

1. [Mental Model](#1-mental-model)
2. [Full Directory Tree](#2-full-directory-tree)
3. [Layer Rules](#3-layer-rules)
4. [Atomic Design Contract](#4-atomic-design-contract)
5. [Module Anatomy](#5-module-anatomy)
6. [Module Grouping — When a Module Gets Too Large](#6-module-grouping--when-a-module-gets-too-large)
7. [App Router — Thin Routing Layer](#7-app-router--thin-routing-layer)
8. [Data Fetching Contract](#8-data-fetching-contract)
9. [Shared Layer](#9-shared-layer)
10. [Import & Barrel Rules](#10-import--barrel-rules)
11. [Git Flow + Worktree Strategy](#11-git-flow--worktree-strategy)
12. [LLM Prompt Convention](#12-llm-prompt-convention)
13. [Naming Conventions Cheatsheet](#13-naming-conventions-cheatsheet)
14. [Forbidden Patterns](#14-forbidden-patterns)
15. [Decision Tree — Where Does This File Go?](#15-decision-tree--where-does-this-file-go)

---

## 1. Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  app/  (Next.js App Router — routing shell ONLY)            │
│    └── page.tsx  →  imports ONE Page component from module  │
├─────────────────────────────────────────────────────────────┤
│  src/modules/  (Vertical Slices — all feature logic)        │
│    └── <module>/  owns: UI · hooks · services · types       │
├─────────────────────────────────────────────────────────────┤
│  src/components/  (Atomic Design — shared presentational)   │
│    atoms / molecules / organisms / templates / ui (shadcn)  │
├─────────────────────────────────────────────────────────────┤
│  src/shared/  (Utilities only — no UI, no business logic)   │
│    lib / hooks / types / constants / config                 │
└─────────────────────────────────────────────────────────────┘
```

**The one-way dependency rule:**

```
app  →  modules  →  components  →  shared
                 ↘  shared
         (never in reverse — shared never imports from components, modules, or app)
```

Modules **never import from other modules** directly. Anything used by more than one module is moved up to `src/shared/` (utilities) or `src/components/` (UI).

---

## 2. Full Directory Tree

```
web/
├── app/                              # Next.js App Router (routing only)
│   ├── layout.tsx                    # Root layout — providers only
│   ├── page.tsx                      # → modules/home/components/HomePage
│   ├── (auth)/
│   │   ├── layout.tsx                # Auth shell layout
│   │   ├── login/page.tsx            # → modules/auth/components/LoginPage
│   │   ├── signup/page.tsx           # → modules/auth/components/SignupPage
│   │   ├── forgot/page.tsx           # → modules/auth/components/ForgotPage
│   │   └── reset/page.tsx            # → modules/auth/components/ResetPage
│   ├── settings/
│   │   ├── layout.tsx                # Settings shell layout
│   │   ├── profile/page.tsx          # → modules/settings/components/ProfilePage
│   │   └── account/page.tsx          # → modules/settings/components/AccountPage
│   └── workspaces/
│       ├── layout.tsx                # Workspace shell layout
│       ├── page.tsx                  # → modules/workspace/components/WorkspacesPage
│       └── editor/page.tsx           # → modules/workspace/components/EditorPage
│
├── src/
│   ├── modules/                      # Vertical slices — ALL feature logic
│   │   ├── auth/
│   │   ├── settings/
│   │   └── workspace/                # May be a module GROUP (see §6)
│   │
│   ├── components/                   # Shared atomic design (presentational only)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   └── ui/                       # shadcn/ui primitives (do not hand-edit)
│   │
│   └── shared/                       # Zero-feature layer
│       ├── lib/
│       │   └── utils.ts
│       ├── hooks/
│       ├── types/
│       ├── constants/
│       └── config/
│
├── public/
├── components.json                   # shadcn/ui config
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Layer Rules

### `app/` — Routing Shell
- Contains **only** Next.js routing files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- A `page.tsx` file has **one job**: re-export a Page component from its module.
- **No business logic, no hooks, no API calls.**
- Maximum 10 lines per `page.tsx`.

```tsx
// ✅ app/workspaces/editor/page.tsx
import { EditorPage } from "@/modules/workspace";
export { metadata } from "@/modules/workspace/meta";
export default EditorPage;
```

### `src/modules/` — Feature Slices
- One directory per feature area (e.g., `auth`, `workspace`, `settings`).
- Owns everything needed to deliver that feature: components, hooks, services, types, schemas, utils.
- **Never imports from a sibling module.**
- Exposes a public API through its `index.ts` barrel — an `index.ts` file that re-exports only what outside code is allowed to use.

### `src/components/` — Shared Atomic UI
- Purely presentational. Zero business logic.
- No TanStack Query calls. No direct API calls.
- Accepts only props. Emits only callbacks.
- Sub-folders: `atoms/` `molecules/` `organisms/` `templates/` `ui/`.

### `src/shared/` — Pure Utilities
- Zero React components.
- No imports from `modules/` or `components/`.
- Functions, types, constants, and configuration only.

---

## 4. Atomic Design Contract

Atomic design applies at **two levels**: global (`src/components/`) and per-module (`src/modules/<module>/components/`).

### Atom
> Smallest indivisible UI unit. No composition of other custom components.

- HTML element wrappers with styling and variants only.
- Props: primitive values + standard React HTML attributes.
- **Examples:** `Button`, `Input`, `Label`, `Icon`, `Badge`, `Divider`, `Avatar`, `Spinner`.

```tsx
// src/components/atoms/Button.tsx
// @layer: atom | @scope: global
export function Button({ variant, size, ...props }: ButtonProps) { ... }
```

### Molecule
> Composes 2–5 atoms to perform a single UI task.

- May have local `useState` for internal UI state (e.g., password visibility toggle).
- **No** data fetched from the backend. **No** async logic.
- **Examples:** `FormField`, `PasswordInput`, `SearchBar`, `UserAvatar`, `NavItem`.

```tsx
// src/components/molecules/FormField.tsx
// @layer: molecule | @scope: global
export function FormField({ label, error, children }: FormFieldProps) { ... }
```

### Organism
> Assembles molecules and atoms into a self-contained UI section.

- May accept data as props (fed from a Page or feature hook).
- **No** direct data fetching.
- **Examples:** `AuthForm`, `Sidebar`, `Header`, `DataTable`, `SettingsPanel`.

```tsx
// src/components/organisms/AuthForm.tsx
// @layer: organism | @scope: global
export function AuthForm({ onSubmit, isLoading }: AuthFormProps) { ... }
```

### Template
> Defines a page's layout skeleton by composing organisms into named slots. Contains no real data — only layout structure, spacing, and wiring.

- Receives organisms as named props (e.g., `aside`, `main`, `footer`). These are sometimes called "slots" — each prop is a placeholder the Page fills with a real organism.
- **No** business logic. **No** state. **No** data fetching.
- Defines which named regions (slots) exist on the page, their order, and their proportions. The Page fills these slots with real organisms and data.
- May contain conditional structural variants (e.g., sidebar present vs. collapsed) driven by a layout prop — never by feature data.
- **Examples:** `TwoColumnLayout`, `AuthShell`, `DashboardLayout`, `EditorLayout`, `SettingsLayout`.

```tsx
// src/components/templates/TwoColumnLayout.tsx
// @layer: template | @scope: global
export function TwoColumnLayout({
  aside,
  main,
  footer,
}: TwoColumnLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr]">
      <aside className="border-r">{aside}</aside>
      <main className="flex flex-col overflow-auto">
        {main}
        {footer && <footer>{footer}</footer>}
      </main>
    </div>
  );
}
```

A module-scoped template defines the layout for a specific feature and is not yet shared:

```tsx
// src/modules/auth/components/templates/AuthShell.tsx
// @layer: template | @scope: module:auth
export function AuthShell({ aside, form }: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden">
      <div className="hidden w-[480px] lg:block">{aside}</div>
      <div className="flex flex-1 items-center justify-center p-8">{form}</div>
    </div>
  );
}
```

### Page (module-level only)
> Composes organisms **through a template**. Owns data fetching via module hooks.

- Lives in `src/modules/<module>/components/<Feature>Page.tsx`.
- Calls module hooks (e.g., `useLoginMutation`, `useAuthSession`, `useWorkspaceList`).
- Passes data down to organisms as props.
- **This is the only component layer that touches server state.**

```tsx
// src/modules/auth/components/LoginPage.tsx
// @layer: page | @scope: module:auth
export function LoginPage() {
  const { mutate, isPending } = useLoginMutation();
  return (
    <AuthShell
      aside={<AuthAside />}
      form={<LoginForm onSubmit={mutate} isLoading={isPending} />}
    />
  );
}
```

### Promotion Rule
> A component starts in a module. It moves up when needed by more than one consumer.

| Used by | Lives in |
|---|---|
| 1 module only | `src/modules/<module>/components/<layer>/` |
| 2+ modules | `src/components/<layer>/` |
| shadcn primitive | `src/components/ui/` (never hand-edit) |

> **Template promotion is especially common.** A layout skeleton built for one feature (e.g., `AuthShell`) often gets reused by a second feature (e.g., onboarding). Move it to `src/components/templates/` the moment a second consumer appears.

---

## 5. Module Anatomy

Every module follows this exact structure:

```
src/modules/<module>/
├── index.ts                  # Public barrel — ONLY export what outside callers need
│
├── components/               # Atomic hierarchy scoped to this module
│   ├── atoms/                # Module-local atoms
│   ├── molecules/            # Module-local molecules
│   ├── organisms/            # Module-local organisms
│   ├── templates/            # Module-local layout skeletons
│   └── <Feature>Page.tsx     # Page component(s) — top-level, not in sub-folder
│
├── hooks/                    # React hooks (business logic + TanStack Query)
│   ├── use<Feature>.ts           # Read hooks — useQuery / useInfiniteQuery
│   ├── use<Feature>Mutation.ts   # Write hooks — useMutation
│   └── queryKeys.ts              # Typed query key factory for this module
│
├── services/                 # API client functions (fetch wrappers)
│   └── <module>.service.ts   # Returns plain data; no React
│
├── schemas/                  # Zod schemas + inferred TypeScript types
│   └── <module>.schema.ts
│
├── types/                    # Additional TypeScript types/interfaces
│   └── <module>.types.ts
│
├── utils/                    # Pure functions scoped to this module
│   └── <module>.utils.ts
│
└── meta.ts                   # Next.js metadata exports (title, description)
```

### Concrete Example — `auth` module

```
src/modules/auth/
├── index.ts
├── components/
│   ├── atoms/
│   │   └── OAuthDivider.tsx
│   ├── molecules/
│   │   └── PasswordField.tsx
│   ├── organisms/
│   │   └── LoginForm.tsx
│   ├── templates/
│   │   └── AuthShell.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ForgotPage.tsx
│   └── ResetPage.tsx
├── hooks/
│   ├── useLoginMutation.ts
│   ├── useSignupMutation.ts
│   └── useAuthSession.ts
├── services/
│   └── auth.service.ts
├── schemas/
│   └── auth.schema.ts
├── types/
│   └── auth.types.ts
├── utils/
│   └── auth.utils.ts
└── meta.ts
```

---

## 6. Module Grouping — When a Module Gets Too Large

**Threshold:** A module becomes a **module group** when any of the following is true:
- More than **8 Page components**
- More than **15 hooks**
- More than **3 clearly distinct sub-domains** within the module
- Independent teams own different sub-domains

### Module Group Structure

A module group is a folder containing **sub-modules** plus a `_core/` folder for shared internals.

```
src/modules/workspace/           # Module GROUP
├── index.ts                     # Group barrel — re-exports sub-module publics
│
├── _core/                       # Shared ONLY within this group — the _ prefix marks it as private to the group
│   ├── components/
│   │   └── WorkspaceShell.tsx
│   ├── hooks/
│   │   └── useWorkspaceContext.ts
│   ├── types/
│   │   └── workspace.types.ts
│   └── index.ts                 # Private to the group
│
├── editor/                      # Sub-module
│   ├── index.ts
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── schemas/
│   └── meta.ts
│
├── canvas/                      # Sub-module
│   ├── index.ts
│   └── ...
│
└── dashboard/                   # Sub-module
    ├── index.ts
    └── ...
```

### Group Rules
- Sub-modules import from `_core/` using the group-relative alias: `@/modules/workspace/_core`.
- Sub-modules **never import from sibling sub-modules** directly.
- `_core/` is private to the group — it is **not** re-exported from the top-level `index.ts`.
- The group's `index.ts` only re-exports the sub-modules' public APIs.
- If `_core/` grows beyond 5 hooks or 8 components, extract the truly shared pieces to `src/shared/` or `src/components/`.

---

## 7. App Router — Thin Routing Layer

`app/` contains **only** Next.js file-system routing conventions.

### layout.tsx — Providers Only

```tsx
// app/layout.tsx — Root layout
import { QueryProvider } from "@/shared/config/QueryProvider";
// ... fonts

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fonts} antialiased dark`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### page.tsx — One Re-export

```tsx
// app/(auth)/login/page.tsx
import { LoginPage } from "@/modules/auth";
export { metadata } from "@/modules/auth/meta";
export default LoginPage;
```

### metadata — Lives in Module

```ts
// src/modules/auth/meta.ts
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login — Bisaya AI Rap",
};
```

### loading.tsx / error.tsx

These live in `app/` but delegate to module-level components. Import through the module's public barrel — never directly into `_core/`:

```tsx
// app/workspaces/loading.tsx
// WorkspaceSkeleton must be exported from src/modules/workspace/index.ts
export { WorkspaceSkeleton as default } from "@/modules/workspace";
```

---

## 8. Data Fetching Contract

> Next.js is a **pure frontend**. All data comes from the NestJS backend via HTTP.

### Service Layer

```ts
// src/modules/auth/services/auth.service.ts
// @layer: service | @scope: module:auth

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(body: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // send cookies for session-based auth
  });
  if (!res.ok) throw new ApiError(res);
  return res.json();
}
```

- Service functions are **plain async functions** — no React, no hooks.
- They are the only place that calls `fetch` or `axios`.
- They throw on non-2xx responses.

### Hook Layer (TanStack Query)

```ts
// src/modules/auth/hooks/useLoginMutation.ts
// @layer: hook | @scope: module:auth

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../services/auth.service";
import type { LoginRequest } from "../schemas/auth.schema";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    // Use authKeys from queryKeys.ts once defined; inline key shown here for brevity
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
  });
}
```

### Query Key Convention

```ts
// Always structured as an array tuple:
["<module>", "<resource>"]           // list
["<module>", "<resource>", id]       // single
["<module>", "<resource>", filters]  // filtered list
```

```ts
// Examples
["auth", "session"]
["workspace", "list"]
["workspace", "detail", workspaceId]
```

Define query keys in `src/modules/<module>/hooks/queryKeys.ts`:

```ts
// src/modules/workspace/hooks/queryKeys.ts
export const workspaceKeys = {
  all: ["workspace"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
};
```

---

## 9. Shared Layer

`src/shared/` has no business logic and no UI components. It never imports from `modules/` or `components/` — it sits at the bottom of the dependency chain so every other layer can safely import from it.

```
src/shared/
├── lib/
│   ├── utils.ts              # cn(), formatDate(), etc.
│   └── errors.ts             # ApiError class
├── hooks/
│   ├── useDebounce.ts        # Generic UI hooks
│   └── useLocalStorage.ts
├── types/
│   └── api.types.ts          # Generic ApiResponse<T>, Pagination, etc.
├── constants/
│   └── routes.ts             # ROUTES object — all app paths
└── config/
    └── QueryProvider.tsx     # TanStack Query client + provider
```

### Route Constants

Always reference routes through the constants object — never hardcode strings:

```ts
// src/shared/constants/routes.ts
export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT: "/forgot",
    RESET: "/reset",
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    ACCOUNT: "/settings/account",
  },
  WORKSPACES: {
    LIST: "/workspaces",
    EDITOR: "/workspaces/editor",
  },
} as const;
```

---

## 10. Import & Barrel Rules

### Path Alias

The alias `@/*` resolves to `src/*` (from `tsconfig.json`).

```ts
// ✅ Importing a global shared component (from anywhere)
import { Button } from "@/components/atoms/Button";
import { cn } from "@/shared/lib/utils";

// ✅ Importing from a module — always use the barrel (from outside the module)
import { LoginPage } from "@/modules/auth";

// ✅ Importing within the same module — use relative paths, not the barrel
// Using the barrel from inside the same module creates a circular import (the barrel
// imports LoginPage, and LoginPage would then import from the barrel that imports it).
// (e.g., inside src/modules/auth/components/LoginPage.tsx)
import { useLoginMutation } from "../hooks/useLoginMutation";

// ❌ Never use relative paths that cross layer boundaries
import { Button } from "../../components/atoms/Button";

// ❌ Never deep-import into another module from outside it
import { useLoginMutation } from "@/modules/auth/hooks/useLoginMutation";
```

### Barrel Files (`index.ts`)

Every module **must** have an `index.ts` that explicitly declares its public API.

```ts
// src/modules/auth/index.ts
// @public-api | @scope: module:auth

// Pages
export { LoginPage } from "./components/LoginPage";
export { SignupPage } from "./components/SignupPage";

// Hooks (only those needed by other layers, like providers)
export { useAuthSession } from "./hooks/useAuthSession";

// Types consumed outside the module
export type { AuthUser } from "./types/auth.types";

// ❌ Do NOT export services, schemas, or internal utils
```

**Rules:**
- Only export what outside callers actually need.
- Internal files (`services/`, `schemas/`, sub-components) are **not** re-exported.
- Outside callers import from the barrel, never from deep paths: `@/modules/auth` ✅, `@/modules/auth/services/auth.service` ❌.

---

## 11. Git Flow + Worktree Strategy

This project follows **Git Flow**. The modular vertical-slice structure maps cleanly onto Git Flow branches, enabling parallel `git worktree` setups with minimal merge conflicts.

### Git Flow Branch Model

```
main          ← production-ready only; tagged on every release
│
develop       ← integration branch; all features merge here first
│
├── feature/auth/google-oauth          ← branched from develop
├── feature/workspace/editor-toolbar   ← branched from develop
├── bugfix/auth/token-refresh-race     ← branched from develop
│
├── release/1.2.0                      ← branched from develop when all planned features have merged
│                                         merged into main AND develop on completion
│
└── hotfix/1.1.1-reset-redirect        ← branched from main
                                          merged into main AND develop on completion
```

**Rules:**
- `main` and `develop` are **protected**. No direct pushes. PR only.
- `feature/*` and `bugfix/*` always branch from `develop` and merge back to `develop`.
- `release/*` branches from `develop`. On completion: merge to `main` (tag it) and back-merge to `develop`.
- `hotfix/*` branches from `main`. On completion: merge to `main` (tag it) and back-merge to `develop`.
- Delete branches after merge.

### Branch Naming Convention

```
feature/<module>/<short-description>
bugfix/<module>/<short-description>
hotfix/<version>-<short-description>
release/<semver>
chore/<scope>/<short-description>
refactor/<module>/<short-description>
```

```bash
# Feature work (branched from develop)
feature/auth/google-oauth
feature/workspace/editor-toolbar
feature/settings/avatar-upload

# Bug fixes on develop (branched from develop)
bugfix/auth/token-refresh-race
bugfix/workspace/editor-scroll-reset

# Production hotfix (branched from main)
hotfix/1.1.1-reset-redirect

# Release preparation (branched from develop)
release/1.2.0

# Infrastructure / tooling (branched from develop)
chore/shared/api-error-handling
chore/components/promote-formfield-to-global
chore/design/sidebar-token
chore/shadcn/upgrade-dialog
```

### Worktree Setup

Worktrees let you check out multiple Git Flow branches simultaneously in separate directories — one per active module or concern. Each worktree always points to a Git Flow-compliant branch.

```bash
# Persistent worktrees for long-running streams
git worktree add ../web-develop    develop
git worktree add ../web-auth       feature/auth/google-oauth
git worktree add ../web-workspace  feature/workspace/editor-toolbar
git worktree add ../web-settings   feature/settings/avatar-upload

# Short-lived worktree for a hotfix (branched from main)
git worktree add ../web-hotfix     hotfix/1.1.1-reset-redirect

# Release stabilisation
git worktree add ../web-release    release/1.2.0
```

```bash
# Remove a worktree after its branch merges
git worktree remove ../web-auth
git branch -d feature/auth/google-oauth
```

### Conflict-Safe Zone Mapping

| Zone | Conflict Risk | Rule |
|---|---|---|
| `src/modules/<module>/` | **Isolated** | One worktree per module; conflicts stay inside the slice |
| `app/page.tsx` files | Low | 1-liner re-exports; rarely touched after initial setup |
| `src/shared/` | Low | Small, infrequent changes; dedicated `chore/shared/*` branch |
| `src/components/` | Medium | Promotions need coordination; dedicated `chore/components/*` branch |
| `app/globals.css` | High | One author at a time; CSS-variable additions only via `chore/design/*` |

### Zero-Conflict Protocol

1. `feature/*` and `bugfix/*` branches **never** touch `src/shared/` or `src/components/`. Any shared change gets its own branch.
2. Promotion of a module component to global → dedicated PR on `chore/components/promote-<ComponentName>`, branched from `develop`.
3. `app/globals.css` changes → `chore/design/<token-name>`, branched from `develop`, one CSS custom property addition per PR.
4. `shadcn/ui` upgrades → `chore/shadcn/upgrade-<component>`, branched from `develop`, never mixed with feature work.
5. Before opening a `release/*` branch, all in-flight `feature/*` worktrees must either be merged to `develop` or explicitly deferred.
6. `hotfix/*` worktrees are spun up from `main`, not from `develop`. After merge, immediately back-merge to `develop` to prevent drift.

---

## 12. LLM Prompt Convention

Every file carries a **machine-readable header comment** on line 1. This enables LLMs to instantly understand context, constraints, and co-located files without needing to traverse the tree.

### File Header Format

```ts
// @module:<module-name> @layer:<layer> @scope:<scope> @deps:<dep1,dep2>
```

| Tag | Values | Description |
|---|---|---|
| `@module` | module name or `shared` or `global` | Which vertical slice owns this file |
| `@layer` | `atom`, `molecule`, `organism`, `template`, `page`, `hook`, `service`, `schema`, `util`, `config` | Atomic / architectural layer |
| `@scope` | `global`, `module:<name>`, `group:<name>` | Visibility scope |
| `@deps` | comma-separated list in `layer:name` format, e.g. `hook:useLoginMutation,organism:LoginForm`. Use `none` if no local deps. | What this file imports from within the project |

### Examples

```ts
// @module:auth @layer:page @scope:module:auth @deps:hook:useLoginMutation,organism:LoginForm
// src/modules/auth/components/LoginPage.tsx
```

```ts
// @module:shared @layer:util @scope:global @deps:none
// src/shared/lib/utils.ts
```

```ts
// @module:auth @layer:service @scope:module:auth @deps:shared:errors
// src/modules/auth/services/auth.service.ts
```

### LLM Prompt Templates

Use these exact prompts when asking an LLM to generate, modify, or review code.

---

#### PROMPT: Create a new module

```
TASK: Create a new vertical slice module.
MODULE: <module-name>
PAGES: <list of page names>
ENTITIES: <list of API resource shapes, e.g. "User: { id, name, email }">
BACKEND ENDPOINTS:
  GET  /api/<resource>
  POST /api/<resource>

CONSTRAINTS:
- Follow src/modules/<module>/ anatomy from structure-architecture.md §5
- Add @module/@layer/@scope/@deps header to every file
- Services use fetch + process.env.NEXT_PUBLIC_API_URL
- Hooks use TanStack Query v5 with queryKeys.ts pattern
- Pages are thin: only call hooks, pass data to organisms through a template (or directly if no layout shell is needed)
- Export public API from index.ts only
- Do NOT import from other modules
- Do NOT put logic in app/page.tsx
```

---

#### PROMPT: Create a component at a specific atomic layer

```
TASK: Create a <atom|molecule|organism|template> component.
NAME: <ComponentName>
SCOPE: <global | module:<name>>
LAYER: <atom|molecule|organism|template>
PROPS: <prop name: type, ...>
BEHAVIOR: <describe what it renders or does>

CONSTRAINTS:
- If scope=global: file goes in src/components/<layer>/<ComponentName>.tsx
- If scope=module: file goes in src/modules/<module>/components/<layer>/<ComponentName>.tsx
- Atoms: no custom component composition, HTML + Tailwind + CVA (class-variance-authority, used to define style variants) only
- Molecules: compose 2–5 atoms, local useState allowed, no server state
- Organisms: compose molecules/atoms, accept all data as props, no fetching
- Templates: compose organisms into named layout slots (aside, main, footer…), no data, no state, layout-only props allowed
- Add @module/@layer/@scope/@deps header on line 1
- Use cn() from @/shared/lib/utils for class merging
- Export as named export
```

---

#### PROMPT: Add a data-fetching hook

```
TASK: Create a TanStack Query hook.
MODULE: <module-name>
HOOK TYPE: <query | mutation | infinite>
RESOURCE: <resource name>
ENDPOINT: <METHOD /api/path>
REQUEST TYPE: <TypeScript shape or "none">
RESPONSE TYPE: <TypeScript shape>

CONSTRAINTS:
- File: src/modules/<module>/hooks/use<Resource><Query|Mutation>.ts
- Service call lives in src/modules/<module>/services/<module>.service.ts
- Query keys follow queryKeys.ts pattern
- Add @module/@layer/@scope/@deps header
- Throw ApiError from @/shared/lib/errors on non-2xx
- The hook returns only the values and callbacks the Page component actually uses
```

---

#### PROMPT: Promote a component to global

```
TASK: Promote a module-scoped component to global shared component.
COMPONENT: <ComponentName>
CURRENT PATH: src/modules/<module>/components/<layer>/<ComponentName>.tsx
TARGET PATH: src/components/<layer>/<ComponentName>.tsx
USED BY MODULES: <module-a>, <module-b>

STEPS:
1. Copy file to target path
2. Update @scope tag from module:<x> to global
3. Update import in both consuming modules to use @/components/<layer>/<ComponentName>
4. Remove from originating module's components folder
5. Add to src/components/<layer>/index.ts barrel
6. Do NOT change component logic or props during promotion
```

---

#### PROMPT: Refactor a module into a module group

```
TASK: Refactor an oversized module into a module group.
MODULE: <module-name>
SUB-MODULES: <sub-a>, <sub-b>, <sub-c>
SHARED INTERNALS: <list of hooks/components shared across sub-modules>

CONSTRAINTS:
- Follow src/modules/<module>/ group structure from structure-architecture.md §6
- Create _core/ for internals shared only within the group
- Each sub-module gets its own index.ts
- Sub-modules import _core via @/modules/<module>/_core
- Sub-modules NEVER import from sibling sub-modules
- Top-level index.ts only re-exports sub-module public APIs
- _core/index.ts is NOT re-exported from top-level index.ts
```

---

#### PROMPT: Review a file for architecture compliance

```
TASK: Review this file for compliance with structure-architecture.md.
FILE: <paste file content>
EXPECTED MODULE: <module name>
EXPECTED LAYER: <layer>

CHECK FOR:
1. File header present with correct @module/@layer/@scope/@deps
2. No cross-module imports (except via @/modules/<module>/index.ts barrel)
3. No business logic in atoms or molecules
4. No API calls outside of services/
5. No hardcoded route strings (use ROUTES from @/shared/constants/routes)
6. Named exports only (no default exports except in app/ pages)
7. Correct file location matches layer and scope
8. index.ts does not export internals (services, schemas)

OUTPUT: List each violation with file:line and the rule it breaks.
```

---

## 13. Naming Conventions Cheatsheet

| What | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `LoginForm.tsx`, `AuthShell.tsx` |
| Hook files | camelCase `use` prefix | `useLoginMutation.ts` |
| Service files | camelCase `.service.ts` | `auth.service.ts` |
| Schema files | camelCase `.schema.ts` | `auth.schema.ts` |
| Type files | camelCase `.types.ts` | `auth.types.ts` |
| Util files | camelCase `.utils.ts` | `auth.utils.ts` |
| Query key files | camelCase | `queryKeys.ts` |
| Barrel files | always named `index.ts` | `index.ts` |
| Component exports | Named only | `export function LoginForm` |
| App page exports | Default only | `export default LoginPage` |
| Zod schemas | `<Entity>Schema` | `LoginSchema` |
| Inferred types | `<Entity>` | `type Login = z.infer<typeof LoginSchema>` |
| Query keys const | `<module>Keys` | `workspaceKeys` |
| CSS custom props | kebab-case | `--color-primary` |
| Route constants | Nested object with `UPPER_CASE` keys; always access via the `ROUTES` constant, never write raw strings | `ROUTES.AUTH.LOGIN` |
| Branch names | `type/module/description` | `feature/auth/google-oauth` |
| Worktree dirs | `../web-<module>` | `../web-workspace` |

---

## 14. Forbidden Patterns

These patterns are **unconditionally banned**. No exceptions without an ADR.

```ts
// ❌ Cross-module import
import { useWorkspaceList } from "@/modules/workspace/hooks/useWorkspaceList";
// inside src/modules/auth/ — BANNED

// ❌ Deep import bypassing barrel
import { loginUser } from "@/modules/auth/services/auth.service";
// from outside the auth module — BANNED

// ❌ Business logic in app/page.tsx
export default function Page() {
  const [data, setData] = useState([]); // BANNED
  useEffect(() => fetch("/api/..."), []); // BANNED
}

// ❌ Relative cross-layer import
import { cn } from "../../shared/lib/utils"; // BANNED — use @/shared/lib/utils

// ❌ State or data fetching inside a template
export function EditorLayout() {
  const { data } = useWorkspace(); // BANNED in template — lift to Page
  return <div>{data.name}</div>;
}

// ❌ Feature logic embedded in layout props
<TwoColumnLayout sidebarOpen={user.preferences.sidebar} /> // BANNED — layout props only, no feature data

// ❌ Hardcoded route string
router.push("/settings/profile"); // BANNED — use ROUTES.SETTINGS.PROFILE

// ❌ Default export from src/ (only allowed in app/)
export default function AuthForm() { ... } // BANNED in src/

// ❌ Importing _core outside its group
import { useWorkspaceContext } from "@/modules/workspace/_core"; // BANNED outside workspace group

// ❌ Hand-editing shadcn ui primitives
// src/components/ui/button.tsx — NEVER modify directly; extend via CVA variants
```

---

## 15. Decision Tree — Where Does This File Go?

```
Is it a Next.js routing file (page, layout, loading, error)?
  └── YES → app/   (thin shell only)
  └── NO ↓

Is it a React component?
  ├── Used by 2+ modules OR is a shadcn primitive?
  │     └── YES → src/components/<atom|molecule|organism|template|ui>/
  └── Used by 1 module only?
        └── YES → src/modules/<module>/components/<atom|molecule|organism|template>/

        Within components, which layer?
          ├── Indivisible HTML wrapper with variants only?     → atom
          ├── Composes 2–5 atoms for a single UI task?         → molecule
          ├── Assembles molecules/atoms into a UI section?     → organism
          ├── Defines a page layout skeleton via named slots?  → template
          └── Fetches data + wires organisms into a template?  → page (module-level only)

Is it data fetching logic?
  ├── Plain async function calling the API?
  │     └── YES → src/modules/<module>/services/<module>.service.ts
  └── React hook wrapping TanStack Query?
        └── YES → src/modules/<module>/hooks/use<Resource>.ts

Is it a Zod schema or inferred type?
  ├── Scoped to one module?
  │     └── YES → src/modules/<module>/schemas/<module>.schema.ts
  └── Generic / shared (ApiResponse, Pagination)?
        └── YES → src/shared/types/api.types.ts

Is it a pure utility function?
  ├── Feature-specific?
  │     └── YES → src/modules/<module>/utils/<module>.utils.ts
  └── Generic (cn, formatDate, etc.)?
        └── YES → src/shared/lib/utils.ts

Is it configuration (QueryClient, env, routes)?
  ├── Provider or client setup (QueryClient, auth context)? → src/shared/config/
  └── Static values (route paths, magic strings)?           → src/shared/constants/
```
