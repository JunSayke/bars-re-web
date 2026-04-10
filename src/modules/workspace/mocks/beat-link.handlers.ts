import { http, HttpResponse } from "msw"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"

interface BeatLinkRow {
  id: string
  user_id: string
  url: string
  provider: string
  bpm: number | null
  beat_name?: string | null
  created_at: string
}

// In-memory store keyed by beat_link id
const beatLinks = new Map<string, BeatLinkRow>()

// Seed a couple of mock links for the fixture sessions
beatLinks.set("mock-link-1", {
  id: "mock-link-1",
  user_id: "mock-user-001",
  url: "https://open.spotify.com/track/mock1",
  provider: "spotify",
  bpm: 120,
  beat_name: "MOCK LINK 1",
  created_at: new Date().toISOString(),
})

beatLinks.set("mock-link-2", {
  id: "mock-link-2",
  user_id: "mock-user-001",
  url: "https://open.spotify.com/track/mock2",
  provider: "spotify",
  bpm: 100,
  beat_name: "MOCK LINK 2",
  created_at: new Date().toISOString(),
})

function makeBeatLinkRow(user_id: string, url: string, provider: string): BeatLinkRow {
  return {
    id: Math.random().toString(36).slice(2, 10),
    user_id,
    url,
    provider,
    bpm: null,
    beat_name: null,
    created_at: new Date().toISOString(),
  }
}

export const beatLinkHandlers = [
  // GET /rest/v1/beat_links
  http.get(`${SUPABASE_URL}/rest/v1/beat_links`, ({ request }) => {
    const url = new URL(request.url)
    // Support queries by id=eq.<id> or user_id=eq.<userId>
    const idFilter = url.searchParams.get("id")
    const userFilter = url.searchParams.get("user_id")

    if (idFilter) {
      const id = idFilter.replace("eq.", "")
      const row = beatLinks.get(id) ?? null
      const acceptsObject = request.headers.get("Accept")?.includes("application/vnd.pgrst.object")
      return HttpResponse.json(acceptsObject ? row : (row ? [row] : []))
    }

    if (userFilter) {
      const userId = userFilter.replace("eq.", "")
      const rows = Array.from(beatLinks.values()).filter((r) => r.user_id === userId)
      return HttpResponse.json(rows)
    }

    // Default: return all
    return HttpResponse.json(Array.from(beatLinks.values()))
  }),

  // DELETE /rest/v1/beat_links (supports id=eq.<id>)
  http.delete(`${SUPABASE_URL}/rest/v1/beat_links`, ({ request }) => {
    const url = new URL(request.url)
    const idFilter = url.searchParams.get("id")
    if (idFilter) {
      const id = idFilter.replace("eq.", "")
      beatLinks.delete(id)
      return new HttpResponse(null, { status: 204 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /rest/v1/beat_links
  http.post(`${SUPABASE_URL}/rest/v1/beat_links`, async ({ request }) => {
    const body = (await request.json()) as any
    // Supabase may send an array for bulk inserts; handle both
    const payload = Array.isArray(body) ? body[0] : body
    const user_id = payload.user_id ?? "mock-user-001"
    const urlVal = payload.url
    const provider = payload.provider ?? "spotify"
    const row = makeBeatLinkRow(user_id, urlVal, provider)
    beatLinks.set(row.id, row)
    return HttpResponse.json(row, { status: 201 })
  }),
]
