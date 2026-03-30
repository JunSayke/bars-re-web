# anagram-finder Specification

## Purpose
TBD - created by archiving change thesaurus-synonym-anagram-finder. Update Purpose after archive.
## Requirements
### Requirement: Anagram lookup via Route Handler
The system SHALL expose a Route Handler at `GET /api/thesaurus/anagrams?query=<term>` that calls `getAnagrams(term, 25)` from `@junsayke/cebuano-thesaurus` server-side and returns an `AnagramResult` JSON response. The Route Handler SHALL run in the Node.js runtime (not Edge) because `@junsayke/cebuano-thesaurus` depends on `better-sqlite3`.

#### Scenario: Anagrams found for a known word
- **WHEN** the Route Handler receives a valid `query` parameter for a word that has anagram matches
- **THEN** the handler SHALL return `200` with an `AnagramResult` containing a non-empty `anagrams` array, each item having a `word` string and an optional `pos` string

#### Scenario: No anagrams found
- **WHEN** the Route Handler receives a `query` for a word with no anagram matches in the dictionary
- **THEN** the handler SHALL return `200` with an `AnagramResult` containing an empty `anagrams` array

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the handler SHALL return `400` with a JSON body `{ error: "query is required" }`

---

### Requirement: Client anagram service function
The `thesaurus.service.ts` client module SHALL export a `findAnagrams(term: string): Promise<AnagramResult>` function that fetches from `/api/thesaurus/anagrams?query=<term>` and throws on non-2xx responses.

#### Scenario: Service constructs correct URL
- **WHEN** `findAnagrams("bato")` is called
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/anagrams?query=bato`

#### Scenario: Service propagates errors
- **WHEN** the Route Handler returns a non-2xx status
- **THEN** `findAnagrams` SHALL throw so that TanStack Query sets `isError: true`

---

### Requirement: useAnagramQuery hook
A `useAnagramQuery(term: string)` TanStack Query hook SHALL exist in `src/modules/workspace/hooks/useAnagramQuery.ts`. It SHALL call `findAnagrams` when `term` is non-empty and be disabled when `term` is empty.

#### Scenario: Query enabled with non-empty term
- **WHEN** `useAnagramQuery("bato")` is called with a non-empty term
- **THEN** the hook SHALL fire the query and return `{ result, isLoading, isError }`

#### Scenario: Query disabled with empty term
- **WHEN** `useAnagramQuery("")` is called with an empty string
- **THEN** the hook SHALL not fire any network request and `isLoading` SHALL be `false`

---

### Requirement: AnagramFinderTab molecule
An `AnagramFinderTab` molecule SHALL exist at `src/modules/workspace/components/molecules/AnagramFinderTab.tsx`. It SHALL render a controlled text input labeled "Query", a Results section, and a results table with WORD and POS columns.

#### Scenario: Initial empty state
- **WHEN** the `AnagramFinderTab` is first rendered with no submitted query
- **THEN** only the input and "Results" heading SHALL be visible; no table SHALL be rendered

#### Scenario: Loading state
- **WHEN** a query has been submitted and `isLoading` is `true`
- **THEN** an animated skeleton SHALL be displayed in place of the results table

#### Scenario: Results displayed
- **WHEN** the query resolves with one or more anagram entries
- **THEN** a table SHALL render each entry with the `word` in a purple interactive button (left column) and the `pos` value uppercased in the right POS column (showing "—" when `pos` is absent)

#### Scenario: Empty results state
- **WHEN** the query resolves with an empty `anagrams` array
- **THEN** a "No anagrams found" message SHALL be displayed

#### Scenario: Error state
- **WHEN** `isError` is `true`
- **THEN** a "Something went wrong. Please try again." message SHALL be displayed

#### Scenario: Clicking an anagram word navigates to Word Lookup
- **WHEN** the user clicks a word button in the anagrams table
- **THEN** the `onSelectWord(word)` callback SHALL be called with the clicked word's string value

---

### Requirement: AnagramFinderTab integrated into ThesaurusTabs
`ThesaurusTabs` SHALL render `AnagramFinderTab` when the active tab is `"anagrams"`, remove `"anagrams"` from `DISABLED_TABS`, and pass an `onSelectWord` handler that sets `activeWord` and switches the active tab to `"word-lookup"`.

#### Scenario: Anagrams tab is clickable
- **WHEN** the user clicks the "Anagrams" tab button in the Thesaurus panel
- **THEN** the tab SHALL become active (purple underline) and `AnagramFinderTab` SHALL be rendered

#### Scenario: Cross-tab navigation from anagram result
- **WHEN** the user clicks a word in the anagram results
- **THEN** the active tab SHALL switch to "Word Lookup" and the word input SHALL be pre-filled with the selected word

