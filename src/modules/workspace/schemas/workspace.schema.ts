import { z } from "zod"

export const sectionTypeSchema = z.enum(["verse", "chorus", "bridge", "hook", "outro"])

export const barSchema = z.object({
  id: z.string(),
  text: z.string(),
  /** Section key e.g. "verse-1", "verse-2", "chorus" */
  section: z.string(),
  order: z.number().int().nonnegative(),
})

export const writingSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  bars: z.array(barSchema),
})

export const saveDraftPayloadSchema = z.object({
  bars: z.array(barSchema),
})

export const saveResultSchema = z.object({
  success: z.boolean(),
})

export const thumbnailTypeSchema = z.enum(["lyrics", "beat-linked"])

export const sessionSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  previewSnippet: z.string(),
  thumbnailType: thumbnailTypeSchema,
  lastModifiedAt: z.string(),
})

export const renameSessionPayloadSchema = z.object({
  title: z.string(),
})

export const renameSessionResponseSchema = sessionSummarySchema

export type SectionType = z.infer<typeof sectionTypeSchema>
export type Bar = z.infer<typeof barSchema>
export type WritingSession = z.infer<typeof writingSessionSchema>
export type SaveDraftPayload = z.infer<typeof saveDraftPayloadSchema>
export type SaveResult = z.infer<typeof saveResultSchema>
export type ThumbnailType = z.infer<typeof thumbnailTypeSchema>
export type SessionSummary = z.infer<typeof sessionSummarySchema>
export type RenameSessionPayload = z.infer<typeof renameSessionPayloadSchema>
export type RenameSessionResponse = z.infer<typeof renameSessionResponseSchema>
