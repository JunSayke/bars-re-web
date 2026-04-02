import { GroqCompoundDetector } from "./groq-compound.detector";
import { type LyricsPlagiarismDetector } from "./detector.interface";

export function createDetector(): LyricsPlagiarismDetector | null {
  return new GroqCompoundDetector();
}