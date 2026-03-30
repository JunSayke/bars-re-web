import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSynonyms } from "@junsayke/cebuano-thesaurus"

export const runtime = "nodejs"
import type { SynonymEntry, SynonymResult } from "@/modules/workspace/types/thesaurus.types"

const querySchema = z.object({
  query: z.string().min(1, "query is required"),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const raw = { query: searchParams.get("query") ?? "" }
  const parsed = querySchema.safeParse(raw)

  if (!parsed.success) {
    return NextResponse.json({ error: "query is required" }, { status: 400 })
  }

  const { query } = parsed.data
  const pkgEntries = await getSynonyms(query)

  const synonyms: SynonymEntry[] = pkgEntries.slice(0, 25).map((e) => ({
    word: e.headword,
    pos: e.pos,
  }))

  const result: SynonymResult = { query, synonyms }
  return NextResponse.json(result)
}
