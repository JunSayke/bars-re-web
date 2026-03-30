## ADDED Requirements

### Requirement: Shared AI Client Initialization
The system SHALL provide a shared, centrally configured AI client using the Vercel AI SDK and the Groq provider.

#### Scenario: Successful initialization
- **WHEN** the server initializes the AI client
- **THEN** it configures the `@ai-sdk/openai` instance with the Groq base URL (`https://api.groq.com/openai/v1`) and the `GROQ_API_KEY` from the environment.

### Requirement: AI Environment Configuration
The system SHALL require specific environment variables to authorize AI requests.

#### Scenario: Missing API key handling
- **WHEN** the system attempts to execute an AI server action but `GROQ_API_KEY` is undefined
- **THEN** the action throws a clear, handled error indicating missing AI configuration.
