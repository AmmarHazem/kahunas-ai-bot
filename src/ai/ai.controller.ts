import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  public async chat(
    @Body() chatRequestDto: ChatRequestDto,
  ): Promise<{ response: string }> {
    const response = await this.aiService.generateResponse(
      chatRequestDto.prompt,
    );
    return { response };
  }
}
