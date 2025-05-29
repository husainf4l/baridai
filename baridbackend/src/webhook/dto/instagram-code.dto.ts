import { IsNotEmpty, IsString } from 'class-validator';

export class InstagramCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
