import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './modules/identity/identity.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

@Module({
  imports: [IdentityModule, RestaurantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
