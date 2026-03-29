'use server';

import { generateText, Output, TypeValidationError } from 'ai';
import { groq } from '../../../shared/lib/ai/groq.client';
import { aiFeedbackSchema } from '../schemas/ai-feedback.schema';

export async function getLyricsFeedback(lyrics: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('AI Provider configuration is missing. Please check your environment variables.');
  }

  if (!lyrics || lyrics.trim() === '') {
    throw new Error('Lyrics cannot be empty');
  }

  try {
    const { output } = await generateText({
      model: groq('llama3-8b-8192'),
      output: Output.object({ schema: aiFeedbackSchema }),
      system: 
        'You are an expert Bisaya rap producer and lyricist. ' +
        'Analyze the provided Bisaya rap lyrics. Focus on rhythm, rhyme scheme, flow, and vocabulary. ' +
        'Provide constructive feedback, point out specific flow issues, and offer general suggestions for improvement.',
      prompt: lyrics,
    });

    return output;
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    
    if (error instanceof TypeValidationError) {
      throw new Error('The AI generated an invalid response format that did not match our schema. Please try again.');
    }
    
    throw new Error('Failed to generate AI feedback. Please check your provider configuration or try again later.');
  }
}
