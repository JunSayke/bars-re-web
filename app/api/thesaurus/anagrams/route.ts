import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAnagrams } from "@junsayke/cebuano-thesaurus"

export const runtime = "nodejs"
import type { AnagramEntry, AnagramResult } from "@/modules/workspace/types/thesaurus.types"

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
  const pkgEntries = await getAnagrams(query, 25)

  const anagrams: AnagramEntry[] = pkgEntries.map((e) => ({
    word: e.headword,
    pos: e.pos,
  }))

  const result: AnagramResult = { query, anagrams }
  return NextResponse.json(result)
}
