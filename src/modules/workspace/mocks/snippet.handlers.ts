// @module: workspace
// @layer: mock
// @scope: module
// @deps: snippet.fixtures.ts

import { http, HttpResponse } from "msw"
import type { Snippet } from "../types/snippet.types"
import { buildMockSnippet, mockSnippets } from "./snippet.fixtures"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"

let snippets: Snippet[] = [...mockSnippets]

function toSnippetRow(snippet: Snippet) {
  return {
    id: snippet.id,
    user_id: snippet.userId,
    title: snippet.title,
    content: snippet.content,
    tags: snippet.tags,
    created_at: snippet.createdAt,
    updated_at: snippet.updatedAt,
  }
}

export const snippetHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/snippets`, () => {
    return HttpResponse.json(snippets.map(toSnippetRow))
  }),

  http.post(`${SUPABASE_URL}/rest/v1/snippets`, async ({ request }) => {
    if (snippets.length >= 200) {
      return HttpResponse.json({ message: "Snippet limit reached" }, { status: 422 })
    }
    const body = (await request.json()) as any
    const newSnippet = buildMockSnippet({
      title: body.title,
      content: body.content,
      tags: body.tags ?? [],
    })
    snippets = [newSnippet, ...snippets]

    const row = toSnippetRow(newSnippet)
    const wantsSingle = request.headers.get("Accept")?.includes("vnd.pgrst.object")
    return HttpResponse.json(wantsSingle ? row : [row], { status: 201 })
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/snippets`, async ({ request }) => {
    const url = new URL(request.url)
    const idParam = url.searchParams.get("id")
    const id = idParam ? idParam.replace("eq.", "") : ""

    const body = (await request.json()) as any
    const idx = snippets.findIndex((s) => s.id === id)
    if (idx !== -1) {
      if (body.title !== undefined) snippets[idx].title = body.title
      if (body.content !== undefined) snippets[idx].content = body.content
      if (body.tags !== undefined) snippets[idx].tags = body.tags
      snippets[idx].updatedAt = new Date().toISOString()
    }

    if (request.headers.get("Prefer")?.includes("return=representation") && idx !== -1) {
      const row = toSnippetRow(snippets[idx])
      const wantsSingle = request.headers.get("Accept")?.includes("vnd.pgrst.object")
      return HttpResponse.json(wantsSingle ? row : [row])
    }

    return new HttpResponse(null, { status: 204 })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/snippets`, ({ request }) => {
    const url = new URL(request.url)
    const idParam = url.searchParams.get("id")
    const id = idParam ? idParam.replace("eq.", "") : ""

    snippets = snippets.filter((s) => s.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),
]