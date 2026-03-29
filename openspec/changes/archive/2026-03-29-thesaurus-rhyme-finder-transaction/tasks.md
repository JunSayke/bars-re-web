## 1. Types

- [x] 1.1 Add `RhymeCandidate` interface to `src/modules/workspace/types/thesaurus.types.ts` with fields: `word`, `rhymeType`, `score`, `syllableCount`
- [x] 1.2 Add `RhymeResult` interface to `thesaurus.types.ts` with fields: `query`, `candidates: RhymeCandidate[]`

## 2. Route Handler

- [x] 2.1 Create `app/api/thesaurus/rhyme/route.ts` with a `GET` handler that validates `?query=` with Zod (min length 1, 400 on failure)
- [x] 2.2 Call `getRhymes(query, { limit: 20, maxSyllableOffset: 1 })` from `@junsayke/cebuano-thesaurus` inside the handler
- [x] 2.3 Map each `RhymeCandidate` from the package's `RhymeCandidate` shape to the local `RhymeCandidate` type and return a `RhymeResult` JSON response

## 3. Client Service

- [x] 3.1 Add `findRhymes(term: string): Promise<RhymeResult>` to `src/modules/workspace/services/thesaurus.service.ts` calling `GET /api/thesaurus/rhyme?query=<term>`

## 4. Query Key & Hook

- [x] 4.1 Add `rhyme: (term: string) => [...thesaurusKeys.all, "rhyme", term] as const` to `thesaurusKeys` in `src/modules/workspace/hooks/queryKeys.ts`
- [x] 4.2 Create `src/modules/workspace/hooks/useRhymeQuery.ts` that wraps `findRhymes` with `useQuery`, enabled only when `term` is non-empty, using `thesaurusKeys.rhyme(term)`

## 5. RhymeFinderTab Component

- [x] 5.1 Create `src/modules/workspace/components/molecules/RhymeFinderTab.tsx` with a controlled text input form for the rhyme query
- [x] 5.2 Accept `onSelectWord: (word: string) => void` as a required prop and wire chip click to it
- [x] 5.3 Render chip groups in order: PERFECT → FAMILY → ADDITIVE → ASSONANCE; hide empty groups; group label in uppercase muted text above each group
- [x] 5.4 Add a loading skeleton (animate-pulse chips) shown while `isLoading` is true
- [x] 5.5 Add empty state message: `No rhymes found for "<term>".` when `candidates` is empty and query has been submitted
- [x] 5.6 Add error state message with retry affordance when `isError` is true

## 6. ThesaurusTabs Integration

- [x] 6.1 Add `activeWord: string` state and `setActiveWord` to `ThesaurusTabs`; pass `initialTerm={activeWord}` to `WordLookupTab`
- [x] 6.2 Enable the "Rhyme" tab by removing `isDisabled` and updating the click handler to allow switching to `"rhyme"`
- [x] 6.3 Render `<RhymeFinderTab onSelectWord={(w) => { setActiveWord(w); setActiveTab("word-lookup") }} />` when `activeTab === "rhyme"`

## 7. WordLookupTab initialTerm

- [x] 7.1 Add `initialTerm?: string` prop to `WordLookupTab`
- [x] 7.2 Add a `useEffect` that syncs `initialTerm` into `inputValue` and `submittedTerm` when it changes to a non-empty value
