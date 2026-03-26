import { http, HttpResponse } from "msw"
import { mockSession, mockSessions } from "./workspace.fixtures"
import type { SessionSummary } from "../schemas/workspace.schema"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

// Mutable in-memory copy so rename/delete mutate state within a session
let sessions: SessionSummary[] = [...mockSessions]

export const workspaceHandlers = [
  http.get(`${BASE}/sessions`, () => {
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
    )
    return HttpResponse.json(sorted)
  }),

  http.get(`${BASE}/sessions/:id`, () => {
    return HttpResponse.json(mockSession)
  }),

  http.patch(`${BASE}/sessions/:id/rename`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const { title } = (await request.json()) as { title: string }
    const idx = sessions.findIndex((s) => s.id === id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    sessions[idx] = { ...sessions[idx], title }
    return HttpResponse.json(sessions[idx])
  }),

  http.patch(`${BASE}/sessions/:id/draft`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete(`${BASE}/sessions/:id`, ({ params }) => {
    const { id } = params as { id: string }
    sessions = sessions.filter((s) => s.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]
