import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatRequestDto } from './dto/chat-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLog } from '../database/chat-log.entity';
import { EvaluationService } from './evaluation.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model: ChatOpenAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ChatLog)
    private readonly chatLogRepository: Repository<ChatLog>,
    private readonly evaluationService: EvaluationService,
  ) {
    this.model = new ChatOpenAI({
      openAIApiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  async generateResponse({
    prompt,
    threadId,
  }: ChatRequestDto): Promise<string> {
    try {
      const response = await this.model.invoke([
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
      this.logger.error(
        `Error generating AI response: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
