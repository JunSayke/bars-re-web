import { type PlagiarismCheckResult } from "./types";

/**
 * Interface for lyrics plagiarism detection implementations.
 * Supports multiple strategies: AI web search, RAG, vector embeddings, external APIs.
 */
export interface LyricsPlagiarismDetector {
  detect(lyrics: string): Promise<PlagiarismCheckResult>;
}
