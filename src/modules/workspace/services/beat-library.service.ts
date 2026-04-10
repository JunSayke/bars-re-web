import { supabase } from "@/shared/config/supabase"
import type { Database } from "@/shared/config/database.types"
import { deleteBeat } from "./beat.service"

export type BeatSourceTag = "uploaded" | "generated" | "link"

export interface BeatLibraryItem {
  id: string
  kind: "file" | "link"
  recordId: string
  sessionId: string
  title: string
  beatName: string
  sourceTag: BeatSourceTag
  bpm: number | null
  createdAt: string
  storagePath?: string
  linkUrl?: string
  provider?: string
}

export interface BeatPlaybackPayload {
  url: string
  fileName: string
  bpm: number | null
}

type BeatFileRow = Database["public"]["Tables"]["beat_files"]["Row"]
type SessionRow = Database["public"]["Tables"]["sessions"]["Row"]
type BeatLinkRow = Database["public"]["Tables"]["beat_links"]["Row"]

async function getAuthUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error("Unauthorized")
  return data.user.id
}

function inferSourceTag(sourceType: string | null): BeatSourceTag {
  if (sourceType === "generated") return "generated"
  return "uploaded"
}

function labelFromStoragePath(storagePath?: string) {
  if (!storagePath) return "Untitled Beat"
  const parts = storagePath.split("/")
  const fileName = parts[parts.length - 1] ?? storagePath
  return fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "")
}

export async function getRecentBeatLibrary(limit = 20): Promise<BeatLibraryItem[]> {
  const userId = await getAuthUserId()

  // Fetch beat files and beat links owned by the current user and combine
  const [{ data: beatFiles, error: beatFilesError }, { data: beatLinks, error: beatLinksError }] = await Promise.all([
    supabase
      .from("beat_files")
      .select("id, user_id, storage_path, bpm, source_type, beat_name, created_at")
      .eq("user_id", userId),
    supabase
      .from("beat_links")
      .select("id, user_id, url, provider, bpm, beat_name, created_at")
      .eq("user_id", userId),
  ])

  if (beatFilesError) throw beatFilesError
  if (beatLinksError) throw beatLinksError

  const items: BeatLibraryItem[] = []

  for (const row of (beatFiles ?? []) as BeatFileRow[]) {
    items.push({
      id: `file-${row.id}`,
      kind: "file",
      recordId: row.id,
      // Not associated with a session by default; sessions reference beats in metadata
      sessionId: "",
      title: row.beat_name ?? labelFromStoragePath(row.storage_path ?? undefined),
      beatName: row.beat_name ?? labelFromStoragePath(row.storage_path ?? undefined),
      sourceTag: inferSourceTag(row.source_type),
      bpm: row.bpm,
      createdAt: row.created_at ?? new Date(0).toISOString(),
      storagePath: row.storage_path ?? undefined,
    })
  }

  for (const row of (beatLinks ?? []) as BeatLinkRow[]) {
    items.push({
      id: `link-${row.id}`,
      kind: "link",
      recordId: row.id,
      sessionId: "",
      title: row.beat_name ?? `${(row.provider ?? "music").toUpperCase()} Link`,
      beatName: row.beat_name ?? `${(row.provider ?? "music").toUpperCase()} Link`,
      sourceTag: "link",
      bpm: row.bpm,
      createdAt: row.created_at ?? new Date(0).toISOString(),
      linkUrl: row.url,
      provider: row.provider,
    })
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export async function getBeatPlaybackPayload(beatFileId: string): Promise<BeatPlaybackPayload> {
  const userId = await getAuthUserId()

  const { data, error } = await supabase
    .from("beat_files")
    .select("storage_path, bpm")
    .eq("id", beatFileId)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  const storagePath = data.storage_path
  if (!storagePath) throw new Error("Beat file is missing storage path")

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("beats")
    .createSignedUrl(storagePath, 3600)

  if (signedUrlError) throw signedUrlError

  const fileName = storagePath.split("/").pop()?.replace(/^\d+-/, "") ?? "beat.mp3"

  return {
    url: signedUrlData?.signedUrl ?? "",
    fileName,
    bpm: data.bpm,
  }
}

export async function deleteBeatLibraryItem(item: BeatLibraryItem): Promise<void> {
  if (item.kind === "file") {
    if (!item.storagePath) throw new Error("Beat storage path is missing")
    await deleteBeat(item.recordId, item.storagePath)
    return
  }

  // Delete beat_link row scoped to user and remove session metadata references
  const userId = await getAuthUserId()

  const { data: linkRow, error: linkError } = await supabase
    .from("beat_links")
    .select("id")
    .eq("id", item.recordId)
    .eq("user_id", userId)
    .single()

  if (linkError) throw linkError

  const { error: delError } = await supabase
    .from("beat_links")
    .delete()
    .eq("id", item.recordId)
    .eq("user_id", userId)

  if (delError) throw delError

  // Clear any session.metadata references that pointed to this link via RPC helper
  try {
    await supabase.rpc("sessions_clear_beat_link_reference", { p_beat_link_id: item.recordId })
  } catch (e) {
    console.warn("Failed to clear session metadata beat_link reference:", (e as Error).message)
  }
}
