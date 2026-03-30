# Project Architecture — Bisaya AI Rap

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (new-york) · Radix UI · TanStack Query v5 · React Hook Form · Zod · Lucide React · Supabase (Auth · Database · Storage · Realtime) · MSW · pnpm
>
> **Pattern:** Vertical Slice (modular) + Atomic Design · Next.js is **fullstack** — Server Components fetch data directly, Server Actions handle mutations, Route Handlers serve webhooks and third-party callbacks. Supabase is the Backend-as-a-Service (BaaS) layer (Postgres + Auth + Storage + Realtime). There is no separate backend server.
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
7. [App Router — Fullstack Routing Layer](#7-app-router--fullstack-routing-layer)
8. [Data Fetching Contract](#8-data-fetching-contract)
9. [Mock API & Mock Data](#9-mock-api--mock-data)
10. [Shared Layer](#10-shared-layer)
11. [Import & Barrel Rules](#11-import--barrel-rules)
12. [Git Flow + Worktree Strategy](#12-git-flow--worktree-strategy)
13. [LLM Prompt Convention](#13-llm-prompt-convention)
14. [Naming Conventions Cheatsheet](#14-naming-conventions-cheatsheet)
15. [Forbidden Patterns](#15-forbidden-patterns)
16. [Decision Tree — Where Does This File Go?](#16-decision-tree--where-does-this-file-go)

---

## 1. Mental Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│  app/  (Next.js App Router — routing shell + server entry points)       │
│    ├── page.tsx (Server Component) → may fetch, imports ONE Page        │
│    ├── api/  (Route Handlers — webhooks, file uploads, OAuth callbacks) │
│    └── proxy.ts  →  Supabase session refresh on every request           │
├─────────────────────────────────────────────────────────────────────────┤
│  src/modules/  (Vertical Slices — all feature logic)                    │
│    └── <module>/  owns: UI · hooks · services · actions · types         │
│         ├── services/   →  Supabase client calls (browser or server)    │
│         └── actions/    →  Next.js Server Actions (mutations)           │
├─────────────────────────────────────────────────────────────────────────┤
│  src/components/  (Atomic Design — shared presentational)               │
│    atoms / molecules / organisms / templates / ui (shadcn)              │
├─────────────────────────────────────────────────────────────────────────┤
│  src/shared/  (Utilities only — no UI, no business logic)               │
│    lib / hooks / types / constants / config (Supabase clients)          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │   Supabase (BaaS)          │
                      │   Auth · Postgres · RLS    │
                      │   (Row Level Security)      │
                      │   Storage · Realtime       │
                      └────────────────────────────┘
```

**The one-way dependency rule:**

```
app  →  modules  →  components  →  shared
                 ↘  shared
         (never in reverse — shared never imports from components, modules, or app)
```

**Server vs. Client boundary:**

```
Server Components / Server Actions / Route Handlers
  └── use createServerClient() from @/shared/config/supabase.server
  └── may call service functions directly (no network hop)

Client Components / TanStack Query hooks
  └── use createSupabaseBrowserClient() from @/shared/config/supabase.browser
  └── call service functions that use the browser Supabase client
```

Modules **never import from other modules** directly. Anything used by more than one module is moved up to `src/shared/` (utilities) or `src/components/` (UI).

---

## 2. Full Directory Tree

```
bisaya-ai-rap/
├── proxy.ts                              # Supabase session refresh — runs on every request
│
├── app/                                  # Next.js App Router (routing + server entry points)
│   ├── layout.tsx                        # Root layout — providers only
│   ├── page.tsx                          # → modules/home/components/HomePage
│   ├── (auth)/
│   │   ├── layout.tsx                    # Auth shell layout
│   │   ├── login/page.tsx                # → modules/auth/components/LoginPage
│   │   ├── signup/page.tsx               # → modules/auth/components/SignupPage
│   │   ├── forgot/page.tsx               # → modules/auth/components/ForgotPage
│   │   ├── reset/page.tsx                # → modules/auth/components/ResetPage
│   │   └── callback/route.ts             # Supabase OAuth callback Route Handler
│   ├── settings/
│   │   ├── layout.tsx                    # Settings shell layout
│   │   ├── profile/page.tsx              # → modules/settings/components/ProfilePage
│   │   └── account/page.tsx              # → modules/settings/components/AccountPage
│   ├── workspaces/
│   │   ├── layout.tsx                    # Workspace shell layout
│   │   ├── page.tsx                      # → modules/workspace/components/WorkspacesPage
│   │   └── editor/page.tsx               # → modules/workspace/components/EditorPage
│   └── api/                              # Route Handlers (webhooks, file uploads, etc.)
│       └── webhooks/
│           └── stripe/route.ts           # Example: Stripe webhook handler
│
├── src/
│   ├── modules/                          # Vertical slices — ALL feature logic
│   │   ├── auth/
│   │   │   ├── actions/                  # Server Actions (login, signup, logout)
│   │   │   └── mocks/                    # Auth mock handlers + fixtures (dev only)
│   │   ├── settings/
│   │   │   ├── actions/
│   │   │   └── mocks/
│   │   └── workspace/                    # May be a module GROUP (see §6)
│   │       ├── actions/
│   │       └── mocks/
│   │
│   ├── components/                       # Shared atomic design (presentational only)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   └── ui/                           # shadcn/ui primitives (do not hand-edit)
│   │
│   └── shared/                           # Zero-feature layer
│       ├── lib/
│       │   ├── utils.ts
│       │   └── errors.ts                 # AppError class
│       ├── hooks/
│       ├── types/
│       │   └── api.types.ts              # Generic shared types (Pagination, etc.)
│       ├── constants/
│       │   └── routes.ts                 # ROUTES object — all app paths
│       ├── config/
│       │   ├── supabase.browser.ts       # Browser Supabase client (createBrowserClient)
│       │   ├── supabase.server.ts        # Server Supabase client (createServerClient)
│       │   └── QueryProvider.tsx         # TanStack Query client + provider
│       └── mocks/                        # MSW setup — aggregates all module handlers
│           ├── index.ts                  # Exports startMocking()
│           ├── browser.ts                # MSW browser worker
│           └── server.ts                 # MSW Node server (tests, CI)
│
├── supabase/                             # Supabase local dev config
│   ├── config.toml                       # Local Supabase project config
│   └── migrations/                       # Database migration files
│
├── public/
├── components.json                       # shadcn/ui config
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Layer Rules

### `proxy.ts` — Session Refresh

`proxy.ts` lives at the **project root** (alongside `app/`). It intercepts every request to refresh the Supabase session cookie before the page renders. **No business logic lives here.**

> **Next.js 16:** `middleware.ts` is deprecated and renamed to `proxy.ts`. The exported function also changes from `middleware` to `proxy`. Run the official codemod to migrate: `npx @next/codemod@latest middleware-to-proxy`. `proxy.ts` runs on the **Node.js runtime** (not Edge), which allows full access to Node APIs and is required by `@supabase/ssr`.

```ts
// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — do not remove this line
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### `app/` — Routing Shell

- Contains **only** Next.js routing files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts` (Route Handlers).
- A `page.tsx` file has **one job**: re-export a Page component from its module. It may be a Server Component if the Page itself is a Server Component.
- Route Handlers (`route.ts`) live in `app/api/` and handle webhooks, OAuth callbacks, and file upload endpoints.
- **No business logic, no hooks, no inline data fetching.**
- Maximum 10 lines per `page.tsx`.

```tsx
// ✅ app/workspaces/editor/page.tsx
import { EditorPage } from "@/modules/workspace";
export { metadata } from "@/modules/workspace/meta";
export default EditorPage;
```

### `src/modules/` — Feature Slices

- One directory per feature area (e.g., `auth`, `workspace`, `settings`).
- Owns everything needed to deliver that feature: components, hooks, services, actions, types, schemas, utils.
- **Never imports from a sibling module.**
- Exposes a public API through its `index.ts` barrel — the only file outside callers may import from.
- See §5 for the full module anatomy, including the distinction between `services/` (Supabase client calls) and `actions/` (Server Actions).

### `src/components/` — Shared Atomic UI

- Purely presentational. Zero business logic.
- No TanStack Query calls. No Supabase calls.
- Accepts only props. Emits only callbacks.
- Sub-folders: `atoms/` `molecules/` `organisms/` `templates/` `ui/`.

### `src/shared/` — Pure Utilities

- Zero React components (except `QueryProvider.tsx` which is infrastructure, not a feature).
- No imports from `modules/` or `components/`.
- Functions, types, constants, and configuration only.
- Supabase client factories live here so every layer can import them.

### `<module>/actions/` — Server Actions

- Files use the `"use server"` directive at the top.
- Called directly from Server Components or passed as `action` props to Client Components.
- Use the **server** Supabase client (never the browser client).
- Return plain objects (not `Response`). Use Zod to validate inputs before any database call.

### `<module>/mocks/` — Dev-Only Mock Layer

- Exists only in development. **Never imported by production code** (services, hooks, components, actions).
- Two files per module: `<module>.handlers.ts` (MSW request interceptors) and `<module>.fixtures.ts` (typed static data).
- Handlers intercept Supabase REST calls at the network level.
- Registered globally through `src/shared/mocks/index.ts`. Individual modules never start MSW themselves.

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
- **No** data fetched from Supabase. **No** async logic.
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
export function TwoColumnLayout({ aside, main, footer }: TwoColumnLayoutProps) {
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

> Composes organisms **through a template**. Owns data fetching via module hooks (Client Component) or direct service calls (Server Component).

- Lives in `src/modules/<module>/components/<Feature>Page.tsx`.
- **Server Component (preferred for read-heavy pages):** calls service functions directly, passes data as props to organisms.
- **Client Component:** calls module hooks (e.g., `useLoginMutation`, `useWorkspaceList`), passes data down to organisms as props.
- **This is the only component layer that touches server state.**

```tsx
// src/modules/auth/components/LoginPage.tsx — Client Component
// @layer: page | @scope: module:auth
"use client";
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

```tsx
// src/modules/workspace/components/WorkspacesPage.tsx — Server Component
// @layer: page | @scope: module:workspace
import { listWorkspaces } from "../services/workspace.service";

export async function WorkspacesPage() {
  const workspaces = await listWorkspaces(); // direct service call — no network hop
  return <DashboardLayout main={<WorkspaceList workspaces={workspaces} />} />;
}
```

### Promotion Rule

> A component starts in a module. It moves up when needed by more than one consumer.

| Used by          | Lives in                                   |
| ---------------- | ------------------------------------------ |
| 1 module only    | `src/modules/<module>/components/<layer>/` |
| 2+ modules       | `src/components/<layer>/`                  |
| shadcn primitive | `src/components/ui/` (never hand-edit)     |

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
├── hooks/                    # React hooks (client-side business logic + TanStack Query)
│   ├── use<Feature>.ts           # Read hooks — useQuery / useInfiniteQuery
│   ├── use<Feature>Mutation.ts   # Write hooks — useMutation
│   └── queryKeys.ts              # Typed query key factory for this module
│
├── actions/                  # Next.js Server Actions ("use server")
│   └── <module>.actions.ts   # Mutation functions called from Server Components or forms
│
├── services/                 # Supabase client functions (plain async — no React)
│   └── <module>.service.ts   # Returns plain data; called by hooks, actions, or Server Components
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
├── mocks/                    # Dev-only: MSW handlers and fixture data (never imported in production code)
│   ├── <module>.handlers.ts  # MSW request handlers — intercept Supabase REST calls
│   └── <module>.fixtures.ts  # Typed static mock data referenced by handlers
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
├── actions/
│   └── auth.actions.ts
├── services/
│   └── auth.service.ts
├── schemas/
│   └── auth.schema.ts
├── types/
│   └── auth.types.ts
├── utils/
│   └── auth.utils.ts
├── mocks/
│   ├── auth.handlers.ts
│   └── auth.fixtures.ts
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
│   ├── mocks/                   # Shared fixtures/handlers for the group's shared types
│   │   ├── workspace.fixtures.ts
│   │   └── workspace.handlers.ts
│   └── index.ts                 # Private to the group
│
├── editor/                      # Sub-module
│   ├── index.ts
│   ├── components/
│   ├── hooks/
│   ├── actions/
│   ├── services/
│   ├── schemas/
│   ├── mocks/
│   └── meta.ts
│
├── canvas/                      # Sub-module
│   ├── index.ts
│   ├── mocks/
│   └── ...
│
└── dashboard/                   # Sub-module
    ├── index.ts
    ├── mocks/
    └── ...
```

### Group Rules

- Sub-modules import from `_core/` using the group-relative alias: `@/modules/workspace/_core`.
- Sub-modules **never import from sibling sub-modules** directly.
- `_core/` is private to the group — it is **not** re-exported from the top-level `index.ts`.
- The group's `index.ts` only re-exports the sub-modules' public APIs.
- If `_core/` grows beyond 5 hooks or 8 components, extract the truly shared pieces to `src/shared/` or `src/components/`.

---

## 7. App Router — Fullstack Routing Layer

`proxy.ts` (project root) and `app/` together form the server entry points. `app/` contains file-system routing conventions and Route Handlers; `proxy.ts` intercepts every request before routing (see §3).

### layout.tsx — Providers Only

```tsx
// app/layout.tsx — Root layout
import { QueryProvider } from "@/shared/config/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fonts} antialiased dark`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

MSW mocking (dev only) — start the worker before anything renders:

```tsx
// app/layout.tsx — add before the return statement, dev only
if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  const { startMocking } = await import("@/shared/mocks");
  await startMocking();
}
```

### page.tsx — One Re-export

```tsx
// app/(auth)/login/page.tsx
import { LoginPage } from "@/modules/auth";
export { metadata } from "@/modules/auth/meta";
export default LoginPage;
```

### Route Handlers (`route.ts`) — Webhooks & OAuth Callbacks

Route Handlers live in `app/api/` or co-located with auth routes. They handle only external integrations — never business logic that belongs in a module service.

```ts
// app/(auth)/callback/route.ts — Supabase OAuth code exchange
import { createServerClient } from "@/shared/config/supabase.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/workspaces`);
}
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

These live in `app/` but delegate to module-level components. Import through the module's public barrel:

```tsx
// app/workspaces/loading.tsx
export { WorkspaceSkeleton as default } from "@/modules/workspace";
```

---

## 8. Data Fetching Contract

> Next.js is **fullstack**. Data comes from Supabase via two clients: a **browser client** (Client Components) and a **server client** (Server Components, Server Actions, Route Handlers).

### Supabase Client Setup

```ts
// src/shared/config/supabase.browser.ts
// @module:shared @layer:config @scope:global @deps:none
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/shared/types/database.types";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

```ts
// src/shared/config/supabase.server.ts
// @module:shared @layer:config @scope:global @deps:none
import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/shared/types/database.types";

export async function createServerClient() {
  const cookieStore = await cookies();
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );
}
```

> **Database types** (`src/shared/types/database.types.ts`) are generated from your Supabase schema — see §9 Local Supabase Development for the full setup and generation command. Never hand-edit this file.

### Service Layer

Service functions are **plain async functions** — no React, no hooks. They call the Supabase client and return typed data. They can be called from Server Components, Server Actions, or TanStack Query hooks.

```ts
// src/modules/workspace/services/workspace.service.ts
// @module:workspace @layer:service @scope:module:workspace @deps:shared:supabase.server,shared:errors

import { createServerClient } from "@/shared/config/supabase.server";
import { AppError } from "@/shared/lib/errors";
import type { Workspace } from "../types/workspace.types";

// Called by Server Components and Server Actions (server Supabase client)
export async function listWorkspaces(): Promise<Workspace[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new AppError(error.message, error.code);
  return data;
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new AppError(error.message, error.code);
  return data;
}
```

For **client-side** service functions (called from TanStack Query hooks), use the browser client. Follow this naming rule: **server-only functions use the plain name** (`listWorkspaces`); **client variants are suffixed with `Client`** (`listWorkspacesClient`, `createWorkspaceClient`). Keep both variants in the same service file.

```ts
// Variants called by TanStack Query hooks — use the browser client
import { createSupabaseBrowserClient } from "@/shared/config/supabase.browser";

export async function listWorkspacesClient(): Promise<Workspace[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new AppError(error.message, error.code);
  return data;
}

export async function createWorkspaceClient(
  input: CreateWorkspace,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("workspaces").insert(input);
  if (error) throw new AppError(error.message, error.code);
}
```

### Server Actions

Server Actions handle mutations triggered from Server Components or Client Component forms. They run on the server and use the server Supabase client.

```ts
// src/modules/workspace/actions/workspace.actions.ts
// @module:workspace @layer:action @scope:module:workspace @deps:service:workspace.service,schema:workspace.schema
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/config/supabase.server";
import { CreateWorkspaceSchema } from "../schemas/workspace.schema";
import { ROUTES } from "@/shared/constants/routes";
import { AppError } from "@/shared/lib/errors";

export async function createWorkspaceAction(formData: FormData) {
  const parsed = CreateWorkspaceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.from("workspaces").insert(parsed.data);

  if (error) return { error: { _root: [error.message] } };

  revalidatePath(ROUTES.WORKSPACES.LIST);
  redirect(ROUTES.WORKSPACES.LIST);
}
```

### Hook Layer (TanStack Query — Client Components)

TanStack Query hooks live in the module's `hooks/` folder and are used only in Client Components. They call the client-side service variant.

```ts
// src/modules/workspace/hooks/useWorkspaceList.ts
// @module:workspace @layer:hook @scope:module:workspace @deps:service:workspace.service,queryKeys

import { useQuery } from "@tanstack/react-query";
import { listWorkspacesClient } from "../services/workspace.service";
import { workspaceKeys } from "./queryKeys";

export function useWorkspaceList() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: listWorkspacesClient,
  });
}
```

```ts
// src/modules/workspace/hooks/useCreateWorkspaceMutation.ts
// @module:workspace @layer:hook @scope:module:workspace @deps:service:workspace.service,queryKeys

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceClient } from "../services/workspace.service";
import { workspaceKeys } from "./queryKeys";
import type { CreateWorkspace } from "../schemas/workspace.schema";

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspace) => createWorkspaceClient(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() }),
  });
}
```

### Auth Service

Auth uses Supabase Auth — no custom JWT handling.

```ts
// src/modules/auth/services/auth.service.ts
// @module:auth @layer:service @scope:module:auth @deps:shared:supabase.browser,shared:errors

