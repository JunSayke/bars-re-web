import type { WritingSession, SaveDraftPayload, SaveResult } from "../schemas/workspace.schema"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json()
    throw err
  }
  return res.json() as Promise<T>
}

export async function getSession(sessionId: string): Promise<WritingSession> {
  const res = await fetch(`${BASE}/sessions/${encodeURIComponent(sessionId)}`)
  return handleResponse<WritingSession>(res)
}

export async function saveDraft(
  sessionId: string,
  payload: SaveDraftPayload
): Promise<SaveResult> {
  const res = await fetch(`${BASE}/sessions/${encodeURIComponent(sessionId)}/draft`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return handleResponse<SaveResult>(res)
}
