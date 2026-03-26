import type { WordLookupResult } from "../types/thesaurus.types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw err
  }
  return res.json() as Promise<T>
}

export async function lookupWord(term: string): Promise<WordLookupResult> {
  const res = await fetch(`${BASE}/thesaurus/lookup?query=${encodeURIComponent(term)}`)
  return handleResponse<WordLookupResult>(res)
}
