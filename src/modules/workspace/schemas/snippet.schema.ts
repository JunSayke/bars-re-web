import { z } from "zod"

export const snippetTagSchema = z.enum(["Chorus", "Verse", "Hook", "Freestyle", "Bridge"])

export const snippetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(snippetTagSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createSnippetPayloadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(snippetTagSchema),
})

export const updateSnippetPayloadSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.array(snippetTagSchema).optional(),
})
