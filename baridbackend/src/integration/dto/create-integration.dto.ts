import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { INTEGRATIONS } from '../../../generated/prisma';

export class CreateIntegrationDto {
  @IsEnum(INTEGRATIONS)
  name: INTEGRATIONS;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  expiresAt: Date;

  @IsOptional()
  @IsString()
  instagramId?: string;
}