import { createSupabaseBrowserClient } from "@/shared/config/supabase.browser";
import { AppError } from "@/shared/lib/errors";
import type { LoginRequest, SignupRequest } from "../schemas/auth.schema";

export async function loginWithEmail({ email, password }: LoginRequest) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new AppError(error.message, error.status?.toString());
  return data;
}

export async function signupWithEmail({ email, password }: SignupRequest) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new AppError(error.message, error.status?.toString());
  return data;
}

export async function logout() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new AppError(error.message, error.status?.toString());
}

export async function getSession() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new AppError(error.message, error.status?.toString());
  return data.session;
}
```

Server-side session retrieval (for Server Components and `proxy.ts`):

```ts
// src/modules/auth/services/auth.server.service.ts
// @module:auth @layer:service @scope:module:auth @deps:shared:supabase.server,shared:errors

import { createServerClient } from "@/shared/config/supabase.server";

export async function getServerUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
```

### When to Use Server Components vs. TanStack Query

| Situation                                          | Approach                                          |
| -------------------------------------------------- | ------------------------------------------------- |
| Initial page data load, SEO matters                | Server Component → direct service call            |
| Data that changes based on user interaction        | Client Component → TanStack Query hook            |
| Data that benefits from optimistic updates         | Client Component → TanStack Query `useMutation`   |
| Form submission / mutation from a Server Component | Server Action                                     |
| Form submission with live validation feedback      | Client Component + TanStack Query `useMutation`   |
| Realtime subscriptions (Supabase Realtime)         | Client Component → `useEffect` + Supabase channel |
| Webhook / external callback                        | Route Handler (`app/api/`)                        |

### Query Key Convention

```ts
// Always structured as an array tuple:
["<module>", "<resource>"][("<module>", "<resource>", id)][ // list // single
  ("<module>", "<resource>", filters)
]; // filtered list
```

```ts
// Examples
["auth", "session"][("workspace", "list")][
  ("workspace", "detail", workspaceId)
];
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

