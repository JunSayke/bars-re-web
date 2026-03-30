## Context

The workspace editor currently has a `ThesaurusTabs` panel with five tabs: Word Lookup, Rhyme, Synonyms, Anagrams, and Wordplay. Word Lookup and Rhyme are fully operational. Synonyms and Anagrams are rendered in the nav strip but are listed in `DISABLED_TABS`, so they remain non-interactive.

The project already has a working Route Handler + service + TanStack Query hook pattern established by the Rhyme Finder (2.2). The `@junsayke/cebuano-thesaurus` package (v1.3.0) is installed and exports `getSynonyms` and `getAnagrams` — both are Node.js-only functions that must run server-side. The UI design reference (pasted screenshots) shows a dark-themed results table with WORD (purple link) and CATEGORY or POS columns, consistent with the existing dark theme defined in `globals.css`.

## Goals / Non-Goals

**Goals:**

- Enable the Synonyms tab: wire `GET /api/thesaurus/synonyms?query=<term>` → `SynonymFinderTab` → `useSynonymQuery` hook.
- Enable the Anagrams tab: wire `GET /api/thesaurus/anagrams?query=<term>` → `AnagramFinderTab` → `useAnagramQuery` hook.
- Synonym results display WORD and CATEGORY (derived from the POS of the synonym entry) columns; word cells are clickable links that pre-fill Word Lookup.
- Anagram results display WORD and POS columns; word cells are clickable links that pre-fill Word Lookup.
- Load states use the same animated skeleton pattern as existing tabs.
- Cross-tab navigation reuses the `onSelectWord` callback pattern already established in `RhymeFinderTab`.

**Non-Goals:**

- No Supabase persistence / search history for synonyms or anagram queries.
- No Wordplay tab (separate future change).
- No server-rendered (RSC) data fetching — tabs are client-side interactive.
- No pagination for synonyms or anagrams (results are naturally bounded by the dictionary).

## Decisions

### D1 — Route Handler pattern (not Server Action)

**Decision**: Use `GET` Route Handlers at `app/api/thesaurus/synonyms/route.ts` and `app/api/thesaurus/anagrams/route.ts`.

**Rationale**: TanStack Query hooks use `fetch()` to hit REST endpoints; this is the pattern established by the existing Word Lookup and Rhyme Finder Route Handlers. Server Actions return `void`/plain objects and do not compose naturally with `useQuery`. Keeping consistent with the existing pattern avoids introducing a second data-fetching mechanism.

**Alternative considered**: Direct Server Action + `useQuery` wrapping the action call — rejected because it couples `useQuery` to a non-fetch function, which breaks caching semantics and dev tools.

---

### D2 — Response type shapes

**Synonym response** (`SynonymResult`):
```ts
interface SynonymEntry { word: string; pos?: string }
interface SynonymResult { query: string; synonyms: SynonymEntry[] }
```
`getSynonyms()` returns `EntrySummary[]` with `headword` and optional `pos`. The `pos` field serves as the CATEGORY column. No additional transformation is needed beyond renaming fields.

**Anagram response** (`AnagramResult`):
```ts
interface AnagramEntry { word: string; pos?: string }
interface AnagramResult { query: string; anagrams: AnagramEntry[] }
```
`getAnagrams()` also returns `EntrySummary[]`; same mapping.

**Rationale**: Thin DTOs that mirror the already-typed package return values reduce the risk of mapping errors. CATEGORY displayed in the UI is just the `pos` value uppercased — no separate category taxonomy is needed.

---

### D3 — UI molecule pattern

Both `SynonymFinderTab` and `AnagramFinderTab` are molecules placed at `src/modules/workspace/components/molecules/`. They follow the same structure as `RhymeFinderTab`: controlled input → form submit → `useQuery` hook → results render. Results are rendered as a table (WORD column as purple button, secondary column for POS/category) rather than chips, matching the reference UI screenshots.

---

### D4 — Cross-tab word navigation

Both tabs receive an `onSelectWord: (word: string) => void` prop (same interface as `RhymeFinderTab`). `ThesaurusTabs` passes a handler that sets `activeWord` and switches to the `word-lookup` tab — the same wiring already in place for rhyme.

## Risks / Trade-offs

- **`getSynonyms` / `getAnagrams` return `EntrySummary[]` not `ThesaurusEntry[]`**: the `pos` field is a single string or `undefined`, not an array. The CATEGORY column in the UI may show empty cells for entries without POS data.
  → Mitigation: render `pos?.toUpperCase() ?? "—"` to show a dash for missing values; acceptable UX.

- **No limit parameter on `getSynonyms`**: the function does not accept a `limit` option, so the synonym list may be long for common words.
  → Mitigation: the Route Handler can slice the result to a default cap (e.g. 25) to avoid rendering hundreds of rows.

- **`getAnagrams` default limit is 25**: already bounded; no additional action needed.

- **Disabled tab styling**: removing tabs from `DISABLED_TABS` must not break the Wordplay tab which remains disabled.
  → Mitigation: only remove `synonyms` and `anagrams` from the array; keep `wordplay`.

## Migration Plan

No database migrations. No breaking API changes. The new Route Handler endpoints are additive. Deployment is a standard build + deploy with no rollback complexity.

## Open Questions

- None blocking implementation.
