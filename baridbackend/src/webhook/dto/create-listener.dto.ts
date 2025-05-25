import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LISTENER } from '../../../generated/prisma';

export class CreateListenerDto {
  @IsNotEmpty()
  @IsString()
  automationId: string;

  @IsNotEmpty()
  @IsEnum(LISTENER)
  type: LISTENER;
}
