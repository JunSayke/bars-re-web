// @module: workspace
// @layer: mock
// @scope: module
// @deps: workspace.fixtures.ts

import { http, HttpResponse } from "msw"
import { buildMockSession, mockSession, mockSessions } from "./workspace.fixtures"
import type { SessionSummary } from "../schemas/workspace.schema"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"

// In-memory state for mutations
let sessions: SessionSummary[] = [...mockSessions]

// Helper: Convert mapped frontend summary back into a raw Supabase DB row
function toSessionRow(summary: SessionSummary) {
  return {
    id: summary.id,
    user_id: "mock-user-001",
    title: summary.title,
    topic: summary.topic,
    bar_content: JSON.stringify([{ text: summary.previewSnippet }]),
    last_modified_at: summary.lastModifiedAt,
    beat_files: summary.thumbnailType === "beat-linked" ? [{ id: "mock-beat-1" }] : [],
  }
}

export const workspaceHandlers = [
  // GET /sessions (Handles both list and single lookups)
  http.get(`${SUPABASE_URL}/rest/v1/sessions`, ({ request }) => {
    // Supabase sets this header when `.single()` is called
    const isSingle = request.headers.get("Accept")?.includes("vnd.pgrst.object")

    if (isSingle) {
      return HttpResponse.json({
        id: mockSession.id,
        title: mockSession.title,
        bar_content: JSON.stringify(mockSession.bars),
        beat_files: mockSession.beat
          ? [
              {
                id: mockSession.beat.beatFileId,
                storage_path: "mock-path.mp3",
                bpm: mockSession.beat.bpm,
                file_size_bytes: 1024,
                source_type: "upload",
              },
            ]
          : [],
      })
    }

    // List view
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
    )
    return HttpResponse.json(sorted.map(toSessionRow))
  }),

  // POST /sessions (Insert)
  http.post(`${SUPABASE_URL}/rest/v1/sessions`, async ({ request }) => {
    if (sessions.length >= 100) {
      return HttpResponse.json({ message: "Session limit reached" }, { status: 429 })
    }
    const body = (await request.json()) as { title: string; topic?: string }
    const newSummary = buildMockSession({ title: body.title, topic: body.topic ?? "" })
    sessions.push(newSummary)

    const row = toSessionRow(newSummary)
    const wantsSingle = request.headers.get("Accept")?.includes("vnd.pgrst.object")
    return HttpResponse.json(wantsSingle ? row : [row], { status: 201 })
  }),

  // PATCH /sessions (Update / Rename / Save Draft)
  http.patch(`${SUPABASE_URL}/rest/v1/sessions`, async ({ request }) => {
    const url = new URL(request.url)
    const idParam = url.searchParams.get("id")
    const id = idParam ? idParam.replace("eq.", "") : ""

    const body = (await request.json()) as any

    const idx = sessions.findIndex((s) => s.id === id)
    if (idx !== -1) {
      if (body.title !== undefined) sessions[idx].title = body.title
      if (body.topic !== undefined) sessions[idx].topic = body.topic
      sessions[idx].lastModifiedAt = new Date().toISOString()
    }

    // `.select()` sets Prefer: return=representation
    if (request.headers.get("Prefer")?.includes("return=representation")) {
      const updatedRow = toSessionRow(sessions[idx] ?? buildMockSession())
      const wantsSingle = request.headers.get("Accept")?.includes("vnd.pgrst.object")
      return HttpResponse.json(wantsSingle ? updatedRow : [updatedRow])
    }

    // Standard save returns no content
    return new HttpResponse(null, { status: 204 })
  }),

  // DELETE /sessions
  http.delete(`${SUPABASE_URL}/rest/v1/sessions`, ({ request }) => {
    const url = new URL(request.url)
    const idParam = url.searchParams.get("id")
    const id = idParam ? idParam.replace("eq.", "") : ""

    sessions = sessions.filter((s) => s.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // Storage: Upload Beat
  http.post(`${SUPABASE_URL}/storage/v1/object/beats/*`, () => {
    return HttpResponse.json({ Key: "mock-path.mp3" }, { status: 200 })
  }),

  // Storage: Sign URL
  http.post(`${SUPABASE_URL}/storage/v1/object/sign/beats/*`, () => {
    return HttpResponse.json(
      { signedUrl: "http://mock-signed-url.com/beat.mp3" },
      { status: 200 }
    )
  }),
]