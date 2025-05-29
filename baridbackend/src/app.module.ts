import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { IntegrationModule } from './integration/integration.module';
import { AutomationModule } from './automation/automation.module';
import { WebhookModule } from './webhook/webhook.module';
import { AiagentModule } from './aiagent/aiagent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    HealthModule,
    IntegrationModule,
    AutomationModule,
    WebhookModule,
    AiagentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
