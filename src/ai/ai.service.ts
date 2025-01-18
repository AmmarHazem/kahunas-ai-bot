import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLog } from '../database/chat-log.entity';
import { EvaluationService } from './evaluation.service';
import { PromptStats, QualityScores } from './types/stats.types';

@Injectable()
export class AiService {
  private readonly llm: ChatOpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly evaluationService: EvaluationService,
    @InjectRepository(ChatLog)
    private readonly chatLogRepository: Repository<ChatLog>,
  ) {
    this.llm = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo',
    });
  }

  async generateResponse({
    prompt,
    threadId,
  }: {
    prompt: string;
    threadId: string;
  }): Promise<string> {
    try {
      const response = await this.llm.invoke([
        new SystemMessage(
          `I want you to act as a personal trainer who is an expert in fitness and nutrition. Your role is to provide personalized workout routines, dietary advice, and guidance based on individual goals, preferences, and fitness levels. You should consider factors like exercise science, balanced nutrition, and safety. Provide clear, actionable advice and explanations behind your recommendations. Tailor the suggestions to fit diverse needs such as muscle building, weight loss, endurance training, or general health improvement. Respond in an encouraging, motivational, and professional tone.`,
        ),
        new HumanMessage(prompt),
      ]);
      const responseContent = response.content.toString();
      const evaluation = this.evaluationService.evaluateResponse(
        prompt,
        responseContent,
      );
      await this.chatLogRepository.save({
        threadId,
        prompt,
        response: responseContent,
        ...evaluation,
      });
      return responseContent;
    } catch (error) {
      console.error(`Error generating AI response: ${error.message}`, error);
      throw error;
    }
  }

  async getMostUsedPrompts(limit: number = 10): Promise<PromptStats[]> {
    return this.chatLogRepository
      .createQueryBuilder('chatLog')
      .select('chatLog.prompt', 'prompt')
      .addSelect('COUNT(*)', 'count')
      .groupBy('chatLog.prompt')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getAverageScores(): Promise<QualityScores> {
    const result = await this.chatLogRepository
      .createQueryBuilder('chatLog')
      .select('AVG(chatLog.relevanceScore)', 'averageRelevance')
      .addSelect('AVG(chatLog.clarityScore)', 'averageClarity')
      .addSelect('AVG(chatLog.toneScore)', 'averageTone')
      .addSelect('AVG(chatLog.overallScore)', 'averageOverall')
      .addSelect('COUNT(*)', 'totalResponses')
      .getRawOne();
    return {
      averageRelevance: Number(result.averageRelevance) || 0,
      averageClarity: Number(result.averageClarity) || 0,
      averageTone: Number(result.averageTone) || 0,
      averageOverall: Number(result.averageOverall) || 0,
      totalResponses: Number(result.totalResponses) || 0,
    };
  }
}
