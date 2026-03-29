import { createGroq } from '@ai-sdk/groq';

// Initialize the official Groq provider instance
export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
