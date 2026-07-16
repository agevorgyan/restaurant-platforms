import { Module } from '@nestjs/common';
import { RestaurantController } from './infrastructure/controllers';
import { RestaurantService } from './application/services';
import { InMemoryRestaurantRepository } from './infrastructure/repositories';

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: 'IRestaurantRepository',
      useClass: InMemoryRestaurantRepository,
    },
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