## 9. Mock API & Mock Data

> **Tool: MSW (Mock Service Worker)** — intercepts `fetch` calls at the network level in both browser and Node environments. Because the Supabase JS client uses `fetch` under the hood to call the Supabase REST and Auth APIs, MSW can intercept those calls without any changes to service functions, hooks, or components.
>
> **Local Supabase (preferred for full-stack dev):** Run `pnpm supabase start` to spin up a local Supabase instance (Postgres, Auth, Storage) with no cloud dependency. MSW is complementary — use it for UI-only development when the local DB is not needed.
>
> **Install (dev dependency only):** `pnpm add -D msw`

### How It Works

```
Browser                     MSW Service Worker          Supabase (cloud or local)
  │                               │                           │
  │── fetch POST /auth/v1/token ▶ │                           │
  │                               │  handler matched          │
  │◀── mock response ─────────── │                           │
  │                                                           │
  │  (when NEXT_PUBLIC_API_MOCKING is not "enabled")          │
  │── fetch POST /auth/v1/token ──────────────────────────▶  │
  │◀── real response ─────────────────────────────────────── │
```

### Enabling Mocks

Set in `.env.local` (never in `.env.production`):

```bash
NEXT_PUBLIC_API_MOCKING=enabled
```

Start the MSW worker before anything renders by adding this to `app/layout.tsx`:

