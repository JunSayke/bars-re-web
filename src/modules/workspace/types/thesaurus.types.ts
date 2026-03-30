export interface HomonymEntry {
  word: string
  partOfSpeech?: string
  shortDefinition?: string
}

export interface TranslationEntry {
  language: string
  translation: string
}

export interface ExampleSentence {
  cebuano: string
  english: string
}

export interface WordLookupResult {
  word: string
  definitions: string[]
  homonyms: HomonymEntry[]
  translations: TranslationEntry[]
  examples: ExampleSentence[]
  suggestedWords: HomonymEntry[]
}

export interface RhymeCandidate {
  word: string
  rhymeType: "perfect" | "family" | "additive" | "assonance"
  score: number
  syllableCount: number
}

export interface RhymeResult {
  query: string
  candidates: RhymeCandidate[]
  page: number
  pageSize: number
  hasNextPage: boolean
}
