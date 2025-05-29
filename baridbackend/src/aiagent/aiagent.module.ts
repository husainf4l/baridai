import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiagentController } from './aiagent.controller';
import { AiagentService } from './aiagent.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiagentController],
  providers: [AiagentService],
  exports: [AiagentService],
})
export class AiagentModule {}
