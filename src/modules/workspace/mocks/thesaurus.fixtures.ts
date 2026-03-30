import type { WordLookupResult, RhymeResult } from "../types/thesaurus.types"

export const mockThesaurusEntries: WordLookupResult[] = [
  {
    word: "balak",
    definitions: [
      "A poem or verse; a piece of written or spoken work in which special intensity is given to the expression of feelings and ideas.",
      "A song lyric or musical composition.",
    ],
    homonyms: [
      { word: "balak", partOfSpeech: "verb", shortDefinition: "To plan or intend" },
    ],
    translations: [
      { language: "English", translation: "poem" },
      { language: "English", translation: "verse" },
    ],
    examples: [
      { cebuano: "Nagsulat siya og balak alang sa iyang minahal.", english: "She wrote a poem for her beloved." },
    ],
    suggestedWords: [],
  },
  {
    word: "kanta",
    definitions: [
      "A song; a piece of music with words.",
      "The act of singing.",
    ],
    homonyms: [
      { word: "kanta", partOfSpeech: "verb", shortDefinition: "To sing" },
    ],
    translations: [
      { language: "English", translation: "song" },
      { language: "English", translation: "sing (verb)" },
    ],
    examples: [],
    suggestedWords: [],
  },
  {
    word: "damgo",
    definitions: [
      "A dream; a series of thoughts, images, and sensations occurring in a person's mind during sleep.",
      "A cherished aspiration or ideal.",
    ],
    homonyms: [
      { word: "damgo", partOfSpeech: "verb", shortDefinition: "To dream" },
    ],
    translations: [
      { language: "English", translation: "dream" },
      { language: "English", translation: "vision" },
    ],
    examples: [],
    suggestedWords: [],
  },
  {
    word: "gugma",
    definitions: ["Love; a strong feeling of affection."],
    homonyms: [],
    translations: [
      { language: "English", translation: "love" },
      { language: "English", translation: "affection" },
    ],
    examples: [],
    suggestedWords: [],
  },
  {
    word: "kinabuhi",
    definitions: [
      "Life; the condition that distinguishes living organisms.",
      "A person's existence or biography.",
    ],
    homonyms: [
      { word: "kinabuhi", partOfSpeech: "noun", shortDefinition: "Way of life; livelihood" },
    ],
    translations: [
      { language: "English", translation: "life" },
      { language: "English", translation: "existence" },
    ],
    examples: [],
    suggestedWords: [],
  },
]

export const mockWordLookupResult: WordLookupResult = mockThesaurusEntries[0]

export const mockRhymeResult: RhymeResult = {
  query: "dagat",
  candidates: [
    { word: "langit", rhymeType: "perfect", score: 0.95, syllableCount: 2 },
    { word: "hangin", rhymeType: "family", score: 0.8, syllableCount: 2 },
    { word: "tubig", rhymeType: "additive", score: 0.7, syllableCount: 2 },
  ],
  page: 1,
  pageSize: 20,
  hasNextPage: false,
}
