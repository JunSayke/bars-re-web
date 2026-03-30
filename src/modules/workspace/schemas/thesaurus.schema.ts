import { z } from "zod"

export const homonymEntrySchema = z.object({
  word: z.string(),
  partOfSpeech: z.string().optional(),
  shortDefinition: z.string().optional(),
})

export const translationEntrySchema = z.object({
  language: z.string(),
  translation: z.string(),
})

export const wordLookupResultSchema = z.object({
  word: z.string(),
  definitions: z.array(z.string()),
  homonyms: z.array(homonymEntrySchema),
  translations: z.array(translationEntrySchema),
})
