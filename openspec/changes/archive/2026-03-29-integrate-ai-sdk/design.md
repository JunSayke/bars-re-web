## Context

The Bisaya AI Rap System (BARS) requires AI capabilities to provide intelligent features like lyrics feedback, rhyme suggestions, and thesaurus wordplay. To implement this cleanly within our Next.js App Router setup, we are integrating the Vercel AI SDK and using Groq as our fast inference provider. 

This design document outlines how we will introduce these AI capabilities while strictly adhering to our Vertical Slice architecture, ensuring AI logic doesn't become a tangled, monolithic global module.

## Goals / Non-Goals

**Goals:**
- Provide a standardized way to call LLMs via the Vercel AI SDK.
- Configure Groq securely as the default model provider.
- Establish a reproducible pattern for creating typed, structured AI responses (JSON) using Zod schemas.
- Ensure all AI schemas and feature-specific prompts remain localized to their respective feature modules (e.g., `workspace`).

**Non-Goals:**
- Building out the entire AI Assistant UI (this change focuses on the infrastructure and the first end-to-end server action).
- Implementing continuous text streaming (e.g., `streamText` for a ChatGPT-like UI). We are focusing purely on structured data extraction (`generateObject`) for actionable UI feedback.
- Migrating or altering the existing Supabase BaaS implementation.

## Decisions

### 1. Vercel AI SDK with OpenAI Provider for Groq
We will use `@ai-sdk/openai` configured with Groq's base URL (`https://api.groq.com/openai/v1`). Groq provides near-instant inference, which is critical for real-time editor feedback, and it is fully compatible with the OpenAI SDK interface. 

### 2. Shared AI Client Initialization
**Decision:** Create a singleton AI client in `src/shared/lib/ai/groq.client.ts`.
**Rationale:** While features are vertically sliced, third-party provider configuration (like database clients or AI clients) belongs in `shared`. This prevents repeating the `GROQ_API_KEY` and base URL setup across multiple modules.

### 3. Next.js Server Actions over Route Handlers
**Decision:** AI generation will be invoked via `use server` actions (e.g., `src/modules/workspace/actions/get-feedback.action.ts`) rather than API Route Handlers (`app/api/...`).
**Rationale:** We need structured JSON data (scores, flow issues), not raw text streams. Server Actions allow us to call `generateObject`, parse the result on the server, and return fully typed objects directly to our React components without manual `fetch` calls.

### 4. Localized Zod Schemas
**Decision:** The Zod schemas defining the shape of the AI's response must live inside the specific module (e.g., `src/modules/workspace/schemas/ai-feedback.schema.ts`).
**Rationale:** This enforces the Vertical Slice pattern. The `workspace` module owns the definition of what "feedback" looks like. If the `thesaurus` module later needs AI, it will define its own completely separate schema.

## Risks / Trade-offs

- **[Risk] Groq Rate Limits / Downtime:** If the provider goes down, the editor features will fail.
  - **Mitigation:** Wrap the `generateObject` call in a `try/catch` and return graceful fallback error messages to the client so the core app remains usable.
- **[Risk] AI Hallucination / Schema Adherence:** The LLM might fail to generate valid JSON matching our Zod schema.
  - **Mitigation:** The Vercel AI SDK automatically retries and handles schema validation for `generateObject`. We will ensure prompts strictly instruct the model on the expected format.
