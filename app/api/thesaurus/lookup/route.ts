import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { lookup, fuzzySearch } from "@junsayke/cebuano-thesaurus"
export const runtime = "nodejs"
import type {
  WordLookupResult,
  HomonymEntry,
  ExampleSentence,
} from "@/modules/workspace/types/thesaurus.types"

// ThesaurusEntry is not exported by the package; derive it from the return type
type ThesaurusEntry = NonNullable<Awaited<ReturnType<typeof lookup>>>

const querySchema = z.object({
  query: z.string().min(1, "query is required"),
})

function stripMarkers(s: string): string {
  return s.replace(/\$\d+$/, "").trim()
}

// Collapse consecutive repeated characters so typos like "dagaaat" → "dagat"
// match the LIKE-based fuzzySearch (which is substring, not edit-distance).
function normalizeQuery(q: string): string {
  return q.replace(/(.)\1+/g, "$1")
}

// Strip diacritics/accents so accented headwords (e.g. "panágat") resolve
// against the normalized_head column in the dictionary (e.g. "panagat").
function stripDiacritics(q: string): string {
  return q.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function mapEntry(entry: ThesaurusEntry): WordLookupResult {
  const definitions = entry.senses.flatMap((s) =>
    s.translations.map(stripMarkers),
  )

  const translations = entry.senses.flatMap((s) =>
    s.translations.map((translation) => ({
      language: "en",
      translation: stripMarkers(translation),
    })),
  )

  const homonyms: HomonymEntry[] = entry.subentries.map((sub) => ({
    word: sub.headword,
  }))

  const examples: ExampleSentence[] = entry.senses.flatMap(
    (s) => (s.examples ?? []).map((ex) => ({ cebuano: ex.cebuano, english: ex.english })),
  )

  return {
    word: entry.headword,
    definitions,
    translations,
    homonyms,
    examples,
    suggestedWords: [],
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const raw = { query: searchParams.get("query") ?? "" }
  const parsed = querySchema.safeParse(raw)

  if (!parsed.success) {
    return NextResponse.json({ error: "query is required" }, { status: 400 })
  }

  const { query } = parsed.data

  const entry = await lookup(stripDiacritics(query))
  if (entry !== null) {
    return NextResponse.json(mapEntry(entry))
  }

  const normalizedQuery = normalizeQuery(stripDiacritics(query))
  let fuzzyResults = await fuzzySearch(normalizedQuery, 10)
  if (fuzzyResults.length === 0 && normalizedQuery.length > 3) {
    fuzzyResults = await fuzzySearch(normalizedQuery.slice(0, 3), 20)
  }
  const result: WordLookupResult = {
    word: query,
    definitions: [],
    translations: [],
    homonyms: [],
    examples: [],
    suggestedWords: fuzzyResults.map((r) => ({
      word: r.headword,
      shortDefinition: "fuzzy match",
    })),
  }

  return NextResponse.json(result)
}
