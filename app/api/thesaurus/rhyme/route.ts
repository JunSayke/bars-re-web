import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRhymes } from "@junsayke/cebuano-thesaurus"
import type {
  RhymeCandidate,
  RhymeResult,
} from "@/modules/workspace/types/thesaurus.types"

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

  const pkgCandidates = await getRhymes(query, { limit: 20, maxSyllableOffset: 1, randomness: 0 })

  const candidates: RhymeCandidate[] = pkgCandidates.map((c) => ({
    word: c.headword,
    rhymeType: c.rhymeType,
    score: c.score,
    syllableCount: c.syllableCount,
  }))

  const result: RhymeResult = { query, candidates }
  return NextResponse.json(result)
}
