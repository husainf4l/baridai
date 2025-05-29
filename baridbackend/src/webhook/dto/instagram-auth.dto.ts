import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InstagramAuthDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;
}
