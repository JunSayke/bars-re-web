/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import { barSchema } from "../schemas/workspace.schema"
import type { Bar, WritingSession } from "../schemas/workspace.schema"

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getAuthUser(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user.id
}

function deserializeBars(barContent: string | null): Bar[] {
  if (!barContent) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(barContent)
  } catch {
    console.warn("Failed to parse bar_content JSON")
    return []
  }

  const result = barSchema.array().safeParse(parsed)
  if (result.success) return result.data

  // JSON is valid but schema validation failed — data exists but is corrupted
  throw new Error(
    `bar_content failed schema validation: ${result.error.message}`
  )
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getSession(sessionId: string): Promise<WritingSession> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, bar_content, beat_files(id, storage_path, bpm, file_size_bytes, source_type)")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  const bars = deserializeBars(data.bar_content)

  let beat: WritingSession["beat"] = undefined
  const beatFiles = Array.isArray(data.beat_files)
    ? data.beat_files
    : data.beat_files
      ? [data.beat_files]
      : []
  const beatFile = beatFiles[0] as
    | { id: string; storage_path: string; bpm: number | null }
    | undefined

  if (beatFile) {
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("beats")
      .createSignedUrl(beatFile.storage_path, 3600)

    if (signedUrlError) {
      console.warn("Failed to create signed URL for beat:", signedUrlError.message)
    }

    const fileName =
      beatFile.storage_path.split("/").pop()?.replace(/^\d+-/, "") ?? ""

    beat = {
      beatFileId: beatFile.id,
      beatStorageUrl: signedUrlData?.signedUrl ?? "",
      bpm: beatFile.bpm,
      fileName,
    }
  }

  return {
    id: data.id,
    title: data.title,
    bars,
    beat,
  }
}

export async function saveDraft(
  sessionId: string,
  bars: Bar[]
): Promise<{ success: boolean }> {
  const userId = await getAuthUser()

  const serialized = JSON.stringify(bars)

  const { error } = await supabase
    .from("sessions")
    .update({ bar_content: serialized, last_modified_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", userId)

  if (error) throw error

  return { success: true }
}
