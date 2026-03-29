## MODIFIED Requirements

### Requirement: WordLookupTab accepts external pre-fill term
`WordLookupTab` SHALL accept an optional `initialTerm?: string` prop. When `initialTerm` changes to a non-empty value, the component SHALL update its `inputValue` and `submittedTerm` state to that value, immediately triggering a lookup without requiring the user to click submit.

#### Scenario: initialTerm provided on mount
- **WHEN** `WordLookupTab` is rendered with `initialTerm="dagat"`
- **THEN** the input SHALL be pre-filled with "dagat" and the lookup query SHALL fire automatically

#### Scenario: initialTerm changes after mount
- **WHEN** `initialTerm` prop changes from one non-empty word to another (e.g., from a rhyme chip click)
- **THEN** `WordLookupTab` SHALL update its controlled input and re-run the query for the new word

#### Scenario: Empty initialTerm does not reset ongoing query
- **WHEN** `initialTerm` is `undefined` or `""`
- **THEN** `WordLookupTab` SHALL behave identically to its current behavior (user drives input manually)
