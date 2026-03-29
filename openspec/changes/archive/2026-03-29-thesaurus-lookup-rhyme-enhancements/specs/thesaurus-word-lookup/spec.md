## MODIFIED Requirements

### Requirement: Cebuano word lookup via bundled dictionary
The system SHALL expose a Route Handler at `GET /api/thesaurus/lookup?query=<term>` that uses the `@junsayke/cebuano-thesaurus` package server-side to return a `WordLookupResult` JSON response. The Route Handler SHALL run in the Node.js runtime (not Edge) because `@junsayke/cebuano-thesaurus` depends on `better-sqlite3`.

#### Scenario: Exact match found
- **WHEN** the user submits a Bisaya term that has an exact entry in the dictionary
- **THEN** the Route Handler SHALL return `200` with a `WordLookupResult` containing non-empty `definitions`, `translations`, `homonyms` (from subentries), and `examples` populated from all `NormalizedSense.examples` across all senses

#### Scenario: No exact match — fuzzy fallback
- **WHEN** the user submits a term with no exact dictionary entry
- **THEN** the Route Handler SHALL call `fuzzySearch(term, 10)` and return a `WordLookupResult` where `definitions` is empty, `translations` is empty, `homonyms` is empty, and `suggestedWords` contains up to 10 matched headwords (each with `shortDefinition: "fuzzy match"`)

#### Scenario: Empty query rejected
- **WHEN** the Route Handler receives a request with a missing or blank `query` parameter
- **THEN** the Route Handler SHALL return `400` with a JSON error body `{ error: "query is required" }`

---

### Requirement: ThesaurusEntry mapped to WordLookupResult
The Route Handler SHALL map the `ThesaurusEntry` returned by `lookup()` into the `WordLookupResult` shape expected by the frontend without changing `WordResultCard` rendering logic other than adding the new sections.

#### Scenario: Definitions populated from senses
- **WHEN** a `ThesaurusEntry` has senses with translations
- **THEN** each translation string SHALL appear as a separate entry in `WordLookupResult.definitions`

#### Scenario: Translations populated
- **WHEN** a `ThesaurusEntry` has senses with translations
- **THEN** `WordLookupResult.translations` SHALL contain one item per translation with `language: "en"`

#### Scenario: Subentries mapped to homonyms
- **WHEN** a `ThesaurusEntry` has subentries
- **THEN** each subentry headword SHALL appear as a `HomonymEntry` in `WordLookupResult.homonyms`

#### Scenario: Examples populated from senses
- **WHEN** a `ThesaurusEntry` has senses with example sentences (i.e., `sense.examples` is non-empty for at least one sense)
- **THEN** `WordLookupResult.examples` SHALL contain every `{ cebuano, english }` pair from all senses, in order

#### Scenario: Examples is empty when no sense has examples
- **WHEN** a `ThesaurusEntry` has senses but none of them contain `examples`
- **THEN** `WordLookupResult.examples` SHALL be an empty array

---

## ADDED Requirements

### Requirement: WordLookupResult type includes examples and suggestedWords
`WordLookupResult` in `src/modules/workspace/types/thesaurus.types.ts` SHALL include two new optional fields: `examples: ExampleSentence[]` and `suggestedWords: HomonymEntry[]`. A new `ExampleSentence` interface SHALL be defined with `cebuano: string` and `english: string`.

#### Scenario: ExampleSentence shape
- **WHEN** a `WordLookupResult` is constructed for a word with examples
- **THEN** `examples` SHALL be an array of objects each having `cebuano: string` and `english: string`

#### Scenario: suggestedWords present on fuzzy fallback
- **WHEN** the Route Handler falls back to fuzzy search
- **THEN** `WordLookupResult.suggestedWords` SHALL contain `HomonymEntry[]` and `WordLookupResult.homonyms` SHALL be an empty array

#### Scenario: suggestedWords absent on exact match
- **WHEN** the Route Handler finds an exact match
- **THEN** `WordLookupResult.suggestedWords` SHALL be an empty array

---

### Requirement: WordResultCard renders example sentences
`WordResultCard` SHALL render a collapsible "Examples" section below the Definitions section when `result.examples` is non-empty. Each example SHALL display the Cebuano sentence and its English translation.

#### Scenario: Examples section visible when examples present
- **WHEN** `result.examples` contains at least one entry
- **THEN** `WordResultCard` SHALL render a collapsible "Examples" section with each entry showing `cebuano` text and `english` text

#### Scenario: Examples section hidden when examples empty
- **WHEN** `result.examples` is empty or undefined
- **THEN** `WordResultCard` SHALL NOT render the Examples section at all

---

### Requirement: WordResultCard displays Suggested Words instead of Homonyms on fuzzy results
When `result.suggestedWords` is non-empty, `WordResultCard` SHALL render a "Suggested Words" section (in place of the Homonyms section) as a plain clickable list of word buttons. Each item in the list SHALL be a `<button>` styled as a text row that calls the `onHomonymClick` callback with the word on click. The "Homonyms" section SHALL only be rendered when `result.homonyms` is non-empty.

#### Scenario: Suggested Words shown as a list on fuzzy fallback
- **WHEN** `result.suggestedWords` is non-empty and `result.homonyms` is empty
- **THEN** `WordResultCard` SHALL render a "Suggested Words" section with one clickable list item per `suggestedWords` entry, and SHALL NOT render a "Homonyms" section

#### Scenario: Clicking a suggested word triggers a new lookup
- **WHEN** the user clicks a suggested word row
- **THEN** `WordResultCard` SHALL call `onHomonymClick` with that word's string, triggering a new lookup in `WordLookupTab`

#### Scenario: Homonyms shown on exact match
- **WHEN** `result.homonyms` is non-empty and `result.suggestedWords` is empty
- **THEN** `WordResultCard` SHALL render the "Homonyms" section and SHALL NOT render a "Suggested Words" section

#### Scenario: Neither section shown when both empty
- **WHEN** both `result.homonyms` and `result.suggestedWords` are empty
- **THEN** `WordResultCard` SHALL NOT render either the Homonyms or Suggested Words section
