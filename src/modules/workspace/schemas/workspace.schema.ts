import { z } from "zod"

export const sectionTypeSchema = z.enum(["verse", "chorus", "bridge", "hook", "outro"])

export const barSchema = z.object({
  id: z.string(),
  text: z.string(),
  /** Section key e.g. "verse-1", "verse-2", "chorus" */
  section: z.string(),
  order: z.number().int().nonnegative(),
})

export const beatSchema = z.object({
  beatFileId: z.string(),
  beatStorageUrl: z.string(),
  bpm: z.number().nullable(),
  fileName: z.string(),
})

export const writingSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  bars: z.array(barSchema),
  beat: beatSchema.nullable().optional(),
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

export const createSessionPayloadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topic: z.string().optional(),
})

export const createSessionResponseSchema = sessionSummarySchema

// ---------------------------------------------------------------------------
// Beat Link schemas
// ---------------------------------------------------------------------------

export const spotifyLinkSchema = z.string().regex(
  /^https:\/\/open\.spotify\.com\/(intl-[a-z-]+\/)?(track|album|playlist)\/[A-Za-z0-9]+(\?.*)?$/,
  "Invalid Spotify URL. Use a Spotify track, album, or playlist link."
)

export const youtubeLinkSchema = z.string().regex(
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:[^&]*&)*v=[A-Za-z0-9_-]{11}|youtu\.be\/[A-Za-z0-9_-]{11})/,
  "Invalid YouTube URL."
)

export const soundcloudLinkSchema = z.string().regex(
  /^https?:\/\/soundcloud\.com\/[^/?#]+\/[^/?#]+/,
  "Invalid SoundCloud URL."
)

export const beatLinkUrlSchema = z
  .string()
  .refine(
    (val) =>
      /open\.spotify\.com\/(intl-[a-z-]+\/)?(track|album|playlist)\/[A-Za-z0-9]+/.test(val) ||
      /(?:youtube\.com\/watch\?(?:[^&]*&)*v=[A-Za-z0-9_-]{11}|youtu\.be\/[A-Za-z0-9_-]{11})/.test(val) ||
      /soundcloud\.com\/[^/?#]+\/[^/?#]+/.test(val),
    { message: "Invalid URL. Paste a link from Spotify, YouTube, or SoundCloud." }
  )

export const beatLinkSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  url: z.string(),
  provider: z.string(),
  bpm: z.number().nullable(),
})

export type SectionType = z.infer<typeof sectionTypeSchema>
export type Bar = z.infer<typeof barSchema>
export type Beat = z.infer<typeof beatSchema>
export type WritingSession = z.infer<typeof writingSessionSchema>
export type SaveDraftPayload = z.infer<typeof saveDraftPayloadSchema>
export type SaveResult = z.infer<typeof saveResultSchema>
export type ThumbnailType = z.infer<typeof thumbnailTypeSchema>
export type SessionSummary = z.infer<typeof sessionSummarySchema>
export type RenameSessionPayload = z.infer<typeof renameSessionPayloadSchema>
export type RenameSessionResponse = z.infer<typeof renameSessionResponseSchema>
export type CreateSessionPayload = z.infer<typeof createSessionPayloadSchema>
export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>
export type BeatLink = z.infer<typeof beatLinkSchema>
