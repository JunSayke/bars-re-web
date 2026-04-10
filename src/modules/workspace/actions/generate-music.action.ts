"use server"

import fs from "fs/promises"
import path from "path"
import { createServerClient } from "@/shared/config/supabase.server"

type Params = {
  tags: string
  lyrics?: string
  dur: number
  ntracks?: number
  bpm?: number
  instrumental?: boolean
  // Additional optional fields passed from the UI
  lang?: string
  think?: boolean
  seed?: number
  key?: string
  ts?: string
  steps?: number
  guide?: number
}

const sanitize = (n = "generated.mp3") => path.basename(n).replace(/[^A-Za-z0-9._-]/g, "-") || "generated.mp3"

export async function generateMusicAction(sessionId: string, params: Params) {
  const envHost = process.env.GRADIO_HOST?.trim()
  const host = envHost || (await fs.readFile(path.join(process.cwd(), "gradio_public_url.txt"), "utf8").then((s) => s.trim()).catch(() => ""))
  if (!host) throw new Error("GRADIO_HOST not configured")

  const { Client } = await import("@gradio/client")
  const user = process.env.GRADIO_AUTH_USER
  const pass = process.env.GRADIO_AUTH_PASSWORD
  const client = await Client.connect(host, user && pass ? { auth: [user, pass] } : undefined)

  const result = await client.predict("/generate_music", params as any)
  const dataArray = Array.isArray(result?.data) ? result.data : []
  const entry = dataArray.find((e: any) => e && typeof e === "object" && (e.url || e.path))
  if (!entry) return { created: [], info: Array.isArray(result?.data) && typeof result.data[2] === "string" ? result.data[2] : "" }

  const fileUrl = entry.url ?? (entry.path ? `${host}/gradio_api/file=${entry.path}` : undefined)
  if (!fileUrl) return { created: [], info: "" }

  const fetcher = (client as any).fetch?.bind(client) ?? fetch
  const resp = await fetcher(fileUrl as string)
  if (!resp.ok) {
    const body = await resp.text().catch(() => "")
    throw new Error(`Failed fetching generated file: ${resp.status} ${String(body).slice(0, 200)}`)
  }

  const buffer = Buffer.from(await resp.arrayBuffer())

  const supabase = await createServerClient()
  const { data } = await supabase.auth.getUser()
  const userId = data?.user?.id
  if (!userId) throw new Error("Unauthorized")

  const fileName = sanitize(entry.orig_name ?? path.basename(new URL(fileUrl as string).pathname))
  const storagePath = `${userId}/${sessionId}/${Date.now()}-${fileName}`

  const { error: uploadErr } = await supabase.storage.from("beats").upload(storagePath, buffer as any, { contentType: entry.mime_type ?? "audio/mpeg" } as any)
  if (uploadErr) throw uploadErr

  const { data: insertData, error: insertErr } = await supabase
    .from("beat_files")
    .insert({ user_id: userId, storage_path: storagePath, file_size_bytes: buffer.length, source_type: "generated", beat_name: fileName.replace(/\.[^/.]+$/, ""), bpm: null })
    .select("id")
    .single()
  if (insertErr) throw insertErr

  const { data: signed, error: signedErr } = await supabase.storage.from("beats").createSignedUrl(storagePath, 60 * 60)
  if (signedErr) throw signedErr

  return { created: [{ id: insertData.id, storagePath, signedUrl: signed?.signedUrl ?? "", fileName }], info: Array.isArray(result?.data) && typeof result.data[2] === "string" ? result.data[2] : "" }
}
