/**
 * @module: settings
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import type { Database } from "@/shared/config/database.types"
import { ACCOUNT_STORAGE_LIMIT_BYTES } from "@/shared/constants/storage"
import type { Profile, UpdateProfilePayload } from "../types/settings.types"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getAuthUser() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user
}

async function getStorageUsageBytes(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("beat_files")
    .select("file_size_bytes")
    .eq("user_id", userId)

  if (error) throw error

  return (data ?? []).reduce((total, row) => total + (row.file_size_bytes ?? 0), 0)
}

function toProfile(row: ProfileRow, email: string): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    storageUsageBytes: 0,
    storageLimitBytes: ACCOUNT_STORAGE_LIMIT_BYTES,
  }
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getProfile(): Promise<Profile> {
  const authUser = await getAuthUser()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single()

  const email = authUser.email ?? ""

  // Self-healing: if profile doesn't exist yet (user created before trigger),
  // create one on the fly
  if (error && error.code === "PGRST116") {
    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .insert({ id: authUser.id, display_name: "" })
      .select()
      .single()

    if (insertError) throw insertError

    const profile = toProfile(inserted as ProfileRow, email)
    profile.storageUsageBytes = await getStorageUsageBytes(authUser.id)
    return profile
  }

  if (error) throw error

  const profile = toProfile(data as ProfileRow, email)
  profile.storageUsageBytes = await getStorageUsageBytes(authUser.id)
  return profile
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const authUser = await getAuthUser()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: payload.displayName,
      avatar_url: payload.avatarUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authUser.id)
    .select()
    .single()

  if (error) throw error

  return toProfile(data as ProfileRow, authUser.email ?? "")
}
