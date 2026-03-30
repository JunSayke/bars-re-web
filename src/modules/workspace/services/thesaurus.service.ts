import type { WordLookupResult, RhymeResult, SynonymResult, AnagramResult } from "../types/thesaurus.types"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw err
  }
  return res.json() as Promise<T>
}

export async function lookupWord(term: string): Promise<WordLookupResult> {
  const res = await fetch(`/api/thesaurus/lookup?query=${encodeURIComponent(term)}`)
  return handleResponse<WordLookupResult>(res)
}

export async function findRhymes(term: string, page = 1): Promise<RhymeResult> {
  const res = await fetch(`/api/thesaurus/rhyme?query=${encodeURIComponent(term)}&page=${page}`)
  return handleResponse<RhymeResult>(res)
}

export async function findSynonyms(term: string): Promise<SynonymResult> {
  const res = await fetch(`/api/thesaurus/synonyms?query=${encodeURIComponent(term)}`)
  return handleResponse<SynonymResult>(res)
}

export async function findAnagrams(term: string): Promise<AnagramResult> {
  const res = await fetch(`/api/thesaurus/anagrams?query=${encodeURIComponent(term)}`)
  return handleResponse<AnagramResult>(res)
}
