/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
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

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function uploadBeat(sessionId: string, file: File): Promise<Beat> {
  const userId = await getAuthUser()

  // Delete any existing beats for this session before uploading a new one
  const { data: existingBeats } = await supabase
    .from("beat_files")
    .select("id, storage_path")
    .eq("session_id", sessionId)

  if (existingBeats && existingBeats.length > 0) {
    // Delete DB records first (authoritative), then clean up storage
    await supabase
      .from("beat_files")
      .delete()
      .in("id", existingBeats.map((b) => b.id))

    const paths = existingBeats.map((b) => b.storage_path).filter(Boolean) as string[]
    if (paths.length > 0) {
      const { error: cleanupError } = await supabase.storage.from("beats").remove(paths)
      if (cleanupError) {
        console.warn("Beat storage cleanup failed:", cleanupError.message)
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
      session_id: sessionId,
      storage_path: storagePath,
      file_size_bytes: file.size,
      source_type: "upload",
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
  await getAuthUser()

  // Delete DB record first (authoritative), then clean up storage
  const { error: dbError } = await supabase
    .from("beat_files")
    .delete()
    .eq("id", beatFileId)

  if (dbError) throw dbError

  const { error: storageError } = await supabase.storage
    .from("beats")
    .remove([storagePath])

  if (storageError) {
    console.warn("Beat storage cleanup failed:", storageError.message)
  }
}
