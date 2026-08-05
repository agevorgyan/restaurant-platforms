import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './modules/identity/identity.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { SecurityModule } from './modules/security/security.module';
import { AutomationModule } from './modules/automation/automation.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { AiGatewayModule } from './modules/ai/ai-gateway.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PlatformHealthModule } from './modules/platform/platform-health.module';
import { GeneralLedgerModule } from './modules/accounting/general-ledger.module';

@Module({
  imports: [
    IdentityModule,
    RestaurantModule,
    SecurityModule,
    AutomationModule,
    IntegrationModule,
    AiGatewayModule,
    AnalyticsModule,
    PlatformHealthModule,
    GeneralLedgerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

