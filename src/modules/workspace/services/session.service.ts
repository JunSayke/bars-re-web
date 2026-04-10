/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import type {
  SessionSummary,
  CreateSessionPayload,
} from "../schemas/workspace.schema"

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getAuthUser(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user.id
}

function toPreviewSnippet(barContent: string | null): string {
  if (!barContent) return ""
  try {
    const bars = JSON.parse(barContent) as Array<{ text?: string }>
    if (!Array.isArray(bars)) return ""
    const firstText = bars.find((b) => b?.text?.trim())?.text?.trim() ?? ""
    return firstText.length > 100 ? firstText.slice(0, 97) + "..." : firstText
  } catch {
    return ""
  }
}

function toThumbnailType(hasBeat: boolean): "lyrics" | "beat-linked" {
  return hasBeat ? "beat-linked" : "lyrics"
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getSessions(): Promise<SessionSummary[]> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, topic, bar_content, last_modified_at, metadata")
    .eq("user_id", userId)
    .order("last_modified_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => {
    const meta = row.metadata as any
    return {
      id: row.id,
      title: row.title ?? "",
      topic: row.topic ?? "",
      previewSnippet: toPreviewSnippet(row.bar_content),
      thumbnailType: toThumbnailType(Boolean(meta && (meta.beat_link_id || meta.beat_file_id))),
      lastModifiedAt: row.last_modified_at ?? "",
    }
  })
}

export async function createSession(
  payload: CreateSessionPayload
): Promise<SessionSummary> {
  const userId = await getAuthUser()

  const { count } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)

  if ((count ?? 0) >= 100) throw { message: "Session limit reached" }

    const { data, error } = await supabase
    .from("sessions")
    .insert({
      title: payload.title,
      topic: payload.topic ?? "",
      user_id: userId,
      bar_content: "",
      last_modified_at: new Date().toISOString(),
      metadata: {},
    })
    .select("id, title, topic, bar_content, last_modified_at, metadata")
    .single()

  if (error) throw error

  {
    const meta = data.metadata as any
    return {
      id: data.id,
      title: data.title ?? "",
      topic: data.topic ?? "",
      previewSnippet: toPreviewSnippet(data.bar_content),
      thumbnailType: toThumbnailType(Boolean(meta && (meta.beat_link_id || meta.beat_file_id))),
      lastModifiedAt: data.last_modified_at ?? "",
    }
  }
}

export async function renameSession(
  id: string,
  title: string
): Promise<SessionSummary> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("sessions")
    .update({ title, last_modified_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, title, topic, bar_content, last_modified_at, metadata")
    .single()

  if (error) throw error

  {
    const meta = data.metadata as any
    return {
      id: data.id,
      title: data.title ?? "",
      topic: data.topic ?? "",
      previewSnippet: toPreviewSnippet(data.bar_content),
      thumbnailType: toThumbnailType(Boolean(meta && (meta.beat_link_id || meta.beat_file_id))),
      lastModifiedAt: data.last_modified_at ?? "",
    }
  }
}

export async function updateSessionTopic(
  id: string,
  topic: string
): Promise<SessionSummary> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("sessions")
    .update({ topic, last_modified_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, title, topic, bar_content, last_modified_at, metadata")
    .single()

  if (error) throw error

  const meta = data.metadata as any
  return {
    id: data.id,
    title: data.title ?? "",
    topic: data.topic ?? "",
    previewSnippet: toPreviewSnippet(data.bar_content),
    thumbnailType: toThumbnailType(Boolean(meta && (meta.beat_link_id || meta.beat_file_id))),
    lastModifiedAt: data.last_modified_at ?? "",
  }
}

export async function deleteSession(id: string): Promise<void> {
  const userId = await getAuthUser()

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error
}
