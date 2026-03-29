## MODIFIED Requirements

### Requirement: Rhyme query Route Handler
The system SHALL expose a Route Handler at `GET /api/thesaurus/rhyme?query=<term>&offset=<n>` (Node.js runtime, not Edge) that calls `getRhymes(term, { limit: 50, offset, maxSyllableOffset: 1, randomness: 0 })` from `@junsayke/cebuano-thesaurus`, where `offset` defaults to `0` when omitted. The Route Handler SHALL return a `RhymeResult` JSON response containing a batch of up to 50 candidates and a `hasMore` flag.

#### Scenario: Rhymes found for a known word (first batch)
- **WHEN** a GET request is made with a valid Bisaya word and no `offset` (e.g., `?query=dagat`)
- **THEN** the Route Handler SHALL return `200` with a `RhymeResult` where `candidates` is a non-empty array of up to 50 `RhymeCandidate` objects and `hasMore` is `true` if exactly 50 candidates were returned, `false` otherwise

#### Scenario: Rhymes found — subsequent batch
- **WHEN** a GET request is made with `?query=dagat&offset=50`
- **THEN** the Route Handler SHALL call `getRhymes` with `offset: 50` and return the next batch of up to 50 candidates with an updated `hasMore` flag

#### Scenario: No rhymes found
- **WHEN** a GET request is made with a word that yields zero rhyme candidates
- **THEN** the Route Handler SHALL return `200` with a `RhymeResult` where `candidates` is an empty array and `hasMore` is `false`

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the Route Handler SHALL return `400` with `{ error: "query is required" }`

---

### Requirement: RhymeResult and RhymeCandidate types
The system SHALL define `RhymeCandidate` and `RhymeResult` in `src/modules/workspace/types/thesaurus.types.ts`. `RhymeResult` gains a `hasMore` boolean field.

#### Scenario: RhymeCandidate shape
- **WHEN** the Route Handler maps a result from `getRhymes()`
- **THEN** each `RhymeCandidate` SHALL have: `word: string`, `rhymeType: "perfect" | "family" | "additive" | "assonance"`, `score: number`, `syllableCount: number`

#### Scenario: RhymeResult shape
- **WHEN** the Route Handler serializes its response
- **THEN** the response SHALL have shape `{ query: string, candidates: RhymeCandidate[], hasMore: boolean }`

---

### Requirement: Client service findRhymes function
The `findRhymes` function in `thesaurus.service.ts` SHALL accept a `term: string` and `offset: number = 0` parameter, call `GET /api/thesaurus/rhyme?query=<term>&offset=<offset>`, and return a `RhymeResult`.

#### Scenario: Service constructs correct URL on initial fetch
- **WHEN** `findRhymes("dagat", 0)` is called in the browser
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/rhyme?query=dagat&offset=0`

#### Scenario: Service constructs correct URL for subsequent batches
- **WHEN** `findRhymes("dagat", 50)` is called in the browser
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/rhyme?query=dagat&offset=50`

#### Scenario: Service handles non-OK response
- **WHEN** the Route Handler returns a non-2xx status
- **THEN** `findRhymes` SHALL throw an error so TanStack Query sets `isError: true`

---

### Requirement: useRhymeQuery TanStack Query hook
The system SHALL expose `useRhymeQuery(term: string)` in `src/modules/workspace/hooks/useRhymeQuery.ts` using `useInfiniteQuery`. The hook returns an infinite query where each page is a `RhymeResult`. `initialPageParam` is `0`. `getNextPageParam` returns the cumulative candidate count when `lastPage.hasMore` is `true`, otherwise `undefined`.

#### Scenario: Hook fetches first batch when term is non-empty
- **WHEN** `useRhymeQuery("dagat")` is called with a non-empty term
- **THEN** TanStack Query SHALL call `findRhymes("dagat", 0)` and return loading/success/error states

#### Scenario: `fetchNextPage` fetches the next offset
- **WHEN** `fetchNextPage()` is called and the previous page returned `hasMore: true`
- **THEN** TanStack Query SHALL call `findRhymes("dagat", <accumulated count>)` to retrieve the next batch

#### Scenario: Hook is disabled when term is empty
- **WHEN** `useRhymeQuery("")` is called with an empty string
- **THEN** TanStack Query SHALL NOT issue a fetch request (`enabled: false`)

#### Scenario: `hasNextPage` is false when last batch is partial
- **WHEN** the most recent `RhymeResult` has `hasMore: false`
- **THEN** `useRhymeQuery` SHALL expose `hasNextPage: false` so the UI can hide the "Load More" button

---

### Requirement: thesaurusKeys rhyme key signature unchanged
The `thesaurusKeys.rhyme` factory in `queryKeys.ts` SHALL accept only `term: string`. TanStack Query v5 `useInfiniteQuery` uses this as the root key — page params are managed internally and do not appear in the key factory.

#### Scenario: Rhyme key is scoped under thesaurus namespace
- **WHEN** `thesaurusKeys.rhyme("dagat")` is called
- **THEN** it SHALL return a query key that includes the `thesaurusKeys.all` prefix, "rhyme", and "dagat"

---

### Requirement: RhymeFinderTab molecule with scrollable results and Load More
The system SHALL update `RhymeFinderTab` in `src/modules/workspace/components/molecules/RhymeFinderTab.tsx` to use `useRhymeQuery` (which now returns an infinite query), flatten candidates across all pages, render them in a scrollable container, and show a "Load More" button while more candidates exist.

#### Scenario: User submits a rhyme query
- **WHEN** a user types a Bisaya word into the rhyme input and submits the form
- **THEN** the component SHALL invoke `useRhymeQuery` with the submitted word and display a loading state while pending

#### Scenario: Results displayed as chips grouped by rhyme type in a scrollable area
- **WHEN** rhyme results are returned
- **THEN** the component SHALL flatten candidates from all pages (`data.pages.flatMap(p => p.candidates)`), group them by `rhymeType` (PERFECT → FAMILY → ADDITIVE → ASSONANCE), and render chip groups inside a `div` with `overflow-y-auto` and a constrained max-height

#### Scenario: "Load More" button is visible when more candidates exist
- **WHEN** the current query result has `hasNextPage: true`
- **THEN** the component SHALL render a "Load More" button below the chip groups; the button SHALL be disabled and show a loading indicator while `isFetchingNextPage` is `true`

#### Scenario: "Load More" button is hidden when all candidates are loaded
- **WHEN** `hasNextPage` is `false`
- **THEN** the component SHALL NOT render the "Load More" button

#### Scenario: Clicking "Load More" appends the next batch
- **WHEN** the user clicks the "Load More" button
- **THEN** the component SHALL call `fetchNextPage()`; newly returned candidates SHALL be appended to the existing chip groups without replacing them

#### Scenario: Clicking a chip triggers Word Lookup navigation
- **WHEN** the user clicks a rhyme chip
- **THEN** the component SHALL call the `onSelectWord` callback prop with that chip's word so the parent can switch to the Word Lookup tab pre-filled with that word

#### Scenario: Empty state shown when no rhymes found
- **WHEN** the query returns an empty `candidates` array
- **THEN** the component SHALL display an empty-state message such as "No rhymes found for …"

#### Scenario: Error state shown on fetch failure
- **WHEN** `useRhymeQuery` returns `isError: true`
- **THEN** the component SHALL display an error message and allow the user to retry
