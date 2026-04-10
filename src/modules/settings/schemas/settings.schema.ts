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
  storageUsageBytes: z.number().int().nonnegative(),
  storageLimitBytes: z.number().int().positive(),
})

export const updateProfilePayloadSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must be 50 characters or less"),
  avatarUrl: z.string().url("Must be a valid URL").nullable().optional(),
})

export const updateEmailPayloadSchema = z.object({
  newEmail: z.string().email("Must be a valid email address"),
})

export const updatePasswordPayloadSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type Profile = z.infer<typeof profileSchema>
export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>
export type UpdateEmailPayload = z.infer<typeof updateEmailPayloadSchema>
export type UpdatePasswordPayload = z.infer<typeof updatePasswordPayloadSchema>
