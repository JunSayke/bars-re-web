## ADDED Requirements

### Requirement: Rhyme query Route Handler
The system SHALL expose a Route Handler at `GET /api/thesaurus/rhyme?query=<term>` that calls `getRhymes(term, { limit: 20, maxSyllableOffset: 1 })` from `@junsayke/cebuano-thesaurus` server-side (Node.js runtime, not Edge). The Route Handler SHALL return a `RhymeResult` JSON response.

#### Scenario: Rhymes found for a known word
- **WHEN** a GET request is made with a valid Bisaya word (e.g., `?query=dagat`)
- **THEN** the Route Handler SHALL return `200` with a `RhymeResult` where `candidates` is a non-empty array of `RhymeCandidate` objects, each containing `word`, `rhymeType`, `score`, and `syllableCount`

#### Scenario: No rhymes found
- **WHEN** a GET request is made with a word that yields zero rhyme candidates
- **THEN** the Route Handler SHALL return `200` with a `RhymeResult` where `candidates` is an empty array

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the Route Handler SHALL return `400` with `{ error: "query is required" }`

---

### Requirement: RhymeResult and RhymeCandidate types
The system SHALL define `RhymeCandidate` and `RhymeResult` in `src/modules/workspace/types/thesaurus.types.ts`.

#### Scenario: RhymeCandidate shape
- **WHEN** the Route Handler maps a result from `getRhymes()`
- **THEN** each `RhymeCandidate` SHALL have: `word: string`, `rhymeType: "perfect" | "family" | "additive" | "assonance"`, `score: number`, `syllableCount: number`

#### Scenario: RhymeResult shape
- **WHEN** the Route Handler serializes its response
- **THEN** the response SHALL have shape `{ query: string, candidates: RhymeCandidate[] }`

---

### Requirement: Client service findRhymes function
The `findRhymes` function in `thesaurus.service.ts` SHALL call `GET /api/thesaurus/rhyme?query=<term>` and return a `RhymeResult`.

#### Scenario: Service constructs correct URL
- **WHEN** `findRhymes("dagat")` is called in the browser
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/rhyme?query=dagat`

#### Scenario: Service handles non-OK response
- **WHEN** the Route Handler returns a non-2xx status
- **THEN** `findRhymes` SHALL throw an error so TanStack Query sets `isError: true`

---

### Requirement: useRhymeQuery TanStack Query hook
The system SHALL expose `useRhymeQuery(term: string)` in `src/modules/workspace/hooks/useRhymeQuery.ts` that wraps `findRhymes` using TanStack Query.

#### Scenario: Hook calls service when term is non-empty
- **WHEN** `useRhymeQuery("dagat")` is called with a non-empty term
- **THEN** TanStack Query SHALL call `findRhymes("dagat")` and return loading/success/error states

#### Scenario: Hook is disabled when term is empty
- **WHEN** `useRhymeQuery("")` is called with an empty string
- **THEN** TanStack Query SHALL NOT issue a fetch request (`enabled: false`)

---

### Requirement: thesaurusKeys includes rhyme key
The `thesaurusKeys` query key factory in `queryKeys.ts` SHALL include a `rhyme(term: string)` method.

#### Scenario: Rhyme key is scoped under thesaurus namespace
- **WHEN** `thesaurusKeys.rhyme("dagat")` is called
- **THEN** it SHALL return a query key that includes the `thesaurusKeys.all` prefix and "rhyme" and "dagat"

---

### Requirement: RhymeFinderTab molecule
The system SHALL implement `RhymeFinderTab` in `src/modules/workspace/components/molecules/RhymeFinderTab.tsx` that renders the Rhyme tab content.

#### Scenario: User submits a rhyme query
- **WHEN** a user types a Bisaya word into the rhyme input and submits the form
- **THEN** the component SHALL invoke `useRhymeQuery` with the submitted word and display a loading state while pending

#### Scenario: Results displayed as chips grouped by rhyme type
- **WHEN** rhyme results are returned
- **THEN** the component SHALL display chips grouped by type in order: PERFECT → FAMILY → ADDITIVE → ASSONANCE, hiding any empty groups; each chip SHALL show the rhyming word

#### Scenario: Clicking a chip triggers Word Lookup navigation
- **WHEN** the user clicks a rhyme chip
- **THEN** the component SHALL call the `onSelectWord` callback prop with that chip's word so the parent can switch to the Word Lookup tab pre-filled with that word

#### Scenario: Empty state shown when no rhymes found
- **WHEN** the query returns an empty `candidates` array
- **THEN** the component SHALL display an empty-state message such as "No rhymes found for …"

#### Scenario: Error state shown on fetch failure
- **WHEN** `useRhymeQuery` returns `isError: true`
- **THEN** the component SHALL display an error message and allow the user to retry

---

### Requirement: Rhyme tab enabled in ThesaurusTabs
The "Rhyme" tab in `ThesaurusTabs` SHALL be enabled and render `RhymeFinderTab` when active.

#### Scenario: Rhyme tab is clickable
- **WHEN** the Thesaurus panel is rendered
- **THEN** the "Rhyme" tab SHALL not have `isDisabled={true}` and SHALL be clickable by the user

#### Scenario: RhymeFinderTab renders when Rhyme tab is active
- **WHEN** the user clicks the "Rhyme" tab
- **THEN** `ThesaurusTabs` SHALL render `RhymeFinderTab` in the tab content area

#### Scenario: Clicking a rhyme result word switches to Word Lookup tab
- **WHEN** the user clicks a rhyme chip from `RhymeFinderTab`
- **THEN** `ThesaurusTabs` SHALL set `activeTab` to `"word-lookup"` and pass the selected word as `initialTerm` to `WordLookupTab`
