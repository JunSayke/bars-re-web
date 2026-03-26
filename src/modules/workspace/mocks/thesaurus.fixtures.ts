import type { WordLookupResult } from "../types/thesaurus.types"

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
  },
  {
    word: "gugma",
    definitions: ["Love; a strong feeling of affection."],
    homonyms: [],
    translations: [
      { language: "English", translation: "love" },
      { language: "English", translation: "affection" },
    ],
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
  },
]
