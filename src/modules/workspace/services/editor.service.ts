/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import { barSchema } from "../schemas/workspace.schema"
import type { Bar, WritingSession, SaveDraftPayload } from "../schemas/workspace.schema"

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
    .select("id, title, bar_content, editor_zoom, beat_files(id, storage_path, bpm, file_size_bytes, source_type)")
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
    editorZoom: data.editor_zoom ?? null,
  }
}

export async function saveDraft(
  sessionId: string,
  payload: SaveDraftPayload
): Promise<{ success: boolean }> {
  const userId = await getAuthUser()

  const updateObj: Record<string, unknown> = {
    bar_content: JSON.stringify(payload.bars),
    last_modified_at: new Date().toISOString(),
  }
  if (payload.editorZoom !== undefined) updateObj.editor_zoom = payload.editorZoom

  const { error } = await supabase
    .from("sessions")
    .update(updateObj)
    .eq("id", sessionId)
    .eq("user_id", userId)

  if (error) throw error

  return { success: true }
}
