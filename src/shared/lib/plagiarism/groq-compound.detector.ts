import { generateText, Output } from "ai";
import { groq } from "../ai/groq.client";
import type { LyricsPlagiarismDetector } from "./detector.interface";
import { type PlagiarismCheckResult, type SongMatch, ConfidenceLevel } from "./types";
import { plagiarismDetectionSchema } from "./schema";

export class GroqCompoundDetector implements LyricsPlagiarismDetector {
  async detect(lyrics: string): Promise<PlagiarismCheckResult> {
    const start = Date.now();
    const models = ["groq/compound-mini", "openai/gpt-oss-120b"];
    
    for (const model of models) {
      try {
        const result = await this.tryModel(model, lyrics);
        if (result.hasMatches) return { ...result, durationMs: Date.now() - start };
      } catch (error) {
        continue;
      }
    }
    
    return { hasMatches: false, matches: [], durationMs: Date.now() - start };
  }

  private async tryModel(model: string, lyrics: string): Promise<PlagiarismCheckResult> {
    const prompt = `Search for songs with similar lyrics to: "${lyrics}". Focus on Bisaya/Cebuano songs. Return JSON: {"hasMatches":boolean,"matches":[{"songTitle":"","artist":"","confidence":"HIGH|MEDIUM|LOW","reason":"","sourceUrl":""}],"searchSummary":""}`;
    
    try {
      const result = await generateText({
        model: groq(model),
        output: Output.object({ schema: plagiarismDetectionSchema }),
        prompt,
      });
      return this.convert(result.output);
    } catch {
      const result = await generateText({
        model: groq(model),
        prompt,
      });
      return this.convert(this.parseJson(result.text));
    }
  }

  private parseJson(text: string): any {
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return plagiarismDetectionSchema.parse(JSON.parse(cleaned));
    } catch {
      return { hasMatches: false, matches: [], searchSummary: "Parse error" };
    }
  }

  private convert(response: any): PlagiarismCheckResult {
    const matches: SongMatch[] = response.matches.map((m: any) => ({
      songTitle: m.songTitle,
      artist: m.artist,
      confidence: ConfidenceLevel[m.confidence as keyof typeof ConfidenceLevel],
      sourceUrl: m.sourceUrl,
      matchContext: m.reason,
    }));
    
    return { hasMatches: response.hasMatches, matches, durationMs: 0 };
  }
}