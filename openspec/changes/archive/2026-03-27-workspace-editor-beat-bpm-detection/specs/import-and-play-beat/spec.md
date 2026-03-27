## MODIFIED Requirements

### Requirement: BPM badge is displayed alongside the player controls
The system SHALL display the BPM value detected at upload time as a read-only badge, sourced from `beat_files.bpm`. In the mock environment, the mock handler SHALL continue to return BPM = 120. In production, the badge SHALL reflect the real detected value stored in Supabase. A `null` BPM SHALL render the badge in its empty/placeholder state (existing behavior, unchanged).

#### Scenario: BPM badge shows real detected value in production
- **WHEN** the beat has been uploaded, detection succeeded, and `beat_files.bpm` is non-null
- **THEN** the `BpmBadge` SHALL display the detected integer followed by "BPM" (e.g., "93 BPM")

#### Scenario: BPM badge is empty when detection returned null
- **WHEN** `beat_files.bpm` is `null` (detection failed or was skipped)
- **THEN** the `BpmBadge` SHALL render in its null/empty state without displaying a number

#### Scenario: BPM badge uses mock value during development
- **WHEN** the application is running with MSW mocks active and a beat is uploaded
- **THEN** the `BpmBadge` SHALL display "120 BPM" as returned by the mock handler
