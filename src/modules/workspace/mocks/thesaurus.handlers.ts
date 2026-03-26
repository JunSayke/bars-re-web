import { http, HttpResponse } from "msw"
import { mockThesaurusEntries } from "./thesaurus.fixtures"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const thesaurusHandlers = [
  http.get(`${BASE}/thesaurus/lookup`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("query")?.trim().toLowerCase() ?? ""

    if (!query) {
      return HttpResponse.json(
        { word: "", definitions: [], homonyms: [], translations: [] },
        { status: 200 }
      )
    }

    const match = mockThesaurusEntries.find(
      (entry) => entry.word.toLowerCase() === query
    )

    if (!match) {
      return HttpResponse.json(
        { word: query, definitions: [], homonyms: [], translations: [] },
        { status: 200 }
      )
    }

    return HttpResponse.json(match)
  }),
]
