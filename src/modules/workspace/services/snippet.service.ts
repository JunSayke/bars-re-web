import type { Snippet, CreateSnippetPayload, UpdateSnippetPayload } from "../types/snippet.types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json()
    throw err
  }
  return res.json() as Promise<T>
}

export async function getSnippets(): Promise<Snippet[]> {
  const res = await fetch(`${BASE}/snippets`)
  return handleResponse<Snippet[]>(res)
}

export async function createSnippet(payload: CreateSnippetPayload): Promise<Snippet> {
  const res = await fetch(`${BASE}/snippets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return handleResponse<Snippet>(res)
}

export async function updateSnippet(id: string, payload: UpdateSnippetPayload): Promise<Snippet> {
  const res = await fetch(`${BASE}/snippets/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return handleResponse<Snippet>(res)
}

export async function deleteSnippet(id: string): Promise<void> {
  const res = await fetch(`${BASE}/snippets/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw err
  }
}
