import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestaurantService } from '../../application/services';
import { CreateRestaurantDto, RestaurantResponseDto } from '../../application/dto';

@ApiTags('Restaurant')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'The restaurant has been successfully created.', type: RestaurantResponseDto })
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Return the restaurant.', type: RestaurantResponseDto })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  async getRestaurant(@Param('id') id: string): Promise<RestaurantResponseDto> {
    const restaurant = await this.restaurantService.getRestaurantById(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }
}
