import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { MostUsedPromptsDto } from './dto/most-used-prompts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/auth/entities/UserRole';
import { Roles } from 'src/auth/guards/Role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from 'src/auth/entities/RequestUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  public async chat(
    @Body() chatRequestDto: ChatRequestDto,
    @Req() req: ExpressRequest,
  ) {
    const user = req.user as RequestUser;
    const response = await this.aiService.generateResponse({
      prompt: chatRequestDto.prompt,
      threadId: user?.id,
    });
    return { response };
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('prompts/most-used')
  public async getMostUsedPrompts(@Query() query: MostUsedPromptsDto) {
    const prompts = await this.aiService.getMostUsedPrompts(query.limit);
    return { prompts };
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('stats/quality')
  public async getQualityStats() {
    const stats = await this.aiService.getAverageScores();
    return { stats };
  }
}
