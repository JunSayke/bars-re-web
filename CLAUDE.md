# CLAUDE.md — Bisaya AI Rap

> Single source of truth for Claude Code working on this repo. Defer to `structure-architecture.md` for exhaustive rules; this file distills the essentials and adds Claude-specific guidance.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (new-york) · Radix UI · TanStack Query v5 · React Hook Form · Zod · Supabase (Auth · Postgres · Storage · Realtime) · MSW · pnpm

## Architecture Pattern

**Vertical Slice + Atomic Design.** Next.js is fullstack — no separate backend.

```
app/  →  src/modules/  →  src/components/  →  src/shared/
```

One-way only. `shared` never imports from `components`, `modules`, or `app`.

## Directory Map

```
/
├── proxy.ts                  # Session refresh (replaces middleware.ts in Next 16)
├── app/                      # Routing shell only — page.tsx, layout.tsx, route.ts
│   ├── (auth)/
│   ├── settings/
│   ├── workspaces/
│   └── api/                  # Route Handlers (webhooks, OAuth callbacks)
└── src/
    ├── modules/              # Feature slices (auth, workspace, settings…)
    │   └── <module>/
    │       ├── index.ts      # Public barrel — ONLY file outsiders import
    │       ├── components/   # atoms/ molecules/ organisms/ templates/ + <Feature>Page.tsx
    │       ├── hooks/        # TanStack Query hooks (client only)
    │       ├── actions/      # Server Actions ("use server")
    │       ├── services/     # Plain async Supabase calls (no React)
    │       ├── schemas/      # Zod schemas
    │       ├── types/
    │       ├── utils/
    │       ├── mocks/        # Dev-only: handlers + fixtures (never imported in prod)
    │       └── meta.ts       # Next.js metadata
    ├── components/           # Shared atomic UI: atoms/ molecules/ organisms/ templates/ ui/
    └── shared/               # Zero-feature utilities
        ├── lib/              # utils.ts, errors.ts (AppError)
        ├── hooks/
        ├── types/            # database.types.ts (generated — never hand-edit)
        ├── constants/        # routes.ts (ROUTES object)
        ├── config/           # supabase.browser.ts, supabase.server.ts, QueryProvider.tsx
        └── mocks/            # MSW entry: index.ts, browser.ts, server.ts
```

## Hard Rules

### File Placement
- `app/page.tsx` re-exports a Page from its module — max 10 lines, no logic.
- Business logic → `src/modules/<module>/`
- Shared presentational UI → `src/components/<layer>/`
- Shared utilities / types / config → `src/shared/`
- **Modules never import from sibling modules.**

### Supabase Clients
- Server Components / Server Actions / Route Handlers → `createServerClient()` from `@/shared/config/supabase.server`
- Client Components / TanStack Query hooks → `createSupabaseBrowserClient()` from `@/shared/config/supabase.browser`
- Server-only service functions: plain name (`listWorkspaces`). Client variants: suffix `Client` (`listWorkspacesClient`).

### Service Layer
- Plain async functions — no React, no hooks.
- Return typed data; throw `AppError` on error.
- Called by: Server Components (server variant), Server Actions (server variant), TanStack Query hooks (client variant).

### Server Actions
- `"use server"` directive at top of file.
- Validate all inputs with Zod before any DB call.
- Return plain objects (not `Response`).
- Use server Supabase client only.

### Hooks (TanStack Query)
- Live in `<module>/hooks/` — client-side only.
- Call the `Client`-suffixed service variant.
- Query keys defined in `<module>/hooks/queryKeys.ts` using a typed factory.

### Atomic Design
- **Atom** — HTML wrapper + variants. No composition of custom components.
- **Molecule** — 2–5 atoms, one UI task. No data fetching.
- **Organism** — assembles molecules. No direct data fetching; receives data as props.
- **Template** — layout skeleton with named slots (props). No business logic, no state.
- **Page** — lives in `<module>/components/<Feature>Page.tsx`. Only layer that touches server state.
- **Promotion rule:** component starts in module; moves to `src/components/<layer>/` when 2+ modules need it.

### Mocks
- `mocks/` is dev-only. Never import from production code (services, hooks, components, actions).
- Two files per module: `<module>.handlers.ts` + `<module>.fixtures.ts`.
- Fixtures: all fields present, no `as any`, no `Math.random()`, prefix every export with `mock`.
- MSW started via `src/shared/mocks/index.ts` only — individual modules never start MSW.
- Enabled via `NEXT_PUBLIC_API_MOCKING=enabled` in `.env.local` only.

### Barrel / Import Rules
- Outside callers import only from `<module>/index.ts` — never from internal paths.
- `src/shared/` exports via its own sub-folder index files.
- Never create a barrel that re-exports everything from a folder just to avoid relative paths.

### Naming
| Thing | Convention |
|---|---|
| Components | PascalCase (`LoginForm.tsx`) |
| Hooks | camelCase prefixed `use` (`useLoginMutation.ts`) |
| Services | camelCase (`auth.service.ts`) |
| Actions | camelCase (`auth.actions.ts`) |
| Schemas | camelCase (`auth.schema.ts`) |
| Types | camelCase (`auth.types.ts`) |
| Route files | kebab-case directories, Next.js convention filenames |

## When to Use What

| Situation | Approach |
|---|---|
| Initial page data, SEO | Server Component → direct service call |
| Data changes on interaction | Client Component → TanStack Query hook |
| Optimistic updates | Client Component → `useMutation` |
| Form mutation from Server Component | Server Action |
| Form with live validation | Client Component + `useMutation` |
| Realtime (Supabase Realtime) | Client Component → `useEffect` + Supabase channel |
| Webhook / external callback | Route Handler (`app/api/`) |

## Module Grouping Threshold

Promote a module to a **module group** (sub-modules + `_core/`) when:
- \>8 Page components, OR
- \>15 hooks, OR
- \>3 clearly distinct sub-domains

Sub-modules import from `_core/` via `@/modules/<group>/_core` — never from sibling sub-modules.

## Common Commands

```bash
pnpm dev                        # Start dev server
pnpm build                      # Production build
pnpm lint                       # ESLint
pnpm supabase start             # Local Supabase stack
pnpm supabase db reset          # Apply migrations
pnpm supabase gen types typescript --local > src/shared/types/database.types.ts
```

## Forbidden Patterns

- Business logic in `app/page.tsx` or `app/layout.tsx`
- Importing a module's internals (bypass `index.ts`)
- Module importing from a sibling module
- `src/shared/` importing from `components/` or `modules/`
- Browser Supabase client in Server Actions or Route Handlers
- Inline data in MSW fixtures (use `*.fixtures.ts`)
- Hand-editing `src/shared/types/database.types.ts`
- Starting MSW from within a module
- `middleware.ts` (use `proxy.ts` — Next.js 16)
- Global `hooks/` or `services/` folders outside modules

## Database Schema (current)

Generated types: [supabase/generated_types.ts](supabase/generated_types.ts) — canonical home will be `src/shared/types/database.types.ts` once scaffolded.

| Table | Key columns |
|---|---|
| `sessions` | `id`, `user_id`, `title`, `topic`, `bar_content`, `created_at`, `last_modified_at` |
| `beat_files` | `id`, `session_id` (FK→sessions), `bpm`, `storage_path`, `source_type`, `file_size_bytes` |
| `snippets` | `id`, `user_id`, `title`, `content`, `tags` (string[]), `created_at`, `updated_at` |

> Re-generate with: `pnpm supabase gen types typescript --local > src/shared/types/database.types.ts`

## Reference

Full rules, ADR process, and decision tree: [structure-architecture.md](structure-architecture.md)
