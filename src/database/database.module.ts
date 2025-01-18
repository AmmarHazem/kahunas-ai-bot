import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLog } from './chat-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ai_bot.db',
      entities: [ChatLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChatLog]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
