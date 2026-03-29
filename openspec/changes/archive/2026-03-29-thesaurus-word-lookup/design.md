## Context

The Bisaya AI Rap workspace editor includes a floating Thesaurus panel with a Word Lookup tab. This tab uses `useWordLookupQuery` (TanStack Query) → `thesaurus.service.ts` → a hard-coded `http://localhost:3001` URL that pointed to a legacy NestJS backend, which no longer exists in this Next.js-only architecture.

The `@junsayke/cebuano-thesaurus` package (Node.js only, SQLite-backed) is now installed and provides all needed dictionary functions: `lookup()` for exact-match entries and `fuzzySearch()` for partial matches. The goal is to wire this package into a Route Handler so the existing TanStack Query stack is preserved end-to-end.

Existing UI components (`WordLookupTab`, `WordResultCard`) and hooks (`useWordLookupQuery`) already conform to the `WordLookupResult` shape — they must not change their public interface.

## Goals / Non-Goals

**Goals:**
- Expose a Route Handler at `GET /api/thesaurus/lookup?query=<term>` that calls `@junsayke/cebuano-thesaurus` server-side
- Map `ThesaurusEntry` → `WordLookupResult` so the existing hook/component chain requires no changes
- Fall back to `fuzzySearch` when `lookup` returns `null` (no exact entry), returning matched headwords as "homonyms" for discovery
- Validate the `query` param with Zod in the Route Handler
- Update `thesaurus.service.ts` to call `/api/thesaurus/lookup` instead of the old base URL

**Non-Goals:**
- Persisting recently-looked-up words to Supabase (out of scope per user)
- Supporting other thesaurus tabs (Rhyme, Synonyms, Anagrams, Wordplay)
- Returning raw `ThesaurusEntry` shape to the client; shape must stay as `WordLookupResult`
- Changes to `WordLookupTab`, `WordResultCard`, or `useWordLookupQuery`

## Decisions

### D1 — Route Handler, not Server Action

**Decision:** Use a Route Handler (`app/api/thesaurus/lookup/route.ts`) rather than a Server Action.

**Rationale:** TanStack Query's `queryFn` calls a client-side service function that makes a `fetch()` call. Server Actions return plain objects and cannot be called from arbitrary `queryFn`s without an `action` wrapper. A Route Handler is the idiomatic target for TanStack Query hooks and matches the existing pattern used for beats and sessions.

**Alternative considered:** Wrapping a Server Action inside a thin client helper — rejected because it adds an unnecessary indirection layer and breaks the expected TanStack Query cache invalidation pattern.

---

### D2 — `lookup` first, `fuzzySearch` fallback

**Decision:** Call `lookup(term)` first; if it returns `null`, call `fuzzySearch(term, 10)` and surface matched headwords as homonym chips in the `WordLookupResult.homonyms` array (with `shortDefinition: "fuzzy match"`).

**Rationale:** Exact lookups return complete structured entries (definitions, examples, translations). Fuzzy results only return summaries (`EntrySummary[]`). By placing fuzzy hits in the `homonyms` slot, the user can click a chip to trigger a new exact lookup — matching the "Navigate to Tool" pattern described in the SDD.

**Alternative considered:** Returning an empty result on no-match — rejected because it gives no discovery path for misspellings or partial Bisaya input.

---

### D3 — `WordLookupResult` mapping strategy

**Decision:** Map `ThesaurusEntry` to `WordLookupResult` in a pure mapper function inside the Route Handler module (`mapEntry`):

| `ThesaurusEntry` source | `WordLookupResult` target |
|---|---|
| `entry.senses[].translations[]` concatenated | `definitions[]` (string array) |
| `entry.subentries[].headword` | `homonyms[]` (word chips, no shortDefinition) |
| `entry.senses[].translations[]` | `translations[]` as `{ language: "en", translation }` |

**Rationale:** Keeps mapping logic co-located with the Route Handler that owns the contract. The `thesaurus.types.ts` shape does not change. Examples from senses are folded into definitions as parenthetical strings `"... (e.g. …)"`.

---

### D4 — Service URL — relative path

**Decision:** Update `thesaurus.service.ts` to fetch `/api/thesaurus/lookup?query=…` (relative, no base URL env var) when called from a browser Client Component.

**Rationale:** Relative URLs work correctly in both dev and production without needing `NEXT_PUBLIC_API_URL`. The old `BASE` env var pointed to an external server — removing it reduces configuration surface.

## Risks / Trade-offs

- **SQLite cold start on first request** → The `@junsayke/cebuano-thesaurus` package opens a SQLite file; the first request in a cold serverless function may be slow. Mitigation: module-level singleton (package handles this internally). Acceptable for an interactive tool.
- **Node.js-only package in Edge Runtime** → The package uses `better-sqlite3` which does not run in the Edge Runtime. The Route Handler must remain in the Node.js runtime (default). Mitigation: no `export const runtime = "edge"` in the route file.
- **Missing entries** → Not all Bisaya words are in the Wolff dictionary. Fuzzy fallback mitigates this but won't cover all terms. Acceptable for MVP.
- **`homonyms` semantic overload** → Using `homonyms[]` for fuzzy-match chips is a minor semantic stretch; the existing `WordResultCard` renders them as tappable chips regardless of meaning. Acceptable given no UI changes are in scope.

## Migration Plan

1. Add `app/api/thesaurus/lookup/route.ts` (new file)
2. Update `thesaurus.service.ts` — replace `BASE + /thesaurus/lookup` with `/api/thesaurus/lookup` and remove `BASE` constant
3. Remove `NEXT_PUBLIC_API_URL` references from thesaurus (other modules may still use it — check before deleting `.env` entry)
4. Verify via browser dev-tools that the Route Handler returns `WordLookupResult` JSON
5. No database migration needed; no Supabase changes