```tsx
// app/layout.tsx — inside RootLayout, before the return statement
if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  const { startMocking } = await import("@/shared/mocks");
  await startMocking();
}
```

Because `NEXT_PUBLIC_API_MOCKING` is never set in production, Next.js tree-shakes the entire mock import out of the production bundle.

### Local Supabase Development

For full-stack local development without the cloud:

```bash
# Start local Supabase stack
pnpm supabase start

# Local URLs are printed on start:
# API URL:   http://127.0.0.1:54321
# Studio:    http://127.0.0.1:54323
# Inbucket:  http://127.0.0.1:54324 (email testing)

# Apply migrations
pnpm supabase db reset

# Generate TypeScript types from local schema
pnpm supabase gen types typescript --local > src/shared/types/database.types.ts
```

Use `.env.local` to point at the local instance:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>  # printed by supabase start
```

### Directory Layout

```
src/
├── modules/
│   └── <module>/
│       └── mocks/                           # Dev-only — never imported in production code
│           ├── <module>.handlers.ts         # MSW handlers — intercept Supabase REST/Auth calls
│           └── <module>.fixtures.ts         # Typed static data referenced by handlers
│
└── shared/
    └── mocks/
        ├── index.ts                         # Exports startMocking() — the only thing app/ imports
        ├── browser.ts                       # MSW browser worker: aggregates all module handlers
        └── server.ts                        # MSW Node server: used in tests and CI
```

### Fixtures — `<module>.fixtures.ts`

Fixtures are plain typed objects that match the module's TypeScript types exactly. Handlers reference fixtures — they never inline their own data.

```ts
// src/modules/auth/mocks/auth.fixtures.ts
// @module:auth @layer:mock @scope:module:auth @deps:type:auth.types

import type { AuthUser } from "../types/auth.types";

export const mockAuthUser: AuthUser = {
  id: "user-001",
  email: "dev@bisaya.ai",
  displayName: "Dev User",
  avatarUrl: null,
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: {
    id: "user-001",
    email: "dev@bisaya.ai",
    role: "authenticated",
    aud: "authenticated",
  },
};
```

**Rules:**

- All fields must be present and match the TypeScript type exactly. No `as any`, no `Partial<T>`.
- Use stable, predictable values — no `Math.random()`, no `Date.now()`. Randomness makes debugging harder.
- Prefix every exported name with `mock` so fixtures are immediately identifiable wherever they're imported.
- One fixtures file per module. If a module group's `_core/` defines shared types, shared fixtures live in `_core/mocks/`.

### Handlers — `<module>.handlers.ts`

Handlers tell MSW which Supabase URL to intercept and what to return. They must match the Supabase REST/Auth API shape exactly.

```ts
// src/modules/auth/mocks/auth.handlers.ts
// @module:auth @layer:mock @scope:module:auth @deps:fixture:auth.fixtures

import { http, HttpResponse } from "msw";
import { mockSession, mockAuthUser } from "./auth.fixtures";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";

