// @module: settings
// @layer: schema
// @scope: module
// @deps: zod

import { z } from "zod"

export const profileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const updateProfilePayloadSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must be 50 characters or less"),
  avatarUrl: z.string().url("Must be a valid URL").nullable().optional(),
})

export type Profile = z.infer<typeof profileSchema>
export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>
