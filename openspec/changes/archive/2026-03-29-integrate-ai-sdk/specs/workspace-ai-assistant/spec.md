## ADDED Requirements

### Requirement: Localized Schema Validation
The workspace module SHALL define its own strict Zod schema for structured AI feedback, maintaining the vertical slice architecture boundary.

#### Scenario: Validating structured AI output
- **WHEN** the AI provider returns a JSON payload for lyrics feedback
- **THEN** the system validates it against the workspace-specific Zod schema before returning it to the client.

### Requirement: Server Action for Lyrics Feedback
The workspace module SHALL expose a Next.js Server Action to request structured AI feedback on lyrics.

#### Scenario: Requesting feedback on a verse
- **WHEN** the client calls the feedback server action with lyrics text
- **THEN** the server action uses `generateObject` from the Vercel AI SDK with the shared Groq client and the localized schema to return typed feedback (e.g., score, flow issues, suggestions).
