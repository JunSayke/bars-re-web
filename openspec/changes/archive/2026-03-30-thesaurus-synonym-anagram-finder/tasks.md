## 1. Types and Service Layer

- [x] 1.1 Add `SynonymEntry`, `SynonymResult`, `AnagramEntry`, and `AnagramResult` interfaces to `src/modules/workspace/types/thesaurus.types.ts`
- [x] 1.2 Add `findSynonyms(term: string): Promise<SynonymResult>` to `src/modules/workspace/services/thesaurus.service.ts`
- [x] 1.3 Add `findAnagrams(term: string): Promise<AnagramResult>` to `src/modules/workspace/services/thesaurus.service.ts`

## 2. TanStack Query Keys and Hooks

- [x] 2.1 Add `thesaurusKeys.synonyms(term)` and `thesaurusKeys.anagrams(term)` factories to `src/modules/workspace/hooks/queryKeys.ts`
- [x] 2.2 Create `src/modules/workspace/hooks/useSynonymQuery.ts`
- [x] 2.3 Create `src/modules/workspace/hooks/useAnagramQuery.ts`

## 3. Route Handlers

- [x] 3.1 Create `app/api/thesaurus/synonyms/route.ts` — validate `query`, call `getSynonyms(query)`, slice to 25, return `SynonymResult`
- [x] 3.2 Create `app/api/thesaurus/anagrams/route.ts` — validate `query`, call `getAnagrams(query, 25)`, return `AnagramResult`

## 4. UI Molecules

- [x] 4.1 Create `src/modules/workspace/components/molecules/SynonymFinderTab.tsx` with controlled input, skeleton, results table (WORD + CATEGORY columns), empty/error states, and `onSelectWord` callback
- [x] 4.2 Create `src/modules/workspace/components/molecules/AnagramFinderTab.tsx` with controlled input, skeleton, results table (WORD + POS columns), empty/error states, and `onSelectWord` callback

## 5. ThesaurusTabs Integration

- [x] 5.1 Remove `"synonyms"` and `"anagrams"` from `DISABLED_TABS` in `src/modules/workspace/components/organisms/ThesaurusTabs.tsx`
- [x] 5.2 Import and render `SynonymFinderTab` for the `"synonyms"` active tab with the cross-tab `onSelectWord` handler
- [x] 5.3 Import and render `AnagramFinderTab` for the `"anagrams"` active tab with the cross-tab `onSelectWord` handler
