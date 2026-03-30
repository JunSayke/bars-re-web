## Context

The Verse Snippets feature was implemented in `2026-03-26-workspace-editor-manage-verse-snippets` with full UI (CRUD panel, search, tag filter, drag/resize, insert-into-editor) backed entirely by MSW mock handlers at `localhost:3001`. The service layer (`snippet.service.ts`) uses plain `fetch` calls to four REST endpoints (`GET /snippets`, `POST /snippets`, `PATCH /snippets/:id`, `DELETE /snippets/:id`) that route to MSW in development and nowhere in production.

The auth, session, bars, and beat layers have each been migrated to Supabase in previous changes. This change completes the migration by replacing the snippet REST calls with Supabase client calls — following the identical pattern established by `session.service.ts` (for CRUD) and `editor.service.ts` (for ownership-scoped read/write).

The `snippets` table does not yet exist in the Supabase schema. The `database.types.ts` file must be updated to include the new table.

## Goals / Non-Goals

**Goals:**
- Create a `snippets` table in Supabase with RLS restricting all operations to the row owner (`auth.uid() = user_id`)
- Replace the four REST operations in `snippet.service.ts` with Supabase client calls scoped to the authenticated user
- Enforce the 200-snippet limit via a `count()` query before `INSERT` (mirrors the session limit pattern)
- Map Supabase snake_case columns to the existing camelCase `Snippet` TypeScript type — no schema or hook changes required
- Store `tags` as a Postgres `text[]` array; deserialize to `SnippetTag[]` in the service layer

**Non-Goals:**
- Modifying any UI component, hook, schema, or type — `snippet.service.ts` is the only file changing
- Full-text search via Supabase `tsvector` — keyword search remains client-side filter over the fetched list
- Pagination or cursor-based fetching — list is fetched in full (max 200 rows, consistent with the limit)
- Migrating the MSW handlers to intercept Supabase URLs — existing handlers become inert as Supabase calls bypass `localhost:3001`
- Bulk delete via Supabase — single-row delete per call, consistent with current hook interface

## Decisions

### D1 — Rewrite `snippet.service.ts` in place; do not create a new service file

**Decision:** Replace the four `fetch`-based functions inside the existing `snippet.service.ts` with Supabase client calls. No new file is created.

**Rationale:** Unlike the session/editor/beat migration (which also extracted separate responsibilities), the snippet service has exactly one concern — snippet CRUD — and there is no second service file splitting transport concerns. Creating a `snippets-supabase.service.ts` alongside the original would add indirection with no benefit. The `session.service.ts` extraction pattern applied because the original `workspace.service.ts` mixed session + editor + beat concerns. Here the service is already single-purpose.

**Alternative considered:** Create `src/modules/workspace/services/snippet-supabase.service.ts` and update hook imports. Rejected — unnecessary file proliferation with no modular benefit.

---

### D2 — `tags` stored as a Postgres `text[]` array column

**Decision:** The `snippets.tags` column is typed `text[]` in Postgres. The service layer casts to `SnippetTag[]` on read: `(row.tags ?? []) as SnippetTag[]`. On write, the array is passed directly to the Supabase client (no serialization needed — the PostgREST API accepts JSON arrays for `text[]` columns).

**Rationale:** A `text[]` column avoids a join table for a fixed enum set of five values. The Supabase JS client serializes JavaScript arrays to the wire format automatically. Using `text[]` instead of a join table is consistent with the small, fixed tag vocabulary.

**Alternative considered:** Separate `snippet_tags` join table. Rejected — unnecessary for a fixed 5-value enum and adds a join to every snippet query.

**Alternative considered:** `tags` stored as comma-separated string in a `text` column. Rejected — array type is more semantically accurate and avoids string parsing.

---

### D3 — 200-snippet limit enforced via `count()` before `INSERT`

**Decision:** Before inserting a new snippet, call `supabase.from("snippets").select("id", { count: "exact", head: true }).eq("user_id", userId)` and throw `{ message: "Snippet limit reached" }` if `count >= 200`. This matches the existing `useCreateSnippetMutation` error handling which already presents that exact message string.

