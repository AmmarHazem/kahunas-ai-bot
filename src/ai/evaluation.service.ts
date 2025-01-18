import { Injectable } from '@nestjs/common';

interface EvaluationResult {
  relevanceScore: number;
  clarityScore: number;
  toneScore: number;
  overallScore: number;
}

@Injectable()
export class EvaluationService {
  evaluateResponse(prompt: string, response: string): EvaluationResult {
    const relevanceScore = this.evaluateRelevance(prompt, response);
    const clarityScore = this.evaluateClarity(response);
    const toneScore = this.evaluateTone(response);
    const overallScore = (relevanceScore + clarityScore + toneScore) / 3;
    return {
      relevanceScore,
      clarityScore,
      toneScore,
      overallScore,
    };
  }

  private evaluateRelevance(prompt: string, response: string): number {
    const promptKeywords = new Set(prompt.toLowerCase().split(/\s+/));
    const responseWords = response.toLowerCase().split(/\s+/);
    const matchingWords = responseWords.filter((word) =>
      promptKeywords.has(word),
    ).length;
    return Math.min(matchingWords / promptKeywords.size, 1) * 5;
  }

  private evaluateClarity(response: string): number {
    const avgSentenceLength = this.calculateAvgSentenceLength(response);
    const score = 5 - Math.abs(15 - avgSentenceLength) / 5;
    return Math.max(Math.min(score, 5), 0);
  }

  private evaluateTone(response: string): number {
    const professionalWords = [
      'recommend',
      'suggest',
      'consider',
      'important',
      'should',
      'please',
      'best',
      'enjoy',
      'consistently',
      'consistant',
      'motivated',
      'motivate',
      'motivation',
      'motivational',
      'motivate',
      'advice',
    ];
    const words = response.toLowerCase().split(/\s+/);
    const professionalWordCount = words.filter((word) =>
      professionalWords.includes(word),
    ).length;
    return Math.min(professionalWordCount / 2, 5);
  }

  private calculateAvgSentenceLength(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const totalWords = sentences.reduce(
      (sum, sentence) => sum + sentence.trim().split(/\s+/).length,
      0,
    );
    return totalWords / sentences.length;
  }
}
