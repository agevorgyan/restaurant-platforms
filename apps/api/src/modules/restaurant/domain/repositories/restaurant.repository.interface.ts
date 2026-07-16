import { IRestaurant } from '../entities';

export interface IRestaurantRepository {
  findById(id: string): Promise<IRestaurant | null>;
  findByOrganizationId(organizationId: string): Promise<IRestaurant[]>;
  save(restaurant: IRestaurant): Promise<IRestaurant>;
  delete(id: string): Promise<boolean>;
}
