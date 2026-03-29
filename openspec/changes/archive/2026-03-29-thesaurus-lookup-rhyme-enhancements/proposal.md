## Why

The Thesaurus panel surfaces dictionary data that already exists in the `@junsayke/cebuano-thesaurus` package but is not yet exposed to the user: example sentences per sense are available in `NormalizedSense.examples` but are discarded at the Route Handler layer. Additionally, fuzzy-search fallback results are misleadingly placed in the "Homonyms" section rather than being clearly surfaced as word suggestions, and the Rhyme Finder chip groups are presented in a container that does not scroll, making the panel feel cramped when many rhymes are returned.

## What Changes

- **Example sentences in Word Lookup**: The `/api/thesaurus/lookup` Route Handler will map `NormalizedSense.examples` into a new `examples` field on `WordLookupResult` (`{ cebuano: string; english: string }[]`). `WordResultCard` will render a collapsible "Examples" section below definitions.
- **Fuzzy suggestions as a clickable list**: When the Route Handler falls back to `fuzzySearch` (no exact match found), results will be placed in a new `suggestedWords` field on `WordLookupResult` instead of `homonyms`. `WordResultCard` will display a "Suggested Words" section rendered as a plain clickable list of word buttons — not chips — so users can quickly navigate to a suggestion.
- **Rhyme Finder scrollable list with Load More**: The rhyme results area in `RhymeFinderTab` will be a vertically scrollable container. An initial batch of 50 candidates is fetched on query. A "Load More" button at the bottom of the list allows fetching additional candidates in increments of 50 using `useInfiniteQuery` with offset-based loading. The button is hidden when no more candidates remain.

## Capabilities

### New Capabilities

<!-- None — all three changes extend existing functionality -->

### Modified Capabilities

- `thesaurus-word-lookup`: Requirements changing — (1) `WordLookupResult` gains an `examples` field, and example sentences must be rendered; (2) fuzzy-search results are surfaced via a new `suggestedWords` field instead of being placed in `homonyms`, requiring `WordResultCard` to conditionally display a clickable list of "Suggested Words" instead of a "Homonyms" section.
- `rhyme-finder`: Requirements changing — `RhymeFinderTab` chips area must be wrapped in a vertically scrollable container with a "Load More" button; the Route Handler gains an `offset` query param and returns `hasMore: boolean`; `findRhymes` accepts an offset arg; `useRhymeQuery` migrates to `useInfiniteQuery`; `RhymeResult` gains a `hasMore` field.

## Impact

- `src/modules/workspace/types/thesaurus.types.ts` — add `examples` and `suggestedWords` fields to `WordLookupResult`
- `app/api/thesaurus/lookup/route.ts` — map `sense.examples` into `examples`; move fuzzy results to `suggestedWords` instead of `homonyms`
- `app/api/thesaurus/rhyme/route.ts` — raise `getRhymes` limit from 20 to 50; add `offset` query param; return `hasMore: boolean`
- `src/modules/workspace/components/atoms/WordResultCard.tsx` — add collapsible "Examples" section; render "Suggested Words" as a clickable list when `suggestedWords` is non-empty
- `src/modules/workspace/components/molecules/WordLookupTab.tsx` — minor: no structural change needed (delegates to `WordResultCard`)
- `src/modules/workspace/types/thesaurus.types.ts` — add `hasMore: boolean` field to `RhymeResult`
- `src/modules/workspace/services/thesaurus.service.ts` — update `findRhymes` to accept an `offset` param
- `src/modules/workspace/hooks/useRhymeQuery.ts` — migrate from `useQuery` to `useInfiniteQuery` with offset-based page param
- `src/modules/workspace/components/molecules/RhymeFinderTab.tsx` — wrap chip groups in a vertically scrollable container; add "Load More" button driven by `fetchNextPage` / `hasNextPage`
- `src/modules/workspace/schemas/thesaurus.schema.ts` — update Zod schemas for new API shapes
- `src/modules/workspace/mocks/thesaurus.fixtures.ts` — add `examples` and `suggestedWords` fields to fixtures
- `src/modules/workspace/mocks/thesaurus.handlers.ts` — update mock handlers to return new shapes
