## Why

The Word Lookup tab in the Thesaurus panel currently delegates to an old NestJS backend (`http://localhost:3001`) that no longer exists in this full-stack Next.js architecture. The `@junsayke/cebuano-thesaurus` package is now bundled and provides direct access to the Wolff Cebuano Dictionary via SQLite — enabling server-side lookup without any external service dependency.

## What Changes

- Replace the HTTP-based `thesaurus.service.ts` client with a Route Handler at `app/api/thesaurus/lookup/` that calls `@junsayke/cebuano-thesaurus` server-side
- Update the client service to call the new Route Handler instead of the old API base URL
- Remap the `ThesaurusEntry` data from the package into the existing `WordLookupResult` shape consumed by `WordResultCard` and `WordLookupTab`
- Add Zod validation of query parameters in the Route Handler
- Fall back to `fuzzySearch` when `lookup` returns `null` (no exact match)

## Capabilities

### New Capabilities

- `thesaurus-word-lookup`: Server-side Cebuano word lookup via `@junsayke/cebuano-thesaurus`, exposed through a Next.js Route Handler, consumed by TanStack Query in the Thesaurus panel

### Modified Capabilities

- `write-and-edit-bars`: The Thesaurus panel embedded in the editor now resolves word data from the bundled dictionary instead of an external API

## Impact

- **Files changed**: `src/modules/workspace/services/thesaurus.service.ts`, `src/modules/workspace/types/thesaurus.types.ts`
- **New files**: `app/api/thesaurus/lookup/route.ts`
- **Dependencies**: `@junsayke/cebuano-thesaurus` (already installed, Node.js server-only)
- **No Supabase changes**: Recently-looked-up-word persistence is explicitly out of scope
- **No breaking UI changes**: `WordLookupTab`, `WordResultCard`, and `useWordLookupQuery` keep their existing interfaces
