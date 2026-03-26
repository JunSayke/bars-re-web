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

export type SectionType = z.infer<typeof sectionTypeSchema>
export type Bar = z.infer<typeof barSchema>
export type WritingSession = z.infer<typeof writingSessionSchema>
export type SaveDraftPayload = z.infer<typeof saveDraftPayloadSchema>
export type SaveResult = z.infer<typeof saveResultSchema>
