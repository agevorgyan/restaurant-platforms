import { IRewardPolicy } from '../entities/reward-policy.interface';

export interface IRewardPolicyRepository {
  findById(id: string): Promise<IRewardPolicy | null>;
  findByRestaurantId(restaurantId: string): Promise<IRewardPolicy[]>;
  save(policy: IRewardPolicy): Promise<void>;
}
