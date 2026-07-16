import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { RestaurantMembershipService } from '../../application/services/restaurant-membership.service';
import { CreateRestaurantMembershipDto, UpdateRestaurantMembershipDto } from '../../application/dto/restaurant-membership.dto';

@Controller('restaurant-memberships')
export class RestaurantMembershipController {
  constructor(private readonly membershipService: RestaurantMembershipService) {}

  @Post()
  async create(@Body() dto: CreateRestaurantMembershipDto) {
    return this.membershipService.create(dto);
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.membershipService.findByRestaurant(restaurantId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.membershipService.findByUser(userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRestaurantMembershipDto) {
    return this.membershipService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membershipService.remove(id);
  }
}
