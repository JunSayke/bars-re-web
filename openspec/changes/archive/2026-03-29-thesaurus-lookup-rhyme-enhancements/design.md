## Context

The `@junsayke/cebuano-thesaurus` `lookup()` function returns `NormalizedSense.examples` (`{ cebuano, english }[]`) which are currently discarded in the Route Handler. The `/api/thesaurus/lookup` route conflates two distinct responses — an exact dictionary match and a fuzzy fallback — into the same `WordLookupResult` shape by placing fuzzy hits in the `homonyms` array. The `/api/thesaurus/rhyme` route fetches a fixed 20 candidates with no pagination mechanism, meaning all results are rendered in one flat list regardless of how many groups exist.

The existing `WordLookupResult`, `RhymeResult`, and all downstream components are in the `workspace` module and are currently stable.

## Goals / Non-Goals

**Goals:**

- Expose `NormalizedSense.examples` from the dictionary as example sentences on `WordLookupResult` and render them in `WordResultCard`.
- Distinguish fuzzy fallback results from true homonyms at the type, API, and UI levels; surface fuzzy hits as a clickable plain list under "Suggested Words".
- Make all rhyme candidates browsable within the panel via a scrollable container and a "Load More" button that appends additional batches.

**Non-Goals:**

- No change to `lookup()` call signature — the package API is not modified.
- No change to the authentication or session layers.
- No new Supabase tables or migrations.
- No changes to the Snippets or Bars editor features.
- Infinite scroll or lazy-loading of rhyme candidates.

## Decisions

### Decision 1 — Add `examples` and `suggestedWords` as new optional fields on `WordLookupResult`

**Chosen:** Extend the existing `WordLookupResult` interface with `examples?: ExampleSentence[]` and `suggestedWords?: HomonymEntry[]`. The Route Handler populates `examples` from `sense.examples` on exact match and populates `suggestedWords` (not `homonyms`) with fuzzy hits on fallback.

**Rationale:** Minimal surface change. `WordResultCard` already renders sections conditionally — adding a new section is additive. Making `suggestedWords` optional means existing callers (mocks, tests, consumers that construct `WordLookupResult` manually) do not need to update immediately.

**Alternative considered — reuse `homonyms` with a flag field (`isFuzzyMatch: boolean`):** Rejected because it forces consumers to branch on a flag rather than reading a different field, making intent less clear.

**Alternative considered — separate `FuzzyLookupResult` type:** Rejected as over-engineering for a single UI distinction.

**Decision 1b — Suggested Words rendered as a plain clickable list, not chips**

**Chosen:** Render `suggestedWords` as a `<ul>` of `<button>` elements styled as plain text rows with a hover highlight, not as badge chips.

**Rationale:** Chips work well for related cross-navigation items (homonyms, rhymes) because they are roughly equal in visual weight to each other. Suggested words from a fuzzy search are a fallback path — the user arrived there because their query failed — so a list format is more legible for scanning multiple candidates at once. It also visually differentiates "you got no results, here are suggestions" from "you got a result, here are its homonyms".

---

### Decision 2 — "Load More" button via `useInfiniteQuery` with offset-based batching (limit 50)

**Chosen:** The Route Handler calls `getRhymes(query, { limit: 50, offset, maxSyllableOffset: 1, randomness: 0 })` where `offset` defaults to 0. It returns `{ query, candidates, hasMore }` where `hasMore = candidates.length === 50`. The client service `findRhymes(term, offset = 0)` passes `?offset=<n>` in the URL. `useRhymeQuery` migrates to `useInfiniteQuery` with `initialPageParam: 0` and `getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.flatMap(p => p.candidates).length : undefined`. In `RhymeFinderTab`, candidates are flattened across all pages (`data.pages.flatMap(p => p.candidates)`), grouped by rhyme type, and rendered inside a scrollable `div`. A "Load More" button appears below the chip groups — visible when `hasNextPage` is true, shows a loading spinner while `isFetchingNextPage`.

**Rationale:** The "Load More" pattern is the right middle-ground here:
- Cards/Prev-Next pagination was rejected because it empties the panel — Load More keeps all accumulated candidates visible.
- Full lazy auto-scroll was rejected as overkill and disorienting in a narrow sidebar (user loses context of where they are).
- `useInfiniteQuery` is the TanStack Query v5 idiomatic tool for offset-based append-loading; it manages all accumulated pages internally, deduplicated under the same `thesaurusKeys.rhyme(term)` key.
- 50 per batch is a practical trade-off: enough candidates to fill any group subset on the first load, small enough that the SQLite query stays negligible.

**Alternative considered — server-side prev/next pagination:** Rejected (panel looks empty, complex state).

**Alternative considered — infinite auto-scroll:** Rejected (disorienting in narrow sidebar, `IntersectionObserver` complexity for minimal gain at this scale).

**Alternative considered — single large fetch (no Load More, fixed 200 limit):** Rejected; 200 candidates across 4 rhyme-type groups would make the scrollable container overwhelming with no user control over how much data they see.

## Risks / Trade-offs

- **Fetching 50 candidates per batch** — First load fetches 50 via a local SQLite query; subsequent "Load More" calls each fetch another 50. Cost is negligible — no network round-trip, pure in-process SQLite. **Mitigation:** `hasMore` flag prevents unnecessary fetches once candidates are exhausted.
- **`useInfiniteQuery` flattens pages client-side** — All accumulated `RhymeCandidate[]` arrays are flattened before grouping by `rhymeType`. On a new search term the query key changes and TanStack Query discards the old pages, so stale candidates from a previous term never appear. **Mitigation:** Standard TanStack Query v5 behavior.
- **Mock fixtures must be updated** — Existing `thesaurus.fixtures.ts` constructs `WordLookupResult` inline; adding optional fields is non-breaking but the canonical mock should reflect the new shape. The rhyme mock handler must now return `hasMore: boolean`. **Mitigation:** Fixtures are updated in the same PR.

## Migration Plan

1. Update `thesaurus.types.ts` with new fields (additive change): `ExampleSentence`, `examples`, `suggestedWords` on `WordLookupResult`; `hasMore` on `RhymeResult`.
2. Update `app/api/thesaurus/lookup/route.ts` to map examples and use `suggestedWords`.
3. Update `app/api/thesaurus/rhyme/route.ts` to accept `offset` param, raise limit to 50, return `hasMore`.
4. Update `thesaurus.service.ts` — `findRhymes(term, offset)` passes `?offset=<n>` in URL.
5. Migrate `useRhymeQuery` to `useInfiniteQuery` with offset-based page params.
6. Update `WordResultCard` to render examples and a suggested-words list.
7. Update `RhymeFinderTab` to flatten infinite pages, wrap in scrollable container, add "Load More" button.
8. Update mock fixtures and handlers.
9. No migration needed — no database changes.

No rollback complexity: all changes are additive or behind new optional parameters.

## Open Questions

- None — all decisions are resolved.
