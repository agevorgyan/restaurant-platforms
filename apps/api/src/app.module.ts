import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './modules/identity/identity.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { SecurityModule } from './modules/security/security.module';
import { AutomationModule } from './modules/automation/automation.module';
import { IntegrationModule } from './modules/integration/integration.module';

@Module({
  imports: [
    IdentityModule,
    RestaurantModule,
    SecurityModule,
    AutomationModule,
    IntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
