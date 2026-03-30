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

export interface SynonymEntry {
  word: string
  pos?: string
}

export interface SynonymResult {
  query: string
  synonyms: SynonymEntry[]
}

export interface AnagramEntry {
  word: string
  pos?: string
}

export interface AnagramResult {
  query: string
  anagrams: AnagramEntry[]
}
