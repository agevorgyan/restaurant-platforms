import { DiscountPolicy } from '../aggregates/discount-policy.aggregate';

export interface DiscountPolicyRepository {
  findById(id: string): Promise<DiscountPolicy | null>;
  save(policy: DiscountPolicy): Promise<void>;
  delete(id: string): Promise<void>;
}
