"use server"

import fs from "fs/promises"
import path from "path"

export async function checkGradioHealthAction(): Promise<{ ok: boolean; message?: string }> {
  const envHost = process.env.GRADIO_HOST?.trim()
  const host =
    envHost ||
    (await fs
      .readFile(path.join(process.cwd(), "gradio_public_url.txt"), "utf8")
      .then((s) => s.trim())
      .catch(() => ""))

  if (!host) return { ok: false, message: "GRADIO_HOST not configured" }

  const { Client } = await import("@gradio/client")
  const user = process.env.GRADIO_AUTH_USER
  const pass = process.env.GRADIO_AUTH_PASSWORD

  let client
  try {
    client = await Client.connect(host, user && pass ? { auth: [user, pass] } : undefined)
  } catch (err) {
    return { ok: false, message: `Connection failed: ${String(err)}` }
  }

  try {
    const res = await client.predict("/health_sse", { interval_seconds: 1, checks: 1 })
    if (res && res.data) return { ok: true }
    return { ok: false, message: "Health check returned unexpected response" }
  } catch (err) {
    return { ok: false, message: String(err) }
  }
}
