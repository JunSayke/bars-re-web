/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import type { Database } from "@/shared/config/database.types"
import type { BeatLink } from "../schemas/workspace.schema"
import { detectProvider } from "../utils/beat-link.utils"

type BeatLinkRow = Database["public"]["Tables"]["beat_links"]["Row"]

function toBeatLink(row: BeatLinkRow, sessionId: string): BeatLink {
  return {
    id: row.id,
    sessionId,
    url: row.url,
    provider: row.provider,
    bpm: row.bpm,
  }
}

async function getAuthUser(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user.id
}

export async function upsertBeatLink(sessionId: string, url: string): Promise<BeatLink> {
  const userId = await getAuthUser()

  // Ensure the session belongs to the current user and read existing metadata
  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .select("id, metadata")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single()

  if (sessionError) throw sessionError
  if (!sessionData) throw new Error("Session not found")

  const prevBeatLinkId = (sessionData.metadata as any)?.beat_link_id as string | undefined

  // If a previous beat_link row was associated with this session, delete it
  if (prevBeatLinkId) {
    await supabase.from("beat_links").delete().eq("id", prevBeatLinkId).eq("user_id", userId)
  }

  const { data, error } = await supabase
    .from("beat_links")
    .insert({
      user_id: userId,
      url,
      provider: detectProvider(url),
      beat_name: `${detectProvider(url).toUpperCase()} Link`,
    })
    .select()
    .single()

  if (error) throw error

  // Update session metadata to reference the new beat_link id
  const newMetadata = Object.assign({}, (sessionData.metadata as any) ?? {}, { beat_link_id: data.id })
  const { error: metaError } = await supabase
    .from("sessions")
    .update({ metadata: newMetadata })
    .eq("id", sessionId)
    .eq("user_id", userId)

  if (metaError) throw metaError

  return toBeatLink(data as BeatLinkRow, sessionId)
}

export async function getBeatLink(sessionId: string): Promise<BeatLink | null> {
  const userId = await getAuthUser()

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .select("id, metadata")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single()

  if (sessionError) throw sessionError
  if (!sessionData) return null

  const beatLinkId = (sessionData.metadata as any)?.beat_link_id as string | undefined
  if (!beatLinkId) return null

  const { data, error } = await supabase
    .from("beat_links")
    .select("*")
    .eq("id", beatLinkId)
    .eq("user_id", userId)
    .single()

  if (error) throw error
  if (!data) return null

  return toBeatLink(data as BeatLinkRow, sessionId)
}
