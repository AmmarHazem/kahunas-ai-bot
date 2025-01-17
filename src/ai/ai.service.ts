import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    this.model = new ChatOpenAI({
      openAIApiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  public async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      return response.content.toString();
    } catch (error) {
      this.logger.error(
        `Error generating AI response: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
