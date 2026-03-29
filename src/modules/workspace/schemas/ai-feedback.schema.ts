import { z } from 'zod';

export const aiFeedbackSchema = z.object({
  score: z.number().min(1).max(10),
  
  syllableAnalysis: z.array(z.object({
    line: z.string(),
    syllableCount: z.number(),
    expectedCount: z.number(),
  })).describe('Per-line syllable count breakdown'),

  rhymeScheme: z.string().describe('Detected rhyme scheme, e.g. AABB, ABCB'),
  
  flowIssues: z.array(z.object({
    line: z.string(),
    issue: z.string(),
    suggestion: z.string(),
    severity: z.enum(['minor', 'moderate', 'major']),
  })),

  strengths: z.array(z.string()).describe('What is working well in the lyrics'),

  generalSuggestions: z.array(z.string()),
});

export type AiFeedback = z.infer<typeof aiFeedbackSchema>;
