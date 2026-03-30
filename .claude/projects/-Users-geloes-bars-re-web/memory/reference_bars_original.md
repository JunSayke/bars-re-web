---
name: BARS original codebase
description: Original BARS monorepo at /Users/geloes/BARS — reference implementation for features being rebuilt in bars-re-web with a different tech stack
type: reference
---

The original BARS project lives at `/Users/geloes/BARS`. It is a Turborepo monorepo with:

- **`apps/web`** — Next.js frontend (pages: editor, home, login, register, tester)
- **`apps/backend`** — NestJS backend (modules: auth, database, link, music, session, sticky-notes, storageScripts, user; uses Prisma)
- **`packages/`** — shared packages (ui, types, eslint-config, typescript-config)

**How to apply:** When implementing features in `bars-re-web`, refer to `/Users/geloes/BARS` for existing business logic, flows, and domain knowledge. The original uses a separate NestJS backend + Prisma; the rewrite (`bars-re-web`) is fullstack Next.js + Supabase. Translate patterns accordingly — server actions / route handlers replace NestJS controllers, Supabase replaces Prisma, etc.

Key paths for feature reference:
- Frontend pages/components: `/Users/geloes/BARS/apps/web/app/` and `/Users/geloes/BARS/apps/web/components/`
- Backend modules: `/Users/geloes/BARS/apps/backend/src/`
- Shared types: `/Users/geloes/BARS/packages/types/`
