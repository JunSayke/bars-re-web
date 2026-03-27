export interface HomonymEntry {
  word: string
  partOfSpeech?: string
  shortDefinition?: string
}

export interface TranslationEntry {
  language: string
  translation: string
}

export interface WordLookupResult {
  word: string
  definitions: string[]
  homonyms: HomonymEntry[]
  translations: TranslationEntry[]
}
