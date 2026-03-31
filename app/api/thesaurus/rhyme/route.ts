import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRhymes } from "@junsayke/cebuano-thesaurus"
export const runtime = "nodejs"
import type {
  RhymeCandidate,
  RhymeResult,
} from "@/modules/workspace/types/thesaurus.types"

const querySchema = z.object({
  query: z.string().min(1, "query is required"),
  page: z.coerce.number().int().positive().default(1),
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const raw = {
    query: searchParams.get("query") ?? "",
    page: searchParams.get("page") ?? "1",
  }
  const parsed = querySchema.safeParse(raw)

  if (!parsed.success) {
    return NextResponse.json({ error: "query is required" }, { status: 400 })
  }

  const { query, page } = parsed.data
  const PAGE_SIZE = 20
  const offset = (page - 1) * PAGE_SIZE

  const pkgCandidates = await getRhymes(query, { limit: PAGE_SIZE, offset, maxSyllableOffset: 1, randomness: 0 })

  const candidates: RhymeCandidate[] = pkgCandidates.map((c) => ({
    word: c.headword,
    rhymeType: c.rhymeType,
    score: c.score,
    syllableCount: c.syllableCount,
  }))

  const result: RhymeResult = {
    query,
    candidates,
    page,
    pageSize: PAGE_SIZE,
    hasNextPage: candidates.length === PAGE_SIZE,
  }
  return NextResponse.json(result)
}
