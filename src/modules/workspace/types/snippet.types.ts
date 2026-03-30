import type { z } from "zod"
import type {
  snippetTagSchema,
  snippetSchema,
  createSnippetPayloadSchema,
  updateSnippetPayloadSchema,
} from "../schemas/snippet.schema"

export type SnippetTag = z.infer<typeof snippetTagSchema>
export type Snippet = z.infer<typeof snippetSchema>
export type CreateSnippetPayload = z.infer<typeof createSnippetPayloadSchema>
export type UpdateSnippetPayload = z.infer<typeof updateSnippetPayloadSchema>
