'use server';

import { generateText, Output, TypeValidationError } from 'ai';
import { groq } from '../../../shared/lib/ai/groq.client';
import { google } from '../../../shared/lib/ai/google.client';
import { aiFeedbackSchema } from '../schemas/ai-feedback.schema';

/**
 * System prompt defined outside to keep the main function clean (SRP).
 * Includes few-shot examples to guide the AI on tone and technical depth.
 */
const BISAYA_RAP_SYSTEM_PROMPT = `
You are an expert Bisaya (Cebuano) rap producer and lyricist. You analyze lyrics for "Bagsak" (flow), "Garay" (rhyme), and "Kantidad" (syllable weight).

### Analysis Rules:
1. **Syllables:** Count carefully. Bisaya often uses glottal stops or elisions (e.g., "wala" becomes "wa'").
2. **Rhyme:** Check for "Garay sa tumoy" (end rhymes). AABB is common in Bisaya rap.
3. **Naturality:** Flag "Iningles" (English) or "Tagalog" words that feel forced.

### Example Interaction:

**User Lyrics:**
"Sayong gimulat sa reyalidad akong mga mata
Sayong nisabak sa bakbakan kalisod dakong kontra"

**Expert Feedback:**
{
  "score": 8,
  "syllableAnalysis": [
    { "line": "Sayong gimulat sa reyalidad akong mga mata", "syllableCount": 15, "expectedCount": 12 },
    { "line": "Sayong nisabak sa bakbakan kalisod dakong kontra", "syllableCount": 16, "expectedCount": 12 }
  ],
  "rhymeScheme": "AABB",
  "flowIssues": [
    {
      "line": "Sayong gimulat sa reyalidad akong mga mata",
      "issue": "Line is too long for a standard boom-bap beat.",
      "suggestion": "Mata gimulat sa pait nga reyalidad",
      "severity": "moderate"
    }
  ],
  "strengths": ["Strong imagery", "Good internal rhyme with 'sabak' and 'bakbakan'"],
  "generalSuggestions": ["Try to shorten the first two lines to keep the energy high."]
}
`

// Ordered list of models to try
const AI_PROVIDERS = [
  { model: google('gemini-2.5-flash'), name: 'Google Gemini Flash' },
  { model: groq('openai/gpt-oss-120b'), name: 'Groq GPT-OSS 120B' },
];

async function generateWithFallback(lyrics: string) {
  const errors: string[] = [];

  for (const provider of AI_PROVIDERS) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);

      const { output } = await generateText({
        model: provider.model,
        output: Output.object({ schema: aiFeedbackSchema }),
        system: BISAYA_RAP_SYSTEM_PROMPT,
        prompt: lyrics,
        temperature: 0.3,
      });

      console.log(`[AI] Success with ${provider.name}`);
      return output;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[AI] ${provider.name} failed: ${message}`);
      errors.push(`${provider.name}: ${message}`);

      // Don't fallback on schema validation errors — retrying won't help
      if (error instanceof TypeValidationError) {
        throw new Error('AI response format mismatch. Please try again.');
      }

      // Continue to next provider for rate limits or network errors
      continue;
    }
  }

  // All providers failed
  console.error('[AI] All providers failed:', errors);
  throw new Error('All AI providers failed. Please try again later.');
}

export async function getLyricsFeedback(lyrics: string) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GROQ_API_KEY) {
    throw new Error('AI Provider configuration is missing.');
  }

  if (!lyrics?.trim()) {
    throw new Error('Lyrics cannot be empty');
  }

  return generateWithFallback(lyrics);
}