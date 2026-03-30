import { http, HttpResponse } from "msw"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"

interface BeatLinkRow {
  id: string
  session_id: string
  url: string
  provider: string
  bpm: number | null
}

// In-memory store: one row per session_id
const beatLinks = new Map<string, BeatLinkRow>()

function makeBeatLinkRow(session_id: string, url: string, provider: string): BeatLinkRow {
  return {
    id: Math.random().toString(36).slice(2, 10),
    session_id,
    url,
    provider,
    bpm: null,
  }
}

export const beatLinkHandlers = [
  // GET /rest/v1/beat_links?session_id=eq.<id>&...
  http.get(`${SUPABASE_URL}/rest/v1/beat_links`, ({ request }) => {
    const url = new URL(request.url)
    const sessionFilter = url.searchParams.get("session_id")
    const sessionId = sessionFilter?.replace("eq.", "") ?? ""
    const row = beatLinks.get(sessionId)
    // maybeSingle uses Accept: application/vnd.pgrst.object+json; otherwise returns array
    const acceptsObject = request.headers.get("Accept")?.includes("application/vnd.pgrst.object")
    if (acceptsObject) {
      return HttpResponse.json(row ?? null)
    }
    return HttpResponse.json(row ? [row] : [])
  }),

  // DELETE /rest/v1/beat_links?session_id=eq.<id>
  http.delete(`${SUPABASE_URL}/rest/v1/beat_links`, ({ request }) => {
    const url = new URL(request.url)
    const sessionFilter = url.searchParams.get("session_id")
    const sessionId = sessionFilter?.replace("eq.", "") ?? ""
    beatLinks.delete(sessionId)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /rest/v1/beat_links
  http.post(`${SUPABASE_URL}/rest/v1/beat_links`, async ({ request }) => {
    const body = (await request.json()) as { session_id: string; url: string; provider?: string }
    const row = makeBeatLinkRow(body.session_id, body.url, body.provider ?? "spotify")
    beatLinks.set(row.session_id, row)
    return HttpResponse.json(row, { status: 201 })
  }),
]
