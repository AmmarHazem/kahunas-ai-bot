export interface PromptStats {
  prompt: string;
  count: number;
}

export interface QualityScores {
  averageRelevance: number;
  averageClarity: number;
  averageTone: number;
  averageOverall: number;
  totalResponses: number;
}
