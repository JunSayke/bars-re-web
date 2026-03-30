## Why

The Thesaurus Tools panel already exposes Synonyms and Anagrams tabs but they are disabled — users cannot use them, leaving two core vocabulary-expansion tools unavailable for rap writing. Enabling them closes the gap between the shipped tab navigation and the full feature set described in SDD module 2 (Synonym Finder 2.3, Anagram Finder 2.4).

## What Changes

- Enable the **Synonyms** tab in `ThesaurusTabs.tsx` (remove from `DISABLED_TABS`); render the new `SynonymFinderTab` molecule.
- Enable the **Anagrams** tab in `ThesaurusTabs.tsx` (remove from `DISABLED_TABS`); render the new `AnagramFinderTab` molecule.
- Add a `GET /api/thesaurus/synonyms` Route Handler backed by `getSynonyms()` from `@junsayke/cebuano-thesaurus`.
- Add a `GET /api/thesaurus/anagrams` Route Handler backed by `getAnagrams()` from `@junsayke/cebuano-thesaurus`.
- Extend `thesaurus.service.ts` with `findSynonyms(term)` and `findAnagrams(term)` client-side fetch helpers.
- Extend `thesaurus.types.ts` with `SynonymResult` and `AnagramResult` response shapes.
- Add `useSynonymQuery` and `useAnagramQuery` TanStack Query hooks.
- Extend `queryKeys.ts` with `thesaurusKeys.synonyms` and `thesaurusKeys.anagrams` factories.
- Words in synonym/anagram results are clickable; clicking navigates to the Word Lookup tab pre-filled with the selected word (reusing the existing `onSelectWord` cross-tab pattern from `RhymeFinderTab`).

## Capabilities

### New Capabilities

- `synonym-finder`: Accepts a Bisaya word; returns Cebuano words that share the same English translation (synonym lookup via shared translation table), displayed in a searchable table with WORD and CATEGORY columns.
- `anagram-finder`: Accepts a Bisaya word; returns Cebuano headwords whose letters are an anagram of the input, displayed in a table with WORD and POS columns.

### Modified Capabilities

- `thesaurus-word-lookup`: Synonym and anagram result words are now clickable cross-tab navigation triggers that pre-fill the Word Lookup query input — extending the existing navigate-to-tool behaviour already present in `WordLookupTab`.

## Impact

- **New files**: `app/api/thesaurus/synonyms/route.ts`, `app/api/thesaurus/anagrams/route.ts`, `src/modules/workspace/components/molecules/SynonymFinderTab.tsx`, `src/modules/workspace/components/molecules/AnagramFinderTab.tsx`, `src/modules/workspace/hooks/useSynonymQuery.ts`, `src/modules/workspace/hooks/useAnagramQuery.ts`
- **Modified files**: `src/modules/workspace/services/thesaurus.service.ts`, `src/modules/workspace/types/thesaurus.types.ts`, `src/modules/workspace/hooks/queryKeys.ts`, `src/modules/workspace/components/organisms/ThesaurusTabs.tsx`
- **Dependencies**: `@junsayke/cebuano-thesaurus` (already installed, `getSynonyms` and `getAnagrams` exports used)
- **No new Supabase tables** — no session-based search history persistence in this change
