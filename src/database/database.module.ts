import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLog } from './chat-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ai_bot.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChatLog]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

// @Module({
//     imports: [
//       TypeOrmModule.forRoot({
//         type: 'mysql',
//         host: process.env.DB_HOST,
//         port: parseInt(process.env.DB_PORT, 10) || 3306,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//         entities: [__dirname + '/**/*.entity{.ts,.js}'],
//         synchronize: true,
//       }),
//       TypeOrmModule.forFeature([ChatLog]),
//     ],
//     exports: [TypeOrmModule],
//   })
