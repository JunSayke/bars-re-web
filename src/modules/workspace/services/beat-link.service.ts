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

function toBeatLink(row: BeatLinkRow): BeatLink {
  return {
    id: row.id,
    sessionId: row.session_id,
    url: row.url,
    provider: row.provider,
    bpm: row.bpm,
  }
}

export async function upsertBeatLink(sessionId: string, url: string): Promise<BeatLink> {
  // Delete existing beat_links row for this session (at most one per session)
  await supabase.from("beat_links").delete().eq("session_id", sessionId)

  const { data, error } = await supabase
    .from("beat_links")
    .insert({ session_id: sessionId, url, provider: detectProvider(url) })
    .select()
    .single()

  if (error) throw error

  return toBeatLink(data as BeatLinkRow)
}

export async function getBeatLink(sessionId: string): Promise<BeatLink | null> {
  const { data, error } = await supabase
    .from("beat_links")
    .select("*")
    .eq("session_id", sessionId)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return toBeatLink(data as BeatLinkRow)
}
