import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers';
import { UserService } from './application/services';
import { InMemoryUserRepository } from './infrastructure/repositories';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UserService],
})
export class IdentityModule {}
