import { supabase } from "@/shared/config/supabase"

export async function renameBeatFile(beatFileId: string, beatName: string): Promise<void> {
  const trimmed = beatName.trim()
  if (!trimmed) throw new Error("Beat name is required")

  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  const userId = data.user.id

  const { error } = await supabase
    .from("beat_files")
    .update({ beat_name: trimmed })
    .eq("id", beatFileId)
    .eq("user_id", userId)

  if (error) throw error
}

export async function renameBeatLink(beatLinkId: string, beatName: string): Promise<void> {
  const trimmed = beatName.trim()
  if (!trimmed) throw new Error("Beat name is required")

  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  const userId = data.user.id

  const { error } = await supabase
    .from("beat_links")
    .update({ beat_name: trimmed })
    .eq("id", beatLinkId)
    .eq("user_id", userId)

  if (error) throw error
}