**Rationale:** RLS cannot enforce a row-count limit at the DB level without a trigger. The client-side count check is consistent with the session limit enforcement pattern from `session.service.ts`. The hook already handles this error message; no hook change is needed.

**Risk:** Race condition if two browser tabs create snippets simultaneously near the limit. Acceptable — a marginal over-limit by one row does not cause data loss.

---

### D4 — `getSnippets` fetches all rows up to the 200 limit; no server-side pagination

**Decision:** `getSnippets` calls `.select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(200)`. The 200-record cap is practical rather than paginated.

**Rationale:** The existing UI displays at most 200 snippets (enforced by the business rule). Fetching all 200 in one call is simpler than cursor pagination, avoids TanStack Query page management, and the JSON payload for 200 small text rows is well within acceptable transfer size (~50–100 KB worst case).

**Alternative considered:** Server-side pagination with `useInfiniteQuery`. Rejected — premature complexity for 200 rows with no evidence of performance issues.

---

### D5 — `updated_at` is updated via `DEFAULT now()` trigger or explicit timestamp in the service

**Decision:** The `snippets` table will have both `created_at` and `updated_at` columns with `DEFAULT now()`. On `UPDATE`, the service explicitly sets `updated_at: new Date().toISOString()` — the same approach used in `session.service.ts` for `last_modified_at`. A Supabase trigger (`moddatetime`) is the preferred DB-level approach but is not required for the frontend change.

**Rationale:** Explicit timestamp in the service is safe and doesn't depend on a trigger being configured. If the trigger is added later, the explicit set is harmless (last-write wins).

---

### D6 — MSW snippet handlers are retained but become inert

**Decision:** `snippet.handlers.ts` keeps all four handlers intact. They are no longer called by any hook because `snippet.service.ts` now calls Supabase directly. No changes to `browser.ts` or `server.ts`.

**Rationale:** Consistent with the pattern established in the sessions and bars/beat Supabase migrations. Removing inert handlers is deferred cleanup.

## Risks / Trade-offs

- **[Risk] `tags` array type mismatch at runtime** → The Supabase client returns `string[]` from a `text[]` column. The cast `(row.tags ?? []) as SnippetTag[]` trusts that stored values are valid enum members. Mitigation: validate with `snippetTagSchema.array().safeParse(row.tags)` in `getSnippets`; on failure return `[]` for that snippet's tags.
- **[Risk] `snippets` table RLS misconfiguration** → If the RLS `user_id = auth.uid()` policy is absent or incorrect, users could read/modify other users' snippets. Mitigation: test with a second user account during smoke testing (verify isolation).
- **[Risk] `count()` race condition near 200-snippet limit** → Two concurrent creates at count=199 could both pass the check and insert, reaching 201. Acceptable for MVP; a DB-level trigger or unique constraint can cap this later.
- **[Risk] Signed URL refresh not required for snippets** → Unlike beats (which use Supabase Storage with expiring signed URLs), snippets store text — no URL management needed.

## Migration Plan

1. **Create `snippets` table** in the Supabase project dashboard (or via migration SQL):
   ```sql
   CREATE TABLE snippets (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     title text NOT NULL,
     content text NOT NULL,
     tags text[] NOT NULL DEFAULT '{}',
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   );
   ```
2. **Enable RLS and add policy:**
   ```sql
   ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users manage their own snippets"
     ON snippets FOR ALL TO authenticated
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   ```
3. **Update `database.types.ts`** to add the `snippets` table Row/Insert/Update types.
4. **Rewrite `snippet.service.ts`** — replace REST fetch calls with Supabase client calls.
5. **Smoke test** with a live Supabase dev project.
6. **Rollback:** Revert `snippet.service.ts` to the previous `fetch`-based version and re-enable `.env.local` API mocking — MSW handlers remain intact.

## Open Questions

- Should `updated_at` be maintained by a Postgres `moddatetime` trigger or by explicit service-layer assignment? Either works; the service-layer approach is chosen for now and can be upgraded to a trigger without a frontend change.
- Should the `content` column have a `CHECK (char_length(content) <= 10000)` constraint as a DB-level guard? The frontend enforces 200 words, but a character limit at the DB adds defense-in-depth. Recommended but not required for this change.
