## 1. Types — Extend WordLookupResult and RhymeResult

- [x] 1.1 Add `ExampleSentence` interface (`cebuano: string; english: string`) to `src/modules/workspace/types/thesaurus.types.ts`
- [x] 1.2 Add `examples: ExampleSentence[]` and `suggestedWords: HomonymEntry[]` optional fields to `WordLookupResult`
- [x] 1.3 Add `page: number`, `pageSize: number`, and `hasNextPage: boolean` fields to `RhymeResult`

## 2. Route Handler — Word Lookup

- [x] 2.1 Update `mapEntry()` in `app/api/thesaurus/lookup/route.ts` to collect `sense.examples` across all senses and populate `result.examples`
- [x] 2.2 In the fuzzy fallback branch, move fuzzy results from `homonyms` to `suggestedWords` and set `homonyms: []`
- [x] 2.3 On exact match, ensure `suggestedWords: []` is always included in the returned object

## 3. Route Handler — Rhyme Finder

- [x] 3.1 Add `page` query param parsing (positive integer, default `1`) to `app/api/thesaurus/rhyme/route.ts` using Zod
- [x] 3.2 Compute `offset = (page - 1) * 20` and pass it to `getRhymes({ limit: 20, offset, maxSyllableOffset: 1, randomness: 0 })`
- [x] 3.3 Return pagination metadata (`page`, `pageSize: 20`, `hasNextPage: candidates.length === 20`) in the `RhymeResult` response

## 4. Service — thesaurus.service.ts

- [x] 4.1 Update `findRhymes(term: string, page = 1)` to append `&page=${page}` to the fetch URL

## 5. Query Hook — useRhymeQuery

- [x] 5.1 Update `useRhymeQuery(term: string, page = 1)` signature in `src/modules/workspace/hooks/useRhymeQuery.ts` to accept `page`
- [x] 5.2 Pass `page` to `findRhymes(term, page)` in the query function
- [x] 5.3 Update `thesaurusKeys.rhyme` in `queryKeys.ts` to accept and encode `page` in the key: `[...all, "rhyme", term, page]`

## 6. UI — WordResultCard

- [x] 6.1 Add a collapsible "Examples" `SectionToggle` in `WordResultCard` that renders below Definitions — only shown when `result.examples` has entries; each example shows Cebuano sentence and English translation
- [x] 6.2 Replace unconditional "Homonyms" section with conditional logic: render "Suggested Words" chips when `result.suggestedWords` is non-empty; render "Homonyms" chips when `result.homonyms` is non-empty; render neither when both are empty

## 7. UI — RhymeFinderTab

- [x] 7.1 Add `page` local state (default `1`) and reset it to `1` when `submittedTerm` changes
- [x] 7.2 Pass `page` as the second argument to `useRhymeQuery(submittedTerm, page)`
- [x] 7.3 Render Previous / Next pagination controls below the chip groups; "Previous" is disabled on page 1; "Next" is disabled when `result.hasNextPage` is `false`
- [x] 7.4 Wire Previous button to `setPage(p => p - 1)` and Next button to `setPage(p => p + 1)`

## 8. Mocks — Fixtures and Handlers

- [x] 8.1 Update `thesaurus.fixtures.ts` — add `examples` and `suggestedWords` fields to the `mockWordLookupResult` fixture; add `page`, `pageSize`, `hasNextPage` to `mockRhymeResult`
- [x] 8.2 Update `thesaurus.handlers.ts` — ensure the lookup handler returns the updated `WordLookupResult` shape (with `examples` and `suggestedWords`); ensure the rhyme handler accepts and respects the `page` query param and returns the updated `RhymeResult` shape
