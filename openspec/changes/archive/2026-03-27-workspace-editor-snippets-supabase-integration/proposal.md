## Why

The Verse Snippets feature (`4.5 Manage Verse Snippets`) is fully built on the frontend with MSW mocks, but `snippet.service.ts` still calls a NestJS REST server at `NEXT_PUBLIC_API_URL` that does not exist. Every snippet a user creates is lost on page reload, making the feature non-functional beyond the current mock session. All other data layers in the workspace module (sessions, bars, beat files) have been migrated to Supabase; snippets are the only remaining REST-only resource.

## What Changes

- Add a `snippets` table to the Supabase schema with proper RLS (Row Level Security) scoped to the authenticated user
- Update `database.types.ts` to include the new `snippets` table types
- Replace all four REST operations in `snippet.service.ts` (`getSnippets`, `createSnippet`, `updateSnippet`, `deleteSnippet`) with Supabase client calls
- Enforce the 200-snippet limit client-side via a `count()` query before `INSERT`, consistent with the session limit pattern
- Map snake_case Supabase columns (`user_id`, `created_at`, `updated_at`) to camelCase TypeScript fields (`userId`, `createdAt`, `updatedAt`)
- Store `tags` as a Postgres `text[]` array column; the service layer serializes/deserializes between `SnippetTag[]` and the DB array
- MSW snippet handlers remain registered but become inert — Supabase calls bypass MSW routing to `localhost:3001`

## Capabilities

### New Capabilities

- None — no new user-facing capability is introduced. This is a pure infrastructure replacement.

### Modified Capabilities

- `manage-verse-snippets`: The persistence layer is changing from MSW-backed REST to real Supabase persistence. The requirement that snippets survive page reloads (UC-45 main flow step 2: "system retrieves and displays all snippets") now applies to real data. The 200-snippet limit and 200-word limit constraints are unchanged but are now enforced against real data.

## Impact

- **`src/modules/workspace/services/snippet.service.ts`** — all four functions rewritten to use Supabase client
- **`src/shared/config/database.types.ts`** — new `snippets` table added
- **Supabase project** — new `snippets` table migration required; new RLS policy required
- **No UI changes** — hooks, components, and schemas are unchanged; the service layer is the only implementation change
- **MSW handlers** (`snippet.handlers.ts`) become inert (same pattern as session and beat handlers after their migrations)
- **No dependency changes** — `@supabase/supabase-js` is already installed and the `supabase` singleton is already available at `@/shared/config/supabase`
