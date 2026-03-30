# synonym-finder Specification

## Purpose
TBD - created by archiving change thesaurus-synonym-anagram-finder. Update Purpose after archive.
## Requirements
### Requirement: Synonym lookup via Route Handler
The system SHALL expose a Route Handler at `GET /api/thesaurus/synonyms?query=<term>` that calls `getSynonyms(term)` from `@junsayke/cebuano-thesaurus` server-side and returns a `SynonymResult` JSON response. The Route Handler SHALL run in the Node.js runtime (not Edge) because `@junsayke/cebuano-thesaurus` depends on `better-sqlite3`. Results SHALL be capped at 25 entries.

#### Scenario: Synonyms found for a known word
- **WHEN** the Route Handler receives a valid `query` parameter matching a known Cebuano word
- **THEN** the handler SHALL return `200` with a `SynonymResult` containing a non-empty `synonyms` array, each item having a `word` string and an optional `pos` string

#### Scenario: No synonyms found
- **WHEN** the Route Handler receives a `query` for a word with no synonym matches in the dictionary
- **THEN** the handler SHALL return `200` with a `SynonymResult` containing an empty `synonyms` array

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the handler SHALL return `400` with a JSON body `{ error: "query is required" }`

---

### Requirement: Client synonym service function
The `thesaurus.service.ts` client module SHALL export a `findSynonyms(term: string): Promise<SynonymResult>` function that fetches from `/api/thesaurus/synonyms?query=<term>` and throws on non-2xx responses.

#### Scenario: Service constructs correct URL
- **WHEN** `findSynonyms("buhat")` is called
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/synonyms?query=buhat`

#### Scenario: Service propagates errors
- **WHEN** the Route Handler returns a non-2xx status
- **THEN** `findSynonyms` SHALL throw so that TanStack Query sets `isError: true`

---

### Requirement: useSynonymQuery hook
A `useSynonymQuery(term: string)` TanStack Query hook SHALL exist in `src/modules/workspace/hooks/useSynonymQuery.ts`. It SHALL call `findSynonyms` when `term` is non-empty and be disabled when `term` is empty.

#### Scenario: Query enabled with non-empty term
- **WHEN** `useSynonymQuery("buhat")` is called with a non-empty term
- **THEN** the hook SHALL fire the query and return `{ result, isLoading, isError }`

#### Scenario: Query disabled with empty term
- **WHEN** `useSynonymQuery("")` is called with an empty string
- **THEN** the hook SHALL not fire any network request and `isLoading` SHALL be `false`

---

### Requirement: SynonymFinderTab molecule
A `SynonymFinderTab` molecule SHALL exist at `src/modules/workspace/components/molecules/SynonymFinderTab.tsx`. It SHALL render a controlled text input labeled "Query", a Results section, and a results table with WORD and CATEGORY columns.

#### Scenario: Initial empty state
- **WHEN** the `SynonymFinderTab` is first rendered with no submitted query
- **THEN** only the input and "Results" heading SHALL be visible; no table SHALL be rendered

#### Scenario: Loading state
- **WHEN** a query has been submitted and `isLoading` is `true`
- **THEN** an animated skeleton SHALL be displayed in place of the results table

#### Scenario: Results displayed
- **WHEN** the query resolves with one or more synonym entries
- **THEN** a table SHALL render each entry with the `word` in a purple interactive button (left column) and the `pos` value uppercased in the right CATEGORY column (showing "—" when `pos` is absent)

#### Scenario: Empty results state
- **WHEN** the query resolves with an empty `synonyms` array
- **THEN** a "No synonyms found" message SHALL be displayed

#### Scenario: Error state
- **WHEN** `isError` is `true`
- **THEN** a "Something went wrong. Please try again." message SHALL be displayed

#### Scenario: Clicking a synonym word navigates to Word Lookup
- **WHEN** the user clicks a word button in the synonyms table
- **THEN** the `onSelectWord(word)` callback SHALL be called with the clicked word's string value

---

### Requirement: SynonymFinderTab integrated into ThesaurusTabs
`ThesaurusTabs` SHALL render `SynonymFinderTab` when the active tab is `"synonyms"`, remove `"synonyms"` from `DISABLED_TABS`, and pass an `onSelectWord` handler that sets `activeWord` and switches the active tab to `"word-lookup"`.

#### Scenario: Synonyms tab is clickable
- **WHEN** the user clicks the "Synonyms" tab button in the Thesaurus panel
- **THEN** the tab SHALL become active (purple underline) and `SynonymFinderTab` SHALL be rendered

#### Scenario: Cross-tab navigation from synonym result
- **WHEN** the user clicks a word in the synonym results
- **THEN** the active tab SHALL switch to "Word Lookup" and the word input SHALL be pre-filled with the selected word

