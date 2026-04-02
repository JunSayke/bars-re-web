// @module:workspace @layer:action @scope:module:workspace @deps:schema:thesaurus.schema
"use server";

import { generateText, Output, TypeValidationError } from "ai";
import { google } from "@/shared/lib/ai/google.client";
import { groq } from "@/shared/lib/ai/groq.client";
import { WordplayResponseSchema } from "../schemas/thesaurus.schema";

/**
 * System prompt defined outside to keep the main function clean (SRP).
 * Includes few-shot examples to guide the AI on tone and expected structure.
 */
const BISAYA_WORDPLAY_SYSTEM_PROMPT = `
You are an expert Bisaya lyricist and battle rapper.
The user wants creative wordplay (metaphors, puns, idioms) in Bisaya about the provided concept.

TASK:
1. If the word is complete gibberish (e.g. "asdfg"), set isValidConcept to false and provide a polite Bisaya errorMessage.
2. Otherwise, set isValidConcept to true and generate 3-5 rhyming couplets (2 lines each) based on the seed word.
3. Rank them from best (most clever/poetic) to least using qualityScore (1-100).

### EXAMPLES:

**Example 1: Valid Concept**
Concept: "adlaw"
Available Context: Rely on native Bisaya knowledge.
Expected Output:
{
  "isValidConcept": true,
  "suggestions": [
    {
      "couplet": [
        "Init pas adlaw ang akong kadasig,",
        "Bisan uhaw, sa damgo ko magsalig."
      ],
      "explanation": "Metaphor comparing determination to the heat of the sun, using the rhyme uhaw (thirsty) and magsalig.",
      "englishTranslation": "My determination is hotter than the sun / Even when thirsty, I trust my dreams.",
      "qualityScore": 95
    },
    {
      "couplet": [
        "Sama sa adlaw nga mosalop sa kasadpan,",
        "Ang atong kagahapon dili na balikan."
      ],
      "explanation": "Comparing a setting sun to leaving the past behind.",
      "englishTranslation": "Like the sun setting in the west / Our past will never be returned to.",
      "qualityScore": 85
    }
  ]
}

**Example 2: Gibberish Concept**
Concept: "asdf123"
Available Context: Rely on native Bisaya knowledge.
Expected Output:
{
  "isValidConcept": false,
  "errorMessage": "Pasensya, dili ko makahimo og garay ani nga pulong. Palihug suwayi og laing pulong nga Bisaya (Sorry, I can't make a rhyme for this word. Please try another Bisaya word)."
}
`;

// Ordered list of models to try
const AI_PROVIDERS = [
  { model: google('gemini-3-flash-preview'), name: 'Google Gemini 3 Flash' },
  { model: google('gemini-2.5-flash'), name: 'Google Gemini 2.5 Flash' },
  { model: google('gemini-flash-lite-latest'), name: 'Google Gemini 2.5 Flash Lite' },
  { model: google('gemini-3.1-flash-lite-preview'), name: 'Google Gemini 3.1 Flash Lite' },
  { model: groq('openai/gpt-oss-120b'), name: 'Groq GPT-OSS 120B' },
];

async function generateWithFallback(targetWord: string, contextString: string) {
  const errors: string[] = [];

  for (const provider of AI_PROVIDERS) {
    try {
      console.log(`[AI] Trying ${provider.name} for wordplay...`);

      const { output } = await generateText({
        model: provider.model,
        output: Output.object({ schema: WordplayResponseSchema }),
        system: BISAYA_WORDPLAY_SYSTEM_PROMPT,
        prompt: `Concept: "${targetWord}"\nAVAILABLE CONTEXT (RAG): ${contextString}`,
        temperature: 0.7, // slightly higher temperature for creative wordplay
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

export async function generateWordplayAction(seed: string) {
  if (!seed || seed.trim().length === 0) {
    return { error: "Palihug pagbutang og pulong (Please enter a word)." };
  }

  const targetWord = seed.trim().toLowerCase();

  try {
    // Note: If you have existing thesaurus services, you can call them here
    const contextString = "Rely on native Bisaya knowledge.";

    const data = await generateWithFallback(targetWord, contextString);
    
    return { data };
  } catch (error: any) {
    console.error("Failed to generate wordplay:", error);
    return { 
      error: error.message || "Wala makahimo og garay karon. Suwayi og usab. (Failed to generate. Try again.)" 
    };
  }
}