import { z } from 'zod';

export const aiFeedbackSchema = z.object({
  score: z.number().min(1).max(10).describe('Overall score of the verse based on rhythm, rhyme scheme, and Bisaya vocabulary.'),
  flowIssues: z.array(
    z.object({
      line: z.string().describe('The specific line or phrase that has an issue.'),
      issue: z.string().describe('Brief explanation of the flow, rhythm, or rhyming issue.'),
      suggestion: z.string().describe('A suggested rewrite or fix.')
    })
  ).describe('Specific issues found in the lyrics regarding flow or rhythm.'),
  generalSuggestions: z.array(z.string()).describe('General advice for improving the overall rap verse.')
});

export type AiFeedback = z.infer<typeof aiFeedbackSchema>;
