import { http, HttpResponse } from "msw"
import { mockThesaurusEntries } from "./thesaurus.fixtures"

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
        { word: query, definitions: [], homonyms: [], translations: [] },
        { status: 200 }
      )
    }

    return HttpResponse.json(match)
  }),
]
