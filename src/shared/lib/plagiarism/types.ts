export enum ConfidenceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM", 
  LOW = "LOW",
}

export interface SongMatch {
  songTitle: string;
  artist: string;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  matchContext?: string;
}

export interface PlagiarismCheckResult {
  hasMatches: boolean;
  matches: SongMatch[];
  durationMs: number;
  error?: string;
}

export interface PlagiarismDetectionResponse {
  hasMatches: boolean;
  matches: Array<{
    songTitle: string;
    artist: string;
    confidence: "HIGH" | "MEDIUM" | "LOW";
    reason: string;
    sourceUrl?: string;
  }>;
  searchSummary: string;
}

export class PlagiarismDetectorError extends Error {
  constructor(
    message: string,
    public readonly category: "timeout" | "rate_limit" | "model_error" | "network_error" | "unknown",
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "PlagiarismDetectorError";
  }
}
