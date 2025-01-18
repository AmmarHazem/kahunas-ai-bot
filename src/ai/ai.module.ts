import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLog } from '../database/chat-log.entity';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature([ChatLog])],
  controllers: [AiController],
  providers: [AiService, EvaluationService],
})
export class AiModule {}
