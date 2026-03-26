/**
 * Counts the number of syllables in a string using a heuristic vowel-run
 * algorithm suitable for Bisaya/Filipino phonology.
 *
 * Rules:
 * - Split text into words (whitespace-separated, non-empty)
 * - For each word, count contiguous vowel groups (a, e, i, o, u)
 * - Each vowel group = 1 syllable
 * - Minimum 1 syllable per non-empty word (handles consonant-only tokens)
 * - Empty input returns 0
 *
 * Inline examples (expected outputs):
 *   countSyllables("gabi")      → 2  (ga-bi: vowel groups "a", "i")
 *   countSyllables("maayo")     → 2  (ma-a-yo… but "aa" is one group → "a","o" = 2)
 *   countSyllables("kalipay")   → 3  (ka-li-pay: "a","i","a" = 3)
 *   countSyllables("lingaw")    → 2  (li-ngaw: "i","a" = 2)
 *   countSyllables("salamat")   → 3  (sa-la-mat: "a","a","a" = 3)
 *   countSyllables("bisdak")    → 2  (bis-dak: "i","a" = 2)
 *   countSyllables("unsa")      → 2  (un-sa: "u","a" = 2)
 */
export function countSyllables(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.reduce((total, word) => {
    const vowelGroups = word.match(/[aeiouAEIOU]+/g)
    const count = vowelGroups ? vowelGroups.length : 0
    return total + Math.max(1, count)
  }, 0)
}
