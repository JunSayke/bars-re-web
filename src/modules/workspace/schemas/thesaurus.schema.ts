// @module:workspace @layer:schema @scope:module:workspace @deps:none
import { z } from "zod";

export const WordplayResponseSchema = z.object({
  isValidConcept: z.boolean().describe("False if the seed word is gibberish or impossible to write about"),
  errorMessage: z.string().optional().describe("A polite Bisaya error message if isValidConcept is false"),
  suggestions: z.array(z.object({
    couplet: z.array(z.string()).length(2),
    explanation: z.string(),
    englishTranslation: z.string(),
    qualityScore: z.number().min(1).max(100)
  })).optional()
});

export type WordplayResponse = z.infer<typeof WordplayResponseSchema>;
