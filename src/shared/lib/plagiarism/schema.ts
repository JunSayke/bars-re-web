import { z } from "zod";

export const plagiarismDetectionSchema = z.object({
  hasMatches: z.boolean(),
  matches: z.array(z.object({
    songTitle: z.string(),
    artist: z.string(),
    confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
    reason: z.string(),
    sourceUrl: z.string().optional(),
  })),
  searchSummary: z.string(),
});

/**
 * Inferred TypeScript type from the schema
 */
export type PlagiarismDetectionResponse = z.infer<typeof plagiarismDetectionSchema>;