import { Injectable, Inject } from '@nestjs/common';
import { IRestaurantRepository, IRestaurant } from '../../domain';
import { CreateRestaurantDto, RestaurantResponseDto } from '../dto';
import { RestaurantCreatedEvent } from '../../domain/events';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('IRestaurantRepository') private readonly restaurantRepository: IRestaurantRepository,
  ) {}

  async createRestaurant(dto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    const restaurant: IRestaurant = {
      id: Math.random().toString(36).substring(7),
      name: dto.name,
      slug: dto.slug,
      organizationId: dto.organizationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedRestaurant = await this.restaurantRepository.save(restaurant);

    const event = new RestaurantCreatedEvent(savedRestaurant.id, savedRestaurant.organizationId, savedRestaurant.name);
    console.log('Event emitted:', event);

    return this.mapToResponse(savedRestaurant);
  }

  async getRestaurantById(id: string): Promise<RestaurantResponseDto | null> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) return null;
    return this.mapToResponse(restaurant);
  }

  private mapToResponse(restaurant: IRestaurant): RestaurantResponseDto {
    return {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      organizationId: restaurant.organizationId,
      isActive: restaurant.isActive,
      createdAt: restaurant.createdAt,
    };
  }
}
