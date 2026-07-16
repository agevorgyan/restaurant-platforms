import { Module } from '@nestjs/common';
import { RestaurantController, BranchController } from './infrastructure/controllers';
import { RestaurantService, BranchService } from './application/services';
import { InMemoryRestaurantRepository, InMemoryBranchRepository } from './infrastructure/repositories';

@Module({
  controllers: [RestaurantController, BranchController],
  providers: [
    RestaurantService,
    BranchService,
    {
      provide: 'IRestaurantRepository',
      useClass: InMemoryRestaurantRepository,
    },
    {
      provide: 'IBranchRepository',
      useClass: InMemoryBranchRepository,
    },
  ],
  exports: [RestaurantService, BranchService],
})
export class RestaurantModule {}
