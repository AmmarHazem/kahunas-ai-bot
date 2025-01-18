import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  readonly prompt: string;
}
