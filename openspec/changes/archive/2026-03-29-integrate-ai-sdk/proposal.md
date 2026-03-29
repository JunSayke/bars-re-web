## Why

To power the core features of the Bisaya AI Rap System (such as lyrics feedback, thesaurus wordplay, and ideation), we need a robust AI integration. Implementing this now establishes a scalable, decoupled foundation using the Vercel AI SDK and Groq. This ensures all current and future AI features can be added efficiently while strictly adhering to our Vertical Slice architecture.

## What Changes

- Add the Vercel AI SDK (`ai` and `@ai-sdk/openai`) to the project dependencies.
- Create a shared Groq AI client configuration in the shared library layer (`src/shared/lib/ai/groq.client.ts`).
- Establish an architectural pattern for localized AI features: placing Zod schemas and Next.js Server Actions (using `generateObject`) inside their respective feature modules rather than a global AI folder.
- Add required environment variables (`GROQ_API_KEY`).

## Capabilities

### New Capabilities
- `ai-core-infrastructure`: Core shared setup, client initialization, and configuration for the Vercel AI SDK communicating with Groq.
- `workspace-ai-assistant`: Structured data generation for lyrics feedback, flow issues, and suggestions scoped specifically to the workspace module.

### Modified Capabilities
*(None)*

## Impact

- **Dependencies:** Adds `ai` and `@ai-sdk/openai` to the project.
- **Environment:** Requires adding `GROQ_API_KEY` to `.env.local` and deployment environments.
- **Architecture:** Formalizes a strict pattern preventing monolithic AI modules; enforces module-level ownership of AI schemas and actions.
