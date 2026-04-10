/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import { ACCOUNT_STORAGE_LIMIT_BYTES } from "@/shared/constants/storage"
import type { Beat } from "../schemas/workspace.schema"
import { detectBpm } from "../utils/beat.utils"

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getAuthUser(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user.id
}

function sanitizeFileName(name: string): string {
  const lastDot = name.lastIndexOf(".")
  const ext = lastDot !== -1 ? name.slice(lastDot) : ""
  const base = lastDot !== -1 ? name.slice(0, lastDot) : name
  const sanitized = base
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return `${sanitized}${ext}`
}

function deriveBeatName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".")
  return (lastDot !== -1 ? fileName.slice(0, lastDot) : fileName).trim() || "Untitled Beat"
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function uploadBeat(sessionId: string, file: File): Promise<Beat> {
  const userId = await getAuthUser()

  // Read session and its metadata to determine any existing beat_file for this session
  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .select("id, metadata")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single()

  if (sessionError) throw sessionError
  if (!sessionData) throw new Error("Session not found")

  const existingBeatFileId = (sessionData.metadata as any)?.beat_file_id as string | undefined

  // Compute current usage across all sessions for user
  const { data: userSessions, error: userSessionsError } = await supabase
    .from("sessions")
    .select("id")
    .eq("user_id", userId)

  if (userSessionsError) throw userSessionsError

  const sessionIds = (userSessions ?? []).map((s) => s.id)
  let currentUsage = 0

  if (sessionIds.length > 0) {
    const { data: beatRows, error: beatRowsError } = await supabase
      .from("beat_files")
      .select("file_size_bytes")
      .in("user_id", [userId])

    if (beatRowsError) throw beatRowsError

    currentUsage = (beatRows ?? []).reduce(
      (total, row) => total + (row.file_size_bytes ?? 0),
      0,
    )
  }

  // Compute reclaimable bytes: if there's an existing beat file associated with this session
  let reclaimableBytes = 0
  if (existingBeatFileId) {
    const { data: existingRow } = await supabase
      .from("beat_files")
      .select("file_size_bytes, storage_path")
      .eq("id", existingBeatFileId)
      .eq("user_id", userId)
      .single()

    if (existingRow) reclaimableBytes = existingRow.file_size_bytes ?? 0
  }

  const projectedUsage = currentUsage - reclaimableBytes + file.size

  if (projectedUsage > ACCOUNT_STORAGE_LIMIT_BYTES) {
    throw new Error("Storage limit reached (100 MB). Please free up space in Settings.")
  }

  // If an existing beat file exists for the session, delete its DB row and storage object
  if (existingBeatFileId) {
    const { data: existingRow, error: existingRowError } = await supabase
      .from("beat_files")
      .select("storage_path")
      .eq("id", existingBeatFileId)
      .eq("user_id", userId)
      .single()

    if (existingRowError) throw existingRowError

    if (existingRow) {
      await supabase.from("beat_files").delete().eq("id", existingBeatFileId)
      if (existingRow.storage_path) {
        const { error: cleanupError } = await supabase.storage.from("beats").remove([existingRow.storage_path])
        if (cleanupError) console.warn("Beat storage cleanup failed:", cleanupError.message)
      }
    }
  }

  const storagePath = `${userId}/${sessionId}/${Date.now()}-${sanitizeFileName(file.name)}`

  const { error: storageError } = await supabase.storage
    .from("beats")
    .upload(storagePath, file)

  if (storageError) throw storageError

  const { data: insertData, error: insertError } = await supabase
    .from("beat_files")
    .insert({
      user_id: userId,
      storage_path: storagePath,
      file_size_bytes: file.size,
      source_type: "upload",
      beat_name: deriveBeatName(file.name),
      bpm: null,
    })
    .select("id")
    .single()

  if (insertError) throw insertError

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("beats")
    .createSignedUrl(storagePath, 3600)

  if (signedUrlError) {
    console.warn("Failed to create signed URL for beat:", signedUrlError.message)
  }

  // Update session metadata to reference the new beat file id
  const newMetadata = Object.assign({}, (sessionData.metadata as any) ?? {}, { beat_file_id: insertData.id })
  const { error: metaError } = await supabase
    .from("sessions")
    .update({ metadata: newMetadata })
    .eq("id", sessionId)
    .eq("user_id", userId)

  if (metaError) throw metaError

  // --- BPM detection (silent failure: never aborts the upload) ---
  let detectedBpm: number | null = null
  try {
    const arrayBuffer = await file.arrayBuffer()
    detectedBpm = await detectBpm(arrayBuffer)
    if (detectedBpm !== null) {
      await supabase
        .from("beat_files")
        .update({ bpm: detectedBpm })
        .eq("id", insertData.id)
    }
  } catch {
    // Detection failed — leave bpm as null
  }

  return {
    beatFileId: insertData.id,
    beatStorageUrl: signedUrlData?.signedUrl ?? "",
    bpm: detectedBpm,
    fileName: file.name,
  }
}

export async function deleteBeat(
  beatFileId: string,
  storagePath: string
): Promise<void> {
  const userId = await getAuthUser()

  // Delete DB record first (authoritative), scoped to user
  const { error: dbError } = await supabase
    .from("beat_files")
    .delete()
    .eq("id", beatFileId)
    .eq("user_id", userId)

  if (dbError) throw dbError

  // Remove any session.metadata references that pointed to this beat via RPC helper
  try {
    await supabase.rpc("sessions_clear_beat_file_reference", { p_beat_file_id: beatFileId })
  } catch (e) {
    // Best-effort cleanup — do not fail deletion on metadata cleanup errors
    console.warn("Failed to clear session metadata beat_file reference:", (e as Error).message)
  }

  const { error: storageError } = await supabase.storage
    .from("beats")
    .remove([storagePath])

  if (storageError) {
    console.warn("Beat storage cleanup failed:", storageError.message)
  }
}