export const authHandlers = [
  // Supabase Auth: sign in with password
  http.post(`${SUPABASE_URL}/auth/v1/token`, () =>
    HttpResponse.json(mockSession, { status: 200 }),
  ),

  // Supabase Auth: sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, () =>
    HttpResponse.json({}, { status: 204 }),
  ),

  // Supabase Auth: get user
  http.get(`${SUPABASE_URL}/auth/v1/user`, () =>
    HttpResponse.json(mockAuthUser, { status: 200 }),
  ),
];
```

```ts
// src/modules/workspace/mocks/workspace.handlers.ts
// @module:workspace @layer:mock @scope:module:workspace @deps:fixture:workspace.fixtures

import { http, HttpResponse } from "msw";
import { mockWorkspaceList } from "./workspace.fixtures";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";

export const workspaceHandlers = [
  // Supabase REST: list workspaces
  http.get(`${SUPABASE_URL}/rest/v1/workspaces`, () =>
    HttpResponse.json(mockWorkspaceList, { status: 200 }),
  ),
];
```

**Rules:**

- Handler URLs must match the Supabase REST (`/rest/v1/<table>`) or Auth (`/auth/v1/<endpoint>`) paths that the service functions produce.
- Every service function that makes a Supabase call must have a corresponding handler so the app is fully usable with `NEXT_PUBLIC_API_MOCKING=enabled`.
- Status codes must match Supabase's real API contract.
- To simulate an error: `HttpResponse.json({ message: "Invalid credentials" }, { status: 400 })`.

### Shared MSW Setup

```ts
// src/shared/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "@/modules/auth/mocks/auth.handlers";
import { workspaceHandlers } from "@/modules/workspace/mocks/workspace.handlers";

export const worker = setupWorker(...authHandlers, ...workspaceHandlers);
```

```ts
// src/shared/mocks/server.ts — Node environment only (tests, CI)
import { setupServer } from "msw/node";
import { authHandlers } from "@/modules/auth/mocks/auth.handlers";
import { workspaceHandlers } from "@/modules/workspace/mocks/workspace.handlers";

export const server = setupServer(...authHandlers, ...workspaceHandlers);
```

```ts
// src/shared/mocks/index.ts
// app/layout.tsx imports ONLY this file — never browser.ts or server.ts directly

export async function startMocking() {
  if (typeof window === "undefined") return; // never run in SSR or Node context
  const { worker } = await import("./browser");
  await worker.start({ onUnhandledRequest: "warn" });
}
```

### Adding a New Module

When creating a new module, add its handler import to both `browser.ts` and `server.ts`. That is the only change needed outside the new module's own folder.

### Simulating Error States

Override a single handler temporarily without modifying the global setup:

```ts
// In a test file, or mounted via a dev-tools panel:
import { server } from "@/shared/mocks/server";
import { http, HttpResponse } from "msw";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

server.use(
  http.post(`${SUPABASE_URL}/auth/v1/token`, () =>
    HttpResponse.json(
      { message: "Invalid login credentials" },
      { status: 400 },
    ),
  ),
);
// server.use() overrides are automatically reset after each test.
```

---

## 10. Shared Layer

`src/shared/` has no business logic and no UI components. It never imports from `modules/` or `components/` — it sits at the bottom of the dependency chain so every other layer can safely import from it.

```
src/shared/
├── lib/
│   ├── utils.ts              # cn(), formatDate(), etc.
│   └── errors.ts             # AppError class
├── hooks/
│   ├── useDebounce.ts        # Generic UI hooks
│   └── useLocalStorage.ts
├── types/
│   ├── api.types.ts          # Generic types (Pagination, etc.)
│   └── database.types.ts     # Generated Supabase schema types (do not hand-edit)
├── constants/
│   └── routes.ts             # ROUTES object — all app paths
└── config/
    ├── supabase.browser.ts   # Browser Supabase client factory
    ├── supabase.server.ts    # Server Supabase client factory (async, reads cookies)
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
    CALLBACK: "/callback",
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

### AppError Class

