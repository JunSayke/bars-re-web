## ADDED Requirements

### Requirement: Cebuano word lookup via bundled dictionary
The system SHALL expose a Route Handler at `GET /api/thesaurus/lookup?query=<term>` that uses the `@junsayke/cebuano-thesaurus` package server-side to return a `WordLookupResult` JSON response. The Route Handler SHALL run in the Node.js runtime (not Edge) because `@junsayke/cebuano-thesaurus` depends on `better-sqlite3`.

#### Scenario: Exact match found
- **WHEN** the user submits a Bisaya term that has an exact entry in the dictionary
- **THEN** the Route Handler SHALL return `200` with a `WordLookupResult` containing non-empty `definitions`, `translations`, and `homonyms` populated from subentries

#### Scenario: No exact match — fuzzy fallback
- **WHEN** the user submits a term with no exact dictionary entry
- **THEN** the Route Handler SHALL call `fuzzySearch(term, 10)` and return a `WordLookupResult` where `definitions` is empty, `translations` is empty, and `homonyms` contains up to 10 matched headwords (each with `shortDefinition: "fuzzy match"`)

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the Route Handler SHALL return `400` with a JSON error body `{ error: "query is required" }`

### Requirement: Client service calls internal Route Handler
The `lookupWord` function in `thesaurus.service.ts` SHALL call the internal Next.js Route Handler at `/api/thesaurus/lookup?query=<term>` instead of an external API base URL.

#### Scenario: Service constructs correct URL
- **WHEN** `lookupWord("dagat")` is called in the browser
- **THEN** the fetch request SHALL be sent to `/api/thesaurus/lookup?query=dagat`

#### Scenario: Service handles non-OK response
- **WHEN** the Route Handler returns a non-2xx status
- **THEN** `lookupWord` SHALL throw an error so TanStack Query sets `isError: true`

### Requirement: ThesaurusEntry mapped to WordLookupResult
The Route Handler SHALL map the `ThesaurusEntry` returned by `lookup()` into the `WordLookupResult` shape expected by the frontend without changing `WordLookupResult`, `WordLookupTab`, or `WordResultCard`.

#### Scenario: Definitions populated from senses
- **WHEN** a `ThesaurusEntry` has senses with translations
- **THEN** each translation string SHALL appear as a separate entry in `WordLookupResult.definitions`

#### Scenario: Translations populated
- **WHEN** a `ThesaurusEntry` has senses with translations
- **THEN** `WordLookupResult.translations` SHALL contain one item per translation with `language: "en"`

#### Scenario: Subentries mapped to homonyms
- **WHEN** a `ThesaurusEntry` has subentries
- **THEN** each subentry headword SHALL appear as a `HomonymEntry` in `WordLookupResult.homonyms`
