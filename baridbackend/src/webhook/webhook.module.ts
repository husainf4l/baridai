import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [PrismaModule, IntegrationModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
