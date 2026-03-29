## Why

The workspace editor's Thesaurus panel already exposes a "Rhyme" tab, but it is disabled — users cannot find phonetically similar Bisaya words while writing bars. The `@junsayke/cebuano-thesaurus` package already ships `getRhymes()`, which makes this a low-cost, high-value capability to wire up now.

## What Changes

- Enable the "Rhyme" tab in `ThesaurusTabs` and implement `RhymeFinderTab` molecule.
- Add Route Handler `GET /api/thesaurus/rhyme?query=<term>` that calls `getRhymes()` from `@junsayke/cebuano-thesaurus` server-side (Node.js runtime required for `better-sqlite3`).
- Add `RhymeResult` type to `thesaurus.types.ts` describing a rhyme candidate (word, rhymeType, score, syllableCount).
- Add `findRhymes` client service function to `thesaurus.service.ts`.
- Add `useRhymeQuery` TanStack Query hook in `workspace/hooks/`.
- Extend `thesaurusKeys` query key factory with a `rhyme(term)` key.
- Rhyme results are displayed as styled chips grouped by rhyme type (perfect → family → additive → assonance). Clicking a chip pre-fills the Word Lookup tab.
- No Supabase persistence — no recently-searched-rhymes cache or history table.

## Capabilities

### New Capabilities

- `rhyme-finder`: Lets users enter a Bisaya word in the Rhyme tab and receive a ranked list of rhyming words grouped by rhyme type (perfect, family, additive, assonance). Each result chip is clickable to trigger a Word Lookup for that word.

### Modified Capabilities

- `thesaurus-word-lookup`: The Word Lookup tab must accept an externally-driven `initialTerm` prop so the Rhyme tab can pre-fill it when a user clicks a rhyme result chip. This is a behavioral requirement change.

## Impact

- **New files**: `app/api/thesaurus/rhyme/route.ts`, `src/modules/workspace/components/molecules/RhymeFinderTab.tsx`, `src/modules/workspace/hooks/useRhymeQuery.ts`
- **Modified files**: `ThesaurusTabs.tsx` (enable rhyme tab, lift active-word state for cross-tab pre-fill), `thesaurus.types.ts` (add `RhymeCandidate`, `RhymeResult`), `thesaurus.service.ts` (add `findRhymes`), `queryKeys.ts` (add `rhyme` key), `WordLookupTab.tsx` (accept optional `initialTerm`)
- **Dependencies**: `@junsayke/cebuano-thesaurus` (already installed) — server-side only
- **No new Supabase migrations or tables**
