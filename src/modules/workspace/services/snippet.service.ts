/**
 * @module: workspace
 * @layer: service
 * @scope: module
 * @deps: @/shared/config/supabase
 */

import { supabase } from "@/shared/config/supabase"
import type { Database } from "@/shared/config/database.types"
import { snippetTagSchema } from "../schemas/snippet.schema"
import type { Snippet, CreateSnippetPayload, UpdateSnippetPayload } from "../types/snippet.types"

type SnippetRow = Database["public"]["Tables"]["snippets"]["Row"]

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getAuthUser(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw { message: "Unauthorized" }
  return data.user.id
}

function toSnippet(row: SnippetRow): Snippet {
  const parsedTags = snippetTagSchema.array().safeParse(row.tags)
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    tags: parsedTags.success ? parsedTags.data : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getSnippets(): Promise<Snippet[]> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error

  return (data as SnippetRow[]).map(toSnippet)
}

export async function createSnippet(payload: CreateSnippetPayload): Promise<Snippet> {
  const userId = await getAuthUser()

  const { count } = await supabase
    .from("snippets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)

  if ((count ?? 0) >= 200) throw { message: "Snippet limit reached" }

  const { data, error } = await supabase
    .from("snippets")
    .insert({ title: payload.title, content: payload.content, tags: payload.tags, user_id: userId })
    .select()
    .single()

  if (error) throw error

  return toSnippet(data as SnippetRow)
}

export async function updateSnippet(id: string, payload: UpdateSnippetPayload): Promise<Snippet> {
  const userId = await getAuthUser()

  const { data, error } = await supabase
    .from("snippets")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return toSnippet(data as SnippetRow)
}

export async function deleteSnippet(id: string): Promise<void> {
  const userId = await getAuthUser()

  const { error } = await supabase
    .from("snippets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error
}
