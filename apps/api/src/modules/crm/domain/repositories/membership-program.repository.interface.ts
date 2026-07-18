import { IMembershipProgram } from '../entities/membership-program.interface';

export interface IMembershipProgramRepository {
  findById(id: string): Promise<IMembershipProgram | null>;
  findActiveByRestaurantId(restaurantId: string): Promise<IMembershipProgram | null>;
  save(program: IMembershipProgram): Promise<void>;
}
