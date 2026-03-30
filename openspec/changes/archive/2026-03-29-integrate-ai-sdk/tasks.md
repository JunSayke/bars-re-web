## 1. Setup & Infrastructure

- [x] 1.1 Install `ai` and `@ai-sdk/openai` dependencies via pnpm
- [x] 1.2 Add `GROQ_API_KEY` to environment variables (`.env.example` and local `.env.local`)
- [x] 1.3 Create shared Groq client configuration at `src/shared/lib/ai/groq.client.ts`

## 2. Workspace AI Integration

- [x] 2.1 Create localized Zod schema for structured AI feedback at `src/modules/workspace/schemas/ai-feedback.schema.ts`
- [x] 2.2 Implement the Next.js Server Action using `generateObject` at `src/modules/workspace/actions/get-feedback.action.ts`