```ts
// src/shared/lib/errors.ts
// @module:shared @layer:util @scope:global @deps:none

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

---

## 11. Import & Barrel Rules

### Path Alias

The alias `@/*` resolves to `src/*` (from `tsconfig.json`).

```ts
// ✅ Importing a global shared component (from anywhere)
import { Button } from "@/components/atoms/Button";
import { cn } from "@/shared/lib/utils";

// ✅ Importing from a module — always use the barrel (from outside the module)
import { LoginPage } from "@/modules/auth";

// ✅ Importing within the same module — use relative paths, not the barrel
// Using the barrel from inside the same module creates a circular import.
// (e.g., inside src/modules/auth/components/LoginPage.tsx)
import { useLoginMutation } from "../hooks/useLoginMutation";

// ✅ Importing Supabase clients
import { createSupabaseBrowserClient } from "@/shared/config/supabase.browser";
import { createServerClient } from "@/shared/config/supabase.server";

// ❌ Never use relative paths that cross layer boundaries
import { cn } from "../../shared/lib/utils"; // BANNED — use @/shared/lib/utils

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

// ❌ Do NOT export services, actions, schemas, or internal utils
```

**Rules:**

- Only export what outside callers actually need.
- Internal files (`services/`, `actions/`, `schemas/`, sub-components) are **not** re-exported.
- Outside callers import from the barrel, never from deep paths: `@/modules/auth` ✅, `@/modules/auth/services/auth.service` ❌.

---

## 12. Git Flow + Worktree Strategy

```
main  ←──────────────── hotfix/*
  │
develop ←──────────────── release/*
  │
  ├── feature/<module>/<description>
  ├── bugfix/<module>/<description>
  └── chore/<scope>/<description>
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

# Bug fixes on develop
bugfix/auth/session-refresh-loop
bugfix/workspace/editor-scroll-reset

# Production hotfix (branched from main)
hotfix/1.1.1-reset-redirect

# Release preparation
release/1.2.0

# Infrastructure / tooling
chore/shared/supabase-types-regen
chore/components/promote-formfield-to-global
chore/design/sidebar-token
chore/shadcn/upgrade-dialog
chore/db/add-workspaces-rls
```

### Worktree Setup

```bash
# Persistent worktrees for long-running streams
git worktree add ../bisaya-develop    develop
git worktree add ../bisaya-auth       feature/auth/google-oauth
git worktree add ../bisaya-workspace  feature/workspace/editor-toolbar
git worktree add ../bisaya-settings   feature/settings/avatar-upload

# Short-lived worktree for a hotfix
git worktree add ../bisaya-hotfix     hotfix/1.1.1-reset-redirect

# Remove a worktree after its branch merges
git worktree remove ../bisaya-auth
git branch -d feature/auth/google-oauth
```

### Conflict-Safe Zone Mapping

| Zone                                 | Conflict Risk | Rule                                                                        |
| ------------------------------------ | ------------- | --------------------------------------------------------------------------- |
| `src/modules/<module>/`              | **Isolated**  | One worktree per module; conflicts stay inside the slice                    |
| `app/page.tsx` files                 | Low           | 1-liner re-exports; rarely touched after initial setup                      |
| `src/shared/`                        | Low           | Small, infrequent changes; dedicated `chore/shared/*` branch                |
| `src/components/`                    | Medium        | Promotions need coordination; dedicated `chore/components/*` branch         |
| `supabase/migrations/`               | Medium        | One migration per branch; never merge two migration branches simultaneously |
| `app/globals.css`                    | High          | One author at a time; CSS-variable additions only via `chore/design/*`      |
| `src/shared/types/database.types.ts` | High          | Regenerated file; always regenerate from `main` after migration merges      |

### Zero-Conflict Protocol

1. `feature/*` and `bugfix/*` branches **never** touch `src/shared/` or `src/components/`. Any shared change gets its own branch.
2. Promotion of a module component to global → dedicated PR on `chore/components/promote-<ComponentName>`, branched from `develop`.
3. `app/globals.css` changes → `chore/design/<token-name>`, branched from `develop`, one CSS custom property addition per PR.
4. Database migrations → `chore/db/<migration-description>`, branched from `develop`. After merge, regenerate `database.types.ts` on `develop` immediately.
5. `shadcn/ui` upgrades → `chore/shadcn/upgrade-<component>`, branched from `develop`, never mixed with feature work.
6. Before opening a `release/*` branch, all in-flight `feature/*` worktrees must either be merged to `develop` or explicitly deferred.
7. `hotfix/*` worktrees are spun up from `main`, not from `develop`. After merge, immediately back-merge to `develop` to prevent drift.

---

## 13. LLM Prompt Convention

Every file carries a **machine-readable header comment** on line 1. This enables LLMs to instantly understand context, constraints, and co-located files without needing to traverse the tree.

### File Header Format

```ts
// @module:<module-name> @layer:<layer> @scope:<scope> @deps:<dep1,dep2>
```

| Tag       | Values                                                                                                                     | Description                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `@module` | module name or `shared` or `global`                                                                                        | Which vertical slice owns this file            |
| `@layer`  | `atom`, `molecule`, `organism`, `template`, `page`, `hook`, `service`, `action`, `schema`, `util`, `config`, `mock`        | Atomic / architectural layer                   |
| `@scope`  | `global`, `module:<n>`, `group:<n>`                                                                                        | Visibility scope                               |
| `@deps`   | comma-separated list in `layer:name` format, e.g. `hook:useLoginMutation,organism:LoginForm`. Use `none` if no local deps. | What this file imports from within the project |

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
// @module:auth @layer:service @scope:module:auth @deps:shared:supabase.browser,shared:errors
// src/modules/auth/services/auth.service.ts
```

```ts
// @module:workspace @layer:action @scope:module:workspace @deps:shared:supabase.server,schema:workspace.schema
// src/modules/workspace/actions/workspace.actions.ts
```

### LLM Prompt Templates

Use these exact prompts when asking an LLM to generate, modify, or review code.

---

#### PROMPT: Create a new module

```
TASK: Create a new vertical slice module.
MODULE: <module-name>
PAGES: <list of page names, and whether each is a Server Component or Client Component>
ENTITIES: <list of DB table shapes, e.g. "Workspace: { id, name, user_id, created_at }">
SUPABASE OPERATIONS:
  SELECT from <table> where <condition>
  INSERT into <table>
  UPDATE <table>

CONSTRAINTS:
- Follow src/modules/<module>/ anatomy from structure-architecture.md §5
- Add @module/@layer/@scope/@deps header to every file
- Services use the Supabase client:
    - Browser client (createSupabaseBrowserClient) for TanStack Query hooks
    - Server client (createServerClient) for Server Components and Server Actions
- Hooks use TanStack Query v5 with queryKeys.ts pattern (Client Components only)
- Server Actions go in actions/<module>.actions.ts with "use server" directive
- Server Component pages call service functions directly — no TanStack Query
- Pages are thin: only call hooks/actions, pass data to organisms through a template
- Export public API from index.ts only (no services, no actions, no schemas)
- Do NOT import from other modules
- Do NOT put logic in app/page.tsx
- Throw AppError from @/shared/lib/errors on Supabase errors
```

---

#### PROMPT: Create a component at a specific atomic layer

```
TASK: Create a <atom|molecule|organism|template> component.
NAME: <ComponentName>
SCOPE: <global | module:<n>>
LAYER: <atom|molecule|organism|template>
PROPS: <prop name: type, ...>
BEHAVIOR: <describe what it renders or does>

CONSTRAINTS:
- If scope=global: file goes in src/components/<layer>/<ComponentName>.tsx
- If scope=module: file goes in src/modules/<module>/components/<layer>/<ComponentName>.tsx
- Atoms: no custom component composition, HTML + Tailwind + CVA only
- Molecules: compose 2–5 atoms, local useState allowed, no server state
- Organisms: compose molecules/atoms, accept all data as props, no fetching
- Templates: compose organisms into named layout slots (aside, main, footer…), no data, no state, layout-only props allowed
- Add @module/@layer/@scope/@deps header on line 1
- Use cn() from @/shared/lib/utils for class merging
- Export as named export
- Add "use client" directive only if the component uses hooks, browser APIs, or event handlers
```

---

#### PROMPT: Add a data-fetching hook (Client Component / TanStack Query)

```
TASK: Create a TanStack Query hook.
MODULE: <module-name>
HOOK TYPE: <query | mutation | infinite>
RESOURCE: <Supabase table name>
SUPABASE OPERATION: <SELECT / INSERT / UPDATE / DELETE and conditions>
REQUEST TYPE: <TypeScript shape or "none">
RESPONSE TYPE: <TypeScript shape>

CONSTRAINTS:
- File: src/modules/<module>/hooks/use<Resource><Query|Mutation>.ts
- Service call lives in src/modules/<module>/services/<module>.service.ts
  - Use createSupabaseBrowserClient() from @/shared/config/supabase.browser
- Query keys follow queryKeys.ts pattern
- Add @module/@layer/@scope/@deps header
- Throw AppError from @/shared/lib/errors on Supabase errors
- The hook returns only the values and callbacks the Page component actually uses
```

---

#### PROMPT: Create a Server Action

```
TASK: Create a Next.js Server Action.
MODULE: <module-name>
ACTION: <what the action does>
SUPABASE OPERATION: <INSERT / UPDATE / DELETE and table>
INPUT SCHEMA: <Zod schema name or field list>

CONSTRAINTS:
- File: src/modules/<module>/actions/<module>.actions.ts
- Add "use server" directive at the top of the file
- Validate all inputs with Zod before any Supabase call
- Use createServerClient() from @/shared/config/supabase.server
- Return { error } on validation or Supabase failure — never throw from an action called by a form
- Call revalidatePath() after successful mutations
- Call redirect() only after revalidatePath()
- Add @module/@layer/@scope/@deps header on line 1
- Do NOT use the browser Supabase client inside a Server Action
```

---

#### PROMPT: Generate mock handlers and fixtures for a module

```
TASK: Create MSW mock handlers and fixtures for an existing module.
MODULE: <module-name>
SUPABASE CALLS:
  <METHOD> <SUPABASE_URL>/rest/v1/<table>  →  <ResponseTypeName>
  <METHOD> <SUPABASE_URL>/auth/v1/<endpoint>  →  <ResponseTypeName>

CONSTRAINTS:
- Fixtures file: src/modules/<module>/mocks/<module>.fixtures.ts
  - Export one const per response type, prefixed with "mock" (e.g. mockWorkspace)
  - All fields present and typed — no Partial<T>, no as any
  - Use stable values: no Math.random(), no Date.now()
  - Add @module/@layer:mock/@scope/@deps header on line 1
- Handlers file: src/modules/<module>/mocks/<module>.handlers.ts
  - Export const <module>Handlers: array of http.* calls
  - Handler URLs must use NEXT_PUBLIC_SUPABASE_URL as base
  - Match Supabase REST paths (/rest/v1/<table>) or Auth paths (/auth/v1/<endpoint>)
  - Import all response data from the fixtures file — never inline data
  - Status codes must match Supabase's real API contract
  - Add @module/@layer:mock/@scope/@deps header on line 1
- After creating both files, add the handler import to:
    src/shared/mocks/browser.ts  (spread into setupWorker)
    src/shared/mocks/server.ts   (spread into setupServer)
- Do NOT modify any service, action, hook, or component file
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
4. No Supabase calls outside of services/ or actions/
5. No hardcoded route strings (use ROUTES from @/shared/constants/routes)
6. Named exports only (no default exports except in app/ pages)
7. Correct file location matches layer and scope
8. index.ts does not export internals (services, actions, schemas)
9. "use server" present in actions files; "use client" present in Client Component files that use hooks
10. Server Actions use createServerClient(); service functions called from hooks use createSupabaseBrowserClient()
11. No service role key (SUPABASE_SERVICE_ROLE_KEY) used in client-side code

OUTPUT: List each violation with file:line and the rule it breaks.
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

## 14. Naming Conventions Cheatsheet

| What                            | Convention                                                                                             | Example                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Component files                 | PascalCase `.tsx`                                                                                      | `LoginForm.tsx`, `AuthShell.tsx`                       |
| Hook files                      | camelCase `use` prefix                                                                                 | `useLoginMutation.ts`                                  |
| Service files                   | camelCase `.service.ts`                                                                                | `auth.service.ts`                                      |
| Action files                    | camelCase `.actions.ts`                                                                                | `auth.actions.ts`                                      |
| Schema files                    | camelCase `.schema.ts`                                                                                 | `auth.schema.ts`                                       |
| Type files                      | camelCase `.types.ts`                                                                                  | `auth.types.ts`                                        |
| Util files                      | camelCase `.utils.ts`                                                                                  | `auth.utils.ts`                                        |
| Query key files                 | camelCase                                                                                              | `queryKeys.ts`                                         |
| Barrel files                    | always named `index.ts`                                                                                | `index.ts`                                             |
| Component exports               | Named only                                                                                             | `export function LoginForm`                            |
| App page exports                | Default only                                                                                           | `export default LoginPage`                             |
| Zod schemas                     | `<Entity>Schema`                                                                                       | `LoginSchema`                                          |
| Inferred types                  | `<Entity>`                                                                                             | `type Login = z.infer<typeof LoginSchema>`             |
| Query keys const                | `<module>Keys`                                                                                         | `workspaceKeys`                                        |
| CSS custom props                | kebab-case                                                                                             | `--color-primary`                                      |
| Route constants                 | Nested object with `UPPER_CASE` keys; always access via the `ROUTES` constant, never write raw strings | `ROUTES.AUTH.LOGIN`                                    |
| Mock handler files              | camelCase `.handlers.ts`                                                                               | `auth.handlers.ts`                                     |
| Mock fixture files              | camelCase `.fixtures.ts`                                                                               | `auth.fixtures.ts`                                     |
| Mock fixture exports            | camelCase `mock` prefix                                                                                | `mockAuthUser`, `mockSession`                          |
| MSW handler arrays              | camelCase `<module>Handlers`                                                                           | `authHandlers`, `workspaceHandlers`                    |
| Supabase browser client factory | `createSupabaseBrowserClient`                                                                          | (fixed name — do not vary)                             |
| Supabase server client factory  | `createServerClient`                                                                                   | (fixed name — do not vary)                             |
| Proxy file                      | always named `proxy.ts`                                                                                | (project root; replaces `middleware.ts` in Next.js 16) |
| Database migration files        | timestamp prefix                                                                                       | `20240101000000_create_workspaces.sql`                 |
| Branch names                    | `type/module/description`                                                                              | `feature/auth/google-oauth`                            |
| Worktree dirs                   | `../bisaya-<module>`                                                                                   | `../bisaya-workspace`                                  |

---

## 15. Forbidden Patterns

These patterns are **unconditionally banned**. No exceptions without an ADR.

```ts
// ❌ Cross-module import
import { useWorkspaceList } from "@/modules/workspace/hooks/useWorkspaceList";
// inside src/modules/auth/ — BANNED

// ❌ Deep import bypassing barrel
import { loginWithEmail } from "@/modules/auth/services/auth.service";
// from outside the auth module — BANNED

// ❌ Business logic in app/page.tsx
export default function Page() {
  const [data, setData] = useState([]); // BANNED
  useEffect(() => {}, []); // BANNED
}

// ❌ Relative cross-layer import
import { cn } from "../../shared/lib/utils"; // BANNED — use @/shared/lib/utils

// ❌ State or data fetching inside a template
export function EditorLayout() {
  const { data } = useWorkspace(); // BANNED in template — lift to Page
  return <div>{data.name}</div>;
}

// ❌ Feature logic embedded in layout props
<TwoColumnLayout sidebarOpen={user.preferences.sidebar} /> // BANNED — layout props only

// ❌ Hardcoded route string
router.push("/settings/profile"); // BANNED — use ROUTES.SETTINGS.PROFILE

// ❌ Default export from src/ (only allowed in app/)
export default function AuthForm() { ... } // BANNED in src/

// ❌ Importing _core outside its group
import { useWorkspaceContext } from "@/modules/workspace/_core"; // BANNED outside workspace group

// ❌ Hand-editing shadcn ui primitives
// src/components/ui/button.tsx — NEVER modify directly; extend via CVA variants

// ❌ Importing mock fixtures or handlers in production code
import { mockLoginResponse } from "../mocks/auth.fixtures"; // BANNED in services/

// ❌ Calling startMocking() outside of app/layout.tsx — BANNED
import { startMocking } from "@/shared/mocks"; // only app/layout.tsx may import this

// ❌ Setting NEXT_PUBLIC_API_MOCKING in .env.production — BANNED
// Mocks must never run in production

// ❌ Using the service role key client-side — CRITICAL SECURITY VIOLATION
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// SUPABASE_SERVICE_ROLE_KEY bypasses RLS — NEVER use on the client or in browser-accessible code

// ❌ Using the browser client in a Server Action or Server Component
"use server";
import { createSupabaseBrowserClient } from "@/shared/config/supabase.browser"; // BANNED in server context

// ❌ Using the server client in a Client Component or TanStack Query hook
"use client";
import { createServerClient } from "@/shared/config/supabase.server"; // BANNED in client context

// ❌ Direct Supabase call in a component (bypassing service layer)
export function WorkspacesPage() {
  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.from("workspaces").select(); // BANNED — use a service function
}

// ❌ Calling redirect() or revalidatePath() inside a component — BANNED
// These Next.js functions are only valid inside Server Actions and Route Handlers

// ❌ Mutating Supabase from a Server Component directly (use a Server Action instead)
export async function WorkspacesPage() {
  const supabase = await createServerClient();
  await supabase.from("workspaces").insert({}); // BANNED — use a Server Action
}

// ❌ Using the deprecated middleware.ts filename instead of proxy.ts — BANNED in Next.js 16
// Run the codemod: npx @next/codemod@latest middleware-to-proxy
// middleware.ts is still accepted but will be removed in a future version
```

---

## 16. Decision Tree — Where Does This File Go?

```
Is it a Next.js routing file (page, layout, loading, error)?
  └── YES → app/   (thin shell only — one re-export)
  └── NO ↓

Is it an OAuth callback or external webhook handler?
  └── YES → app/(auth)/callback/route.ts  or  app/api/<domain>/route.ts

Is it a session-refresh interceptor or edge-level proxy?
  └── YES → proxy.ts  (project root)

Is it a Supabase client factory?
  └── YES → src/shared/config/supabase.browser.ts  or  supabase.server.ts

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

        Is the Page data-heavy and SEO-important?
          └── YES → Server Component (async function, no "use client")
          └── NO  → Client Component ("use client", TanStack Query hooks)

Is it a server-side mutation (form submit, create/update/delete)?
  ├── Triggered from a Server Component form or passed as action prop?
  │     └── YES → src/modules/<module>/actions/<module>.actions.ts  ("use server")
  └── Triggered from a Client Component with optimistic UI or loading state?
        └── YES → useMutation hook → service function → browser Supabase client

Is it data fetching logic?
  ├── Plain async function calling the Supabase client?
  │     └── YES → src/modules/<module>/services/<module>.service.ts
  │           ├── Called from Server Components / Actions? → use createServerClient()
  │           └── Called from TanStack Query hooks?        → use createSupabaseBrowserClient()
  └── React hook wrapping TanStack Query?
        └── YES → src/modules/<module>/hooks/use<Resource>.ts

Is it a Zod schema or inferred type?
  ├── Scoped to one module?
  │     └── YES → src/modules/<module>/schemas/<module>.schema.ts
  └── Generic / shared (Pagination, etc.)?
        └── YES → src/shared/types/api.types.ts

Is it a pure utility function?
  ├── Feature-specific?
  │     └── YES → src/modules/<module>/utils/<module>.utils.ts
  └── Generic (cn, formatDate, etc.)?
        └── YES → src/shared/lib/utils.ts

Is it configuration?
  ├── Supabase client setup?     → src/shared/config/supabase.browser.ts  or  supabase.server.ts
  ├── TanStack Query setup?      → src/shared/config/QueryProvider.tsx
  └── Static values (routes)?   → src/shared/constants/routes.ts

Is it a database migration?
  └── YES → supabase/migrations/<timestamp>_<description>.sql

Is it a mock file (dev only)?
  ├── Static typed data for a single module?
  │     └── YES → src/modules/<module>/mocks/<module>.fixtures.ts
  ├── MSW request handlers for a single module?
  │     └── YES → src/modules/<module>/mocks/<module>.handlers.ts
  └── MSW worker/server setup or startMocking()?
        └── YES → src/shared/mocks/
```
