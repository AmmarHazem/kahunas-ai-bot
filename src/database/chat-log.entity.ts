import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ChatLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  prompt: string;

  @Column('text')
  response: string;

  @Column('text', { nullable: true })
  threadId: string;

  @Column('float', { default: 0 })
  relevanceScore: number;

  @Column('float', { default: 0 })
  clarityScore: number;

  @Column('float', { default: 0 })
  toneScore: number;

  @Column('float', { default: 0 })
  overallScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
