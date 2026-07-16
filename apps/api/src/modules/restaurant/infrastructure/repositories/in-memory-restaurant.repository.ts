import { Injectable } from '@nestjs/common';
import { IRestaurantRepository, IRestaurant } from '../../domain';

@Injectable()
export class InMemoryRestaurantRepository implements IRestaurantRepository {
  private readonly restaurants: Map<string, IRestaurant> = new Map();

  async findById(id: string): Promise<IRestaurant | null> {
    return this.restaurants.get(id) || null;
  }

  async findByOrganizationId(organizationId: string): Promise<IRestaurant[]> {
    const results: IRestaurant[] = [];
    for (const restaurant of this.restaurants.values()) {
      if (restaurant.organizationId === organizationId) {
        results.push(restaurant);
      }
    }
    return results;
  }

  async save(restaurant: IRestaurant): Promise<IRestaurant> {
    this.restaurants.set(restaurant.id, restaurant);
    return restaurant;
  }

  async delete(id: string): Promise<boolean> {
    return this.restaurants.delete(id);
  }
}
