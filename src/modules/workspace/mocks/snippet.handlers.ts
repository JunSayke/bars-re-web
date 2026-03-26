import { http, HttpResponse } from "msw"
import type { Snippet } from "../types/snippet.types"
import { buildMockSnippet, mockSnippets } from "./snippet.fixtures"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

let snippets: Snippet[] = [...mockSnippets]

export const snippetHandlers = [
  http.get(`${BASE}/snippets`, () => {
    return HttpResponse.json(snippets)
  }),

  http.post(`${BASE}/snippets`, async ({ request }) => {
    if (snippets.length >= 200) {
      return HttpResponse.json({ message: "Snippet limit reached" }, { status: 422 })
    }
    const body = (await request.json()) as { title: string; content: string; tags: string[] }
    const newSnippet = buildMockSnippet({
      title: body.title,
      content: body.content,
      tags: (body.tags ?? []) as Snippet["tags"],
    })
    snippets = [newSnippet, ...snippets]
    return HttpResponse.json(newSnippet, { status: 201 })
  }),

  http.patch(`${BASE}/snippets/:id`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as Partial<Snippet>
    const idx = snippets.findIndex((s) => s.id === id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    snippets[idx] = { ...snippets[idx], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json(snippets[idx])
  }),

  http.delete(`${BASE}/snippets/:id`, ({ params }) => {
    const { id } = params as { id: string }
    snippets = snippets.filter((s) => s.id !== id)
    return new HttpResponse(null, { status: 200 })
  }),
]
