import { Promotion } from '../aggregates/promotion.aggregate';
import { PromotionId } from '../value-objects/promotion-id.value-object';

export interface PromotionRepository {
  findById(id: PromotionId): Promise<Promotion | null>;
  save(promotion: Promotion): Promise<void>;
  delete(id: PromotionId): Promise<void>;
}
