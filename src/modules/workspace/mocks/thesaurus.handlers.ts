import { http, HttpResponse } from "msw"
import { mockThesaurusEntries, mockRhymeResult } from "./thesaurus.fixtures"

export const thesaurusHandlers = [
  http.get("/api/thesaurus/lookup", ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("query")?.trim().toLowerCase() ?? ""

    if (!query) {
      return HttpResponse.json(
        { error: "query is required" },
        { status: 400 }
      )
    }

    const match = mockThesaurusEntries.find(
      (entry) => entry.word.toLowerCase() === query
    )

    if (!match) {
      return HttpResponse.json(
        {
          word: query,
          definitions: [],
          homonyms: [],
          translations: [],
          examples: [],
          suggestedWords: [{ word: query, shortDefinition: "fuzzy match" }],
        },
        { status: 200 }
      )
    }

    return HttpResponse.json(match)
  }),

  http.get("/api/thesaurus/rhyme", ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("query")?.trim() ?? ""
    const page = parseInt(url.searchParams.get("page") ?? "1", 10)

    if (!query) {
      return HttpResponse.json(
        { error: "query is required" },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      ...mockRhymeResult,
      query,
      page,
    })
  }),
]
