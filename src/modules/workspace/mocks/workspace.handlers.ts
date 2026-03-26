import { http, HttpResponse } from "msw"
import { mockSession } from "./workspace.fixtures"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const workspaceHandlers = [
  http.get(`${BASE}/sessions/:id`, () => {
    return HttpResponse.json(mockSession)
  }),

  http.patch(`${BASE}/sessions/:id/draft`, () => {
    return HttpResponse.json({ success: true })
  }),
]
