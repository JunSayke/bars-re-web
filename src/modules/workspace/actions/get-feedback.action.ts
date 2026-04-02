"use server";

import { generateText, Output, TypeValidationError } from "ai";
import { groq } from "../../../shared/lib/ai/groq.client";
import { google } from "../../../shared/lib/ai/google.client";
import { aiFeedbackSchema } from "../schemas/ai-feedback.schema";
import { createDetector } from "../../../shared/lib/plagiarism/detector.factory";
import type { PlagiarismCheckResult } from "../../../shared/lib/plagiarism/types";

/**
 * System prompt defined outside to keep the main function clean (SRP).
 * Includes few-shot examples to guide the AI on tone and technical depth.
 *
 * @param plagiarismContext - Optional plagiarism detection results to inform the AI
 */
function buildSystemPrompt(plagiarismContext?: string): string {
  const basePrompt = `
You are an expert Bisaya (Cebuano) rap producer and lyricist. You analyze lyrics for "Bagsak" (flow), "Garay" (rhyme), and "Kantidad" (syllable weight).

### Analysis Rules:
1. **Syllables:** Count carefully. Bisaya often uses glottal stops or elisions (e.g., "wala" becomes "wa'").
2. **Rhyme:** Check for "Garay sa tumoy" (end rhymes). AABB is common in Bisaya rap.
3. **Naturality:** Flag "Iningles" (English) or "Tagalog" words that feel forced.`;

  // Add plagiarism context if matches were found
  const plagiarismGuidance = plagiarismContext
    ? `

### IMPORTANT - Plagiarism Check:
${plagiarismContext}

**When providing feedback:**
- Include a note in the "generalSuggestions" about the potential match
- Encourage the artist to revise for originality if confidence is HIGH
- Mention that common phrases are acceptable if confidence is LOW
- Be supportive and constructive in tone`
    : "";

  const exampleSection = `

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
`;

  return basePrompt + plagiarismGuidance + exampleSection;
}

// Ordered list of models to try
const AI_PROVIDERS = [
  { model: google("gemini-3-flash-preview"), name: "Google Gemini 3 Flash" },
  { model: google("gemini-2.5-flash"), name: "Google Gemini 2.5 Flash" },
  {
    model: google("gemini-flash-lite-latest"),
    name: "Google Gemini 2.5 Flash Lite",
  },
  {
    model: google("gemini-3.1-flash-lite-preview"),
    name: "Google Gemini 3.1 Flash Lite",
  },
  { model: groq("openai/gpt-oss-120b"), name: "Groq GPT-OSS 120B" },
];

async function generateWithFallback(
  lyrics: string,
  plagiarismContext?: string,
) {
  const errors: string[] = [];

  for (const provider of AI_PROVIDERS) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);

      const { output } = await generateText({
        model: provider.model,
        output: Output.object({ schema: aiFeedbackSchema }),
        system: buildSystemPrompt(plagiarismContext),
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
        throw new Error("AI response format mismatch. Please try again.");
      }

      // Continue to next provider for rate limits or network errors
      continue;
    }
  }

  // All providers failed
  console.error("[AI] All providers failed:", errors);
  throw new Error("All AI providers failed. Please try again later.");
}

/**
 * Build plagiarism context string from check results.
 * This is passed to the main AI to inform feedback generation.
 */
function buildPlagiarismContext(
  result: PlagiarismCheckResult,
): string | undefined {
  if (!result.hasMatches || result.matches.length === 0) {
    return undefined;
  }

  const matchDescriptions = result.matches
    .map((match, index) => {
      return `${index + 1}. "${match.songTitle}" by ${match.artist} (Confidence: ${match.confidence})
   - ${match.matchContext || "Potential lyrical similarity detected"}
   ${match.sourceUrl ? `- Source: ${match.sourceUrl}` : ""}`;
    })
    .join("\n");

  return `PLAGIARISM CHECK RESULTS:
The following existing song(s) were found with similar lyrics:

${matchDescriptions}

Please inform the user about these matches in your generalSuggestions. 
- If confidence is HIGH, strongly encourage revision for originality and note potential copyright concerns.
- If confidence is MEDIUM, suggest reviewing for uniqueness.
- If confidence is LOW, mention that common phrases are acceptable but creativity is encouraged.`;
}

export async function getLyricsFeedback(lyrics: string) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GROQ_API_KEY) {
    throw new Error("AI Provider configuration is missing.");
  }

  if (!lyrics?.trim()) {
    throw new Error("Lyrics cannot be empty");
  }

  // Step 1: Run plagiarism check (with error handling to ensure feedback still works)
  let plagiarismContext: string | undefined;
  try {
    const detector = createDetector();

    if (detector) {
      console.log("[AI] Running plagiarism check...");
      const plagiarismResult = await detector.detect(lyrics);

      if (plagiarismResult.hasMatches) {
        console.log(
          `[AI] Found ${plagiarismResult.matches.length} potential match(es)`,
        );
        plagiarismContext = buildPlagiarismContext(plagiarismResult);
      } else {
        console.log("[AI] No plagiarism matches found");
      }
    } else {
      console.log("[AI] Plagiarism check disabled");
    }
  } catch (error) {
    // Log error but don't fail the request
    console.error("[AI] Plagiarism check failed:", error);
    // Proceed without plagiarism context
  }

  // Step 2: Generate feedback (with or without plagiarism context)
  return generateWithFallback(lyrics, plagiarismContext);
}
