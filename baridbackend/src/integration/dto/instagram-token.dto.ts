import { IsNotEmpty, IsString } from 'class-validator';

export class InstagramTokenDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  redirectUri: string;
}
