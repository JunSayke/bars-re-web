export const workspaceKeys = {
  all: ["workspace"] as const,
  sessions: () => ["sessions"] as const,
  session: (id: string) => [...workspaceKeys.all, "session", id] as const,
  draft: (id: string) => [...workspaceKeys.all, "draft", id] as const,
  beatLibrary: () => [...workspaceKeys.all, "beatLibrary"] as const,
  beatLibraryRecent: (limit: number) => [...workspaceKeys.beatLibrary(), "recent", limit] as const,
  beatLink: (sessionId: string) => [...workspaceKeys.all, "beatLink", sessionId] as const,
}

export const snippetKeys = {
  snippets: () => ["snippets"] as const,
  snippet: (id: string) => ["snippets", id] as const,
}

export const thesaurusKeys = {
  all: ["thesaurus"] as const,
  lookup: (term: string) => [...thesaurusKeys.all, "lookup", term] as const,
  rhyme: (term: string, page: number) => [...thesaurusKeys.all, "rhyme", term, page] as const,
  synonyms: (term: string) => [...thesaurusKeys.all, "synonyms", term] as const,
  anagrams: (term: string) => [...thesaurusKeys.all, "anagrams", term] as const,
}
